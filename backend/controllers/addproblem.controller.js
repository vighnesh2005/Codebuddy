// controllers/addProblem.controller.js
import { Problem, Tag } from "../models/problem.model.js";
import { Solution } from "../models/solution.model.js";
import { redis } from "../utils/redis.js";

export const addProblem = async (req, res) => {
  try {
    const { problem, solutions } = req.body;

    if (!problem || !problem.name || !Array.isArray(solutions)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const newProblem = await Problem.create(problem);

    const createdSolutions = await Promise.all(
      solutions.map((sol) => Solution.create({ ...sol, problem: newProblem._id }))
    );

    // Create or update tag totals using upsert
    await Promise.all(
      problem.tags.map((tag) =>
        Tag.updateOne({ name: tag }, { $inc: { total: 1 } }, { upsert: true })
      )
    );

    // Refresh Redis cache
    await redis.set("tags", JSON.stringify(await Tag.find({}).lean()), { EX: 3600 });
    await redis.set(`problem-${newProblem._id}`, JSON.stringify(newProblem.toJSON()), { EX: 3600 });
    await redis.set(`solution-${newProblem._id}`, JSON.stringify(createdSolutions.map(s => s.toJSON())), { EX: 3600 });

    return res.status(200).json({
      message: "Problem added successfully",
      problem: newProblem,
      solutions: createdSolutions,
    });

  } catch (error) {
    console.error("AddProblem Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
  
