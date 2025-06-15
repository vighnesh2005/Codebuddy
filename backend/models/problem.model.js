import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    id:{
        type:Number,
        required: true,
        unique: true    
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    tests:[{
        input: { type: String, required: true },
        output: { type: String, required: true }
    }],
    tags:[{
        type:String,
        required:true
    }],
    constraints:[{
        type:String,
        required:true
    }],
    languages:[{
        type:String,
        required:true
    }],
    difficulty:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Problem = mongoose.model("Problem",problemSchema);

const tagschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        trim: true
    },
    total:{
        type:Number, 
        required:true
    }
})

export const Tag = new mongoose.model("Tag",tagschema);

