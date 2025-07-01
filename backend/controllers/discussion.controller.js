import { DiscussionComment, Discussion } from "../models/discussions.model.js";
import { redis } from "../utils/redis.js";

export const Discussions = async (req,res) =>{
    try {
        let discussions = await redis.get("discussions");
        if(!discussions){
            discussions = await Discussion.find({}).populate("user","username profile _id").sort({createdAt:-1}).lean();
            await redis.set("discussions",JSON.stringify(discussions),{EX:3600});
        }
        return res.status(200).json({discussions:discussions});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}
 
export const getComments = async (req,res)=>{
    try {
        const { id } = req.body;
        await redis.del(`comments-${id}`);
        let comments = await redis.get(`comments-${id}`);
        if(!comments){
            comments = await DiscussionComment.find({ discussion : id }).populate("user","username profile _id").lean();

            await redis.set(`comments-${id}`,comments);
        }
        let discussion = await redis.get(`discussion-${id}`);
        if(!discussion){
            discussion = await Discussion.findById(id).lean();
            await redis.set(`discussion-${id}`,JSON.stringify(discussion),{EX:3600});
        }

        return res.status(200).json({comments:comments,discussion:discussion}); 

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}

 export const addDiscussion = async (req,res)=>{
    try {
        const {user , title, content} = req.body;
        const created = await Discussion.create({ user, Title: title, content });

        const newDiscussion = await Discussion.findById(created._id)
        .populate("user", "username profile _id")
        .lean(); 

        res.status(201).json({newDisscussion:newDiscussion});
        let prevdiscussions = await redis.get("discussions");
        prevdiscussions = prevdiscussions ? prevdiscussions : [];
        prevdiscussions.push(newDiscussion);
        await redis.set("discussions",prevdiscussions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
} 

export const addcomment = async (req,res)=>{
    try {
        const { id,user,parent,comment } = req.body;
        const newComment = await DiscussionComment.create({ discussion:id, user:user, parent, comment });
        res.status(201).json({message:"Comment added successfully"});
        let prevcomments = await  redis.get(`comments-${id}`);
        prevcomments = prevcomments ? prevcomments : [];
        prevcomments.push(newComment);
        await redis.set(`comments-${id}`,prevcomments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server error"});
    }
}