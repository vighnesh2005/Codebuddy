import { Contest, ContestSubmission } from "../models/contest.model.js";

export const getContest = async (req, res) => {
    const contests = await Contest.find();
    res.status(200).json({contests:contests});
}

export const addContest = async (req, res) => {
    const contest = await Contest.create(req.body.contest);
    res.status(200).json(contest);
}