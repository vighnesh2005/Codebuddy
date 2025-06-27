import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    start_time:{
        type:Date,
        required:true
    },
    end_time:{
        type:Date,
        required:true
    },
    problems:[{
        problem:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },
        index:{
            type:String,
            required:true
        },
        score:{
            type:Number,
            required:true,
            default:100
        }
    }],
    status:{
        type:String,
        enum: ["Upcoming", "Running", "Ended"],
        required:true
    }
})

const contestSubmissionSchema = mongoose.Schema({
    contest:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problem:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    result:{
        type:String,
        enum: ["TLE", "Accepted", "Rejected","MLE","RTE","CE"],
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    noofpassed:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    }
})

const contestRankingSchema = mongoose.Schema({
    contest:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    score:{
        type:Number,
        default:0
    },
    penalty:{
        type:Number,
        default:0
    },
    rank:{
        type:Number,
    }
})


export const Contest = mongoose.model("Contest",contestSchema);
export const ContestSubmission = mongoose.model("ContestSubmission",contestSubmissionSchema);
