import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { redis } from "../utils/redis.js";
import User from "../models/user.model.js";
import fetch from "node-fetch";

export const submitProblem = async (req, res) => {
  try {
    const { problem_id, code, language, input, output } = req.body;
    const user = req.user._id;
 
    // Get problem from cache or DB
    let problem = await redis.get(`problem-${problem_id}`);
    if (!problem) {
      problem = await Problem.findById(problem_id);
      await redis.set(`problem-${problem_id}`, JSON.stringify(problem), { EX: 3600 });
    } else {
      problem = problem; 
    }

    // Judge0 language_id mapping
    let language_id = null;
    if (language === "python") language_id = 71;
    else if (language === "cpp") language_id = 54;
    else if (language === "java") language_id = 91;

    // Submit to Judge0
    const judgeRes = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "189f1cbabdmsh66286391cf081dap1da827jsn146955347166",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({  
        language_id,
        source_code: code,
        stdin: input,
        cpu_time_limit: 1,           // 1 second
        memory_limit: 1024 * 1024,   // 1 GB
      }),
    });

    const result = await judgeRes.json();
    const timeTaken = result.time || "0.0";
    const status = result.status?.description || "Unknown";
    const actualOutput = (result.stdout || "").trim();
    const expectedOutput = (output || "").trim();

    let finalResult = "Rejected";

    if (status === "Accepted") {
      if (actualOutput === expectedOutput) {
        finalResult = "Accepted";
      } else {
        finalResult = "Wrong Answer";
      }
    } else if (status === "Time Limit Exceeded") {
      finalResult = "Time Limit Exceeded";
    } else if (status === "Memory Limit Exceeded") {
      finalResult = "Memory Limit Exceeded";
    } else if (status === "Runtime Error") {
      finalResult = "Runtime Error";
    } else {
      finalResult = status;
    }

    // Send result to frontend
    return res.status(200).json({
      message: "Submission evaluated",
      result: finalResult,
      error: result.stderr,
      output: actualOutput,
    });

  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const addSubmission = async (req, res) => {
  try {
    console.log("Submission request body:", req.body);

    const { problem, user, code, language, result, total, noofpassed } = req.body;

    if (!problem || !user || !code || !language || !result) {
      return res.status(400).json({ message: "Missing required fields in submission" });
    }

    // Save submission
    const saved = await Submission.create({ problem, user, code, language, result, total, noofpassed });
    await redis.set(`submissions-${problem}-${user}`, JSON.stringify(saved), { EX: 3600 });


    res.status(200).json({ message: "Submission added successfully" , saved });

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
    return ;

  } catch (error) {
    console.error("Add Submission Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
