import express from "express";
import { addContest, getContests , getContest , unregister , register } from "../controllers/contest.controller.js";

const router = express.Router();

router.post("/getContests", getContests);
router.post("/addContest", addContest);
router.post("/getContest", getContest);
router.post("/unregister", unregister);
router.post("/register", register);


export default router;