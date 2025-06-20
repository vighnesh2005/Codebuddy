import mongoose from "mongoose";

const discussionsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Title:{
        type:String,
        required:true  
    },
    content:{
        type:String,
        required:true
    },

},{
    timestamps:true
});

export const Discussions = mongoose.Model("Discussion",discussionsSchema);

const discussionCommentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    discussion:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Discussion",
        required:true,
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DiscussionComment",
        default:null
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const DiscussionComment = mongoose.model("DiscussionComment",discussionCommentSchema);