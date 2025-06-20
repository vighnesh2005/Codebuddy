import { Problem, Tag } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { Solution } from "../models/solution.model.js";
import { ProblemDiscussion } from "../models/problemdiscussion.model.js";
import { redis } from "../utils/redis.js";

export const getProblems = async (req, res) => {
  const { isLoggedIn, id } = req.body;
  
  try {
    
    const problemsCache = await redis.get("problems");
      let problems = problemsCache ? problemsCache : null;
    if (!problems) {
      problems = await Problem.find({}).lean().select('id name acceptance difficulty tags _id');
      await redis.set("problems", JSON.stringify(problems), { EX: 3600 });
    }

    const tagsCache = await redis.get("tags");
    let tags = tagsCache ? tagsCache : null;
    if (!tags) {
      tags = await Tag.find({}).lean().select('name total ');
      await redis.set("tags", JSON.stringify(tags), { EX: 3600 });
    }

    let solved = [];
    if (isLoggedIn && id) {
      const solvedCache = await redis.get(`solved-${id}`);
      const solvedArray = solvedCache ? solvedCache : null;
      if (solvedArray) {
        solved = solvedArray;
      } else {
        solved = await Submission.find({ result: "Accepted", user: id }).select("problem").lean();
        await redis.set(`solved-${id}`, JSON.stringify(solved), { EX: 3600 });
      }
    }

    return res.status(200).json({ problems, tags, solved });

  } catch (error) {
    console.error("GetProblems Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getProblem = async (req, res) => {
  const { isLoggedIn, id, user } = req.body;
  const problemId = id;
  try {
    const cachedProblem = await redis.get(`problem-${problemId}`);
    let problem = cachedProblem ? cachedProblem : null;

    if (!problem) {
      problem = await Problem.findById(problemId).lean();
      await redis.set(`problem-${problemId}`, JSON.stringify(problem), { EX: 3600 });
    }

    const cachedSolution = await redis.get(`solution-${problemId}`);
    let solution = cachedSolution ? cachedSolution : null;
    if (!solution) {
      solution = await Solution.find({ problem: problemId }).lean();
      await redis.set(`solution-${problemId}`, JSON.stringify(solution), { EX: 3600 });
    }

    let submissions = [];
    if (isLoggedIn === true) {
      console.log("Fetching submissions from cache");
      const cachedSubmissions = await redis.get(`submissions-${problemId}-${user}`);
      const parsedSubmissions = cachedSubmissions ? cachedSubmissions : null;

      if (parsedSubmissions) {
        submissions = parsedSubmissions;
      } else {
        console.log("Fetching submissions from database");
        submissions = await Submission.find({ problem: id, user: user }).lean();
        await redis.set(`submissions-${id}-${user}`, submissions, { EX: 3600 });
      }
    }

    return res.status(200).json({ problem, solution, submissions });

  } catch (error) {
    console.error("GetProblem Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const discussions = async (req, res) => {
  const { id } = req.body;
  try {
    const discussions = await ProblemDiscussion.find({ problem: id }).populate("user","username profile _id").lean();
    return res.status(200).json({discussions:discussions});
  } catch (error) {
    console.error("Discussions Error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const addComment = async (req,res)=>{
  const {id,comment,user_id,parent} = req.body;
  try {
    const newComment = await ProblemDiscussion.create({
      user:user_id,
      message:comment,
      problem:id,
      parent
    });
    let prevcomments = await redis.get(`comments-${id}`);
    prevcomments = prevcomments ? prevcomments : [];

    prevcomments.push(newComment);
    await redis.set(`comments-${id}`,prevcomments);
    res.status(201).json({message:"Comment added successfully" , discussions:prevcomments});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
}