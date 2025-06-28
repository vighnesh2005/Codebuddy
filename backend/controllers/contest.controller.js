import { Contest, ContestRanking } from "../models/contest.model.js";
import { redis } from "../utils/redis.js";

export const getContests = async (req, res) => {
    try {
        let contests = await redis.get("contests");
        if(!contests){
            contests = await Contest.find({}).select("_id name start_time end_time").lean();
            await redis.set("contests",JSON.stringify(contests),{EX:3600});
        }
        res.status(200).json({contests:contests});        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}
 
export const addContest = async (req, res) => {
    try {
        let contests = await redis.get("contests");
        if(!contests){
            contests = [];
        }
        const contest = await Contest.create(req.body.contest);
        res.status(200).json(contest);
        contests.push(contest);
        await redis.set("contests",JSON.stringify(contests),{EX:3600});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const getContest = async (req, res) => {
    try {
        const id = req.body.id;
        let contest = await redis.get(`contest-${id}`);
        if(!contest){
            contest = await Contest.findById(id).populate({
                path: "problems.problem",
                select: "id name difficulty"
            })
            .lean(); 
            await redis.set(`contest-${id}`,JSON.stringify(contest),{EX:3600});
        }
        let registered = false;
        if(req.body.isLoggedIn && req.body.user){
            const result = await ContestRanking.findOne({contest:id,user:req.body.user});
            if(result){
                registered = true;
            }
        }
        res.status(200).json({contest:contest,registered:registered});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });    
    }
}

export const register = async (req,res) =>{
    try {
        const {user,contest} = req.body;
        await ContestRanking.create({user,contest});
        res.status(200).json({message:"Registered successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const unregister = async (req,res) =>{
    try {
        const {user,contest} = req.body;
        await ContestRanking.deleteOne({user,contest});
        res.status(200).json({message:"Unregistered successfully"});
    } catch (error) { 
        console.error(error);
        await res.status(500).json({ message: "Internal Server error" });
    }
}