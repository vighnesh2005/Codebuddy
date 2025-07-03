import express from "express";
import { addComment,getProblem, getProblems, discussions, topic } from "../controllers/problems.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/problems",getProblems);

router.post("/getproblem",getProblem);

router.post("/discussions",discussions);

router.post("/addcomment",checkToken,addComment);

router.post("/topic",topic);

export default router;
