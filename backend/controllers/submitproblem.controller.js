import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { redis } from "../utils/redis.js";
import User from "../models/user.model.js";
import fetch from "node-fetch";

export const submitProblem = async (req, res) => {
  try {
    const { problem_id, code, language, input, output } = req.body;
    const user = req.user?._id || null;

    // Validate
    if (!problem_id || !code || !language || input == null || output == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let problem = await redis.get(`problem-${problem_id}`);
    if (!problem) {
      problem = await Problem.findById(problem_id);
      await redis.set(`problem-${problem_id}`, JSON.stringify(problem), { EX: 3600 });
    } 
    const languageMap = {
      cpp: 54,
      python: 71,
      java: 62,
      javascript: 63,
      c: 50,
    };

    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const judgeRes = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": " 4cf5577ad3msh49030f30c9ecf24p19aa61jsnd37bea5813b1",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({ 
        language_id,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(input).toString("base64"),
        cpu_time_limit: 1,
        memory_limit: 1024 * 1024,
      }),
    });

    const result = await judgeRes.json();
    const status = result.status?.description || "Unknown";
    

    let errorMessage = "";

    // Decode base64-encoded compile_output if it exists
    function decodeBase64(str) {
      try {
        return Buffer.from(str, "base64").toString("utf-8").trim();
      } catch (e) {
        return "Error decoding base64";
      }
    }

    const actualOutput = (decodeBase64(result.stdout) || "").trim();
    const expectedOutput = (output || "").trim();


    if (result.stderr?.trim()) {
      errorMessage = result.stderr.trim();
    } else if (result.compile_output?.trim()) {
      errorMessage = decodeBase64(result.compile_output);
    } else if (result.message?.trim()) {
      errorMessage = result.message.trim();
    }


    let finalResult = "Rejected";

    if (status === "Accepted") {
      finalResult = actualOutput === expectedOutput ? "Accepted" : "Wrong Answer";
    } else if (["Time Limit Exceeded", "Memory Limit Exceeded", "Runtime Error"].includes(status)) {
      finalResult = status;
    } else {
      finalResult = status;
    }

    return res.status(200).json({
      message: "Submission evaluated",
      result: finalResult,
      error: errorMessage,
      output: actualOutput,
    });

  } catch (error) {
    console.error("Submit Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const addSubmission = async (req, res) => {
  try {
    const { problem, user, code, language, result, total, noofpassed } = req.body;

    if (!problem || !user || !code || !language || !result) {
      return res.status(400).json({ message: "Missing required fields in submission" });
    }

    // Save submission
    const saved = await Submission.create({ problem, user, code, language, result, total, noofpassed });
    res.status(200).json({ message: "Submission added successfully" , saved });

    const subs = await Submission.find({ problem, user });
    await redis.set(`submissions-${problem}-${user}`, JSON.stringify(subs), { EX: 3600 });



    if (result === "Accepted") {
      const alreadyAccepted = await Submission.exists({ problem, user, result: "Accepted", _id: { $ne: saved._id } });

      if (!alreadyAccepted) {
        const prob = await Problem.findById(problem);

        if (prob.difficulty === "easy") {
          await User.updateOne({ _id: user }, { $inc: { easy: 1, problemssolved: 1 } });
        } else if (prob.difficulty === "medium") {
          await User.updateOne({ _id: user }, { $inc: { medium: 1, problemssolved: 1 } });
        } else if (prob.difficulty === "hard") {
          await User.updateOne({ _id: user }, { $inc: { hard: 1, problemssolved: 1 } });
        }

        await Problem.updateOne({ _id: problem }, { $inc: { acceptance: 1 } });
        const updatedProblem = await Problem.findById(problem);
        await redis.set(`problem-${problem}`, JSON.stringify(updatedProblem), { EX: 3600 });
        const problems = await Problem.find({}).lean().select('id name acceptance difficulty tags _id');
        await redis.set("problems", JSON.stringify(problems), { EX: 3600 });
      }
    }

  } catch (error) {
    console.error("Add Submission Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
