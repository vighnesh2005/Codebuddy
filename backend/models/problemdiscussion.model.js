import mongoose from "mongoose";

const problemDiscussionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

export const ProblemDiscussion = mongoose.model("ProblemDiscussion", problemDiscussionSchema);