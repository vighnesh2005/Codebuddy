import express from "express";
import { addContest, getContest } from "../controllers/contest.controller.js";

const router = express.Router();

router.post("/getContest", getContest);
router.post("/addContest", addContest);

export default router;