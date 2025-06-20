import express from "express";
import { addComment,getProblem, getProblems, discussions } from "../controllers/problems.controller.js";

const router = express.Router();

router.post("/problems",getProblems);

router.post("/getproblem",getProblem);

router.post("/discussions",discussions);

router.post("/addcomment",addComment);

export default router;
