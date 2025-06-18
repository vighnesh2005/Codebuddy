import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { redis } from "../utils/redis.js";
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
    console.log("Submission request body:", req.body);  // <-- add this

    const saved = await Submission.create(req.body);  // ← submission should be an object

    await redis.set(`submissions-${saved.problem}-${saved.user}`, JSON.stringify(saved), { EX: 3600 });
    res.status(200).json({ message: "Submission added successfully" });
  } catch (error) {
    console.error("Add Submission Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}; 
