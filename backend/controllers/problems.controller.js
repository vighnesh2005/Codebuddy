import {Problem , Tag } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { Solution } from "../models/solution.model.js";
import { ProblemDiscussion } from "../models/problemdiscussion.model.js";
import { redis } from "../utils/redis.js";

export const getProblems = async (req, res) => {
  const { isLoggedIn, id } = req.body;

  try {
    // PROBLEMS
    let problemsCache = await redis.get("problems");
    let problems = problemsCache ? JSON.parse(problemsCache) : null;
    if (!problems) {
      problems = await Problem.find({});
      await redis.set("problems", JSON.stringify(problems),{ EX: 3600 });
    }

    // TAGS
    let tagsCache = await redis.get("tags");
    let tags = tagsCache ? JSON.parse(tagsCache) : null;
    if (!tags) {
      tags = await Tag.find({});
      await redis.set("tags", JSON.stringify(tags),{ EX: 3600 });
    }

    // SOLVED
    let solved = [];
    if (isLoggedIn && id) {
      let solvedCache = await redis.get(`solved-${id}`);
      solved = solvedCache ? JSON.parse(solvedCache) : null;

      if (!solved) {
        solved = await Submission.find({ result: "Accepted", user: id }).select("problem");
        await redis.set(`solved-${id}`, JSON.stringify(solved),{ EX: 3600 });
      }
    }

    return res.status(200).json({ problems, tags, solved });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
}


export const getProblem = async (req,res)=>{
    const { isLoggedIn, id , user} = req.body;
    
    try {
        const cachedProblem = await redis.get(`problem-${id}`);
        let problem = cachedProblem ? JSON.parse(cachedProblem) : null;
        if(!problem){
            problem = await Problem.findById(id);
            await redis.set(`problem-${id}`,JSON.stringify(problem),{ EX: 3600 });
        }
        const cachedSolution = await redis.get(`solution-${id}`);
        let solution = cachedSolution ? JSON.parse(cachedSolution) : null;
        if(!solution){
            solution = await Solution.findOne({problem : id});
            await redis.set(`solution-${id}`,JSON.stringify(solution),{ EX: 3600 });
        }
        let submissions = [];

        if(isLoggedIn && user){
            const cachedSubmissions = await redis.get(`submissions-${id}-${user}`);
            submissions = cachedSubmissions ? JSON.parse(cachedSubmissions) : null;
            if(!submissions){
                submissions = await Submission.find({problem : id , user});
                await redis.set(`submissions-${id}-${user}`,JSON.stringify(submissions),{ EX: 3600 });
            }
        } 
        return res.status(200).json({ problem, solution, submissions });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const discussions = async (req, res) => {
  const { id } = req.body;
  try {
    
    const discussions = await ProblemDiscussion.find({ problem: id });
    return res.status(200).json({ discussions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};