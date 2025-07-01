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

export const getContestRanking = async (req,res) => {
    try {
        const { id } = req.body;
        let ranking = await redis.get(`rankings-${id}`);
        if(!ranking){
            ranking = await ContestRanking.find({contest:id}).populate("user","username profile _id").lean();
            await redis.set(`ranking-${id}`,JSON.stringify(ranking),{EX:3600});
        }
        let contest = await redis.get(`contest-${id}`);
        if(!contest){
            contest = await Contest.findById(id).populate({
                path: "problems.problem",
                select: "id name difficulty"
            })
            .lean(); 
            await redis.set(`contest-${id}`,JSON.stringify(contest),{EX:3600});
        }
        res.status(200).json({ranking:ranking,contest:contest});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const updateRank = async (req,res) => {
    try {
        const { contest,user,problem,date,status,score } = req.body;
        let ranks = await redis.get(`rankings-${contest}`);

        let ContestID = await Contest.findById(contest);

        if(new Date(ContestID.end_time) < new Date())
            return res.status(500).json({ message: "Contest has ended" });
        if(!ranks)
            return res.status(500).json({ message: "Internal Server error" });

        let updated = false;

        for(let i = 0; i < ranks.length; i++){
            ranks[i].score = Number(ranks[i].score);
            ranks[i].penalty = Number(ranks[i].penalty);
            if(ranks[i].user == user ){
                ranks[i].lastScoreUpdate = date;
                if(status === "Accepted")
                    ranks[i].score = Number(ranks[i].score) + Number(score);
                else
                    ranks[i].penalty = Number(ranks[i].penalty) + 1;
                updated = true;
                break;
            }
        }

        if(!updated )
            return res.status(500).json({ message: "Internal Server error" });

        ranks.sort((a,b)=>{
            if(a.score !== b.score)
                return b.score - a.score;
            if(a.penalty !== b.penalty)
                return a.penalty - b.penalty;
            return b.lastScoreUpdate - a.lastScoreUpdate;
        });

        for(let i = 0; i < ranks.length; i++){
            ranks[i].rank = i + 1;
        }

        await redis.set(`rankings-${contest}`,JSON.stringify(ranks));

        return res.status(200).json({ message: "Ranking updated", ranks });

    } catch (error) {
        console.error(error);
    }
}