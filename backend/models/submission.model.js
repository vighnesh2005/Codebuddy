import mongoose from "mongoose";

const submitSchema = new mongoose.Schema({
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
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    result: {
        type: String,
        enum: ["Accepted", "Wrong Answer", "TLE", "Runtime Error", "Compilation Error"],
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    noofpassed: {
        type: Number,
        required: true
    },
    total: {
        type:Number,
        required: true
    }
});

export const Submission = mongoose.model("Submission", submitSchema);   
