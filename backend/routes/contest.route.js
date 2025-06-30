import express from "express";
import { addContest, getContests , getContest , unregister , register, getContestRanking, updateRank } from "../controllers/contest.controller.js";

const router = express.Router();

router.post("/getContests", getContests);
router.post("/addContest", addContest);
router.post("/getContest", getContest);
router.post("/unregister", unregister);
router.post("/register", register);
router.post("/getContestRanking", getContestRanking);
router.post("/updateRank", updateRank);

export default router;