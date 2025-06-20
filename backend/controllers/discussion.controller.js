import { DiscussionComment, Discussion } from "../models/discussions.model";
import { redis } from "../utils/redis.js";

export const Discussions = async (req,res) =>{
    try {
        let discussions = await redis.get("discussions");
        if(!discussions){
            discussions = await Discussion.find({}).lean();
            await redis.set("discussions",discussions);
        }
        return res.status(200).json({discussions});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}

export const getComments = async (req,res)=>{
    try {
        const { id } = req.body;
        let comments = await redis.get(`comments-${id}`);
        if(!comments){
            comments = DiscussionComment.find({ discussion : id }).lean();
            await redis.set(`comments-${id}`,comments);
        }
        return res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}

 export const addDiscussion = async (req,res)=>{
    try {
        const {user , title, content} = req.body;
        const newDisscussion = await Discussion.create({user,title,content});
        let prevdiscussions = await redis.get("discussions");
        prevdiscussions = prevdiscussions ? prevdiscussions : [];
        prevdiscussions.push(newDisscussion);
        await redis.set("discussions",prevdiscussions);
        return res.status(201).json(newDisscussion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}

export const addcomment = async (req,res)=>{
    try {
        const { id,user,parent,comment } = req.body;
        const newComment = await DiscussionComment.create({ discussion:id, user:user, parent, comment });
        res.status(201).json(newComment);
        let prevcomments = await  redis.get(`comments-${id}`);
        prevcomments = prevcomments ? prevcomments : [];
        prevcomments.push(newComment);
        await redis.set(`comments-${id}`,prevcomments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}