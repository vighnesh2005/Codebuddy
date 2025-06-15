import express from "express";
import { getProblem, getProblems, discussions } from "../controllers/problems.controller.js";

const router = express.Router();

router.post("/problems",getProblems);

router.post("/getproblem",getProblem);

router.post("/discussions",discussions);

export default router;
