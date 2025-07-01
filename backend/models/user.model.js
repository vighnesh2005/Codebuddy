import mongoose from "mongoose";

// Counter Schema for auto-incrementing rank
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email:{ 
    type:String,
    required: true,
    unique: true,
    trim: true
  },
  profile: {
    type: String,
    default: ""
  },
  problemssolved: {
    type: Number,
    default: 0
  },
  easy: {
    type: Number,
    default: 0
  },
  medium: {
    type: Number, 
    default: 0
  },
  hard: {
    type: Number, 
    default: 0
  },
  description: {
    type: String,
    default: "No Description"
  },
  rating: {
    type: Number,
    default: 1000
  },
  contestsParticipated: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
  },
  ratingHistory:[
    { 
      type: Number,
    }
  ]
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "user_rank" }, 
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.rank = counter.seq;
  }
  next();
});

export default mongoose.model("User", userSchema);
