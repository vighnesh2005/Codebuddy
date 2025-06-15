import express from "express";
import { addProblem } from "../controllers/addproblem.controller.js";

const router = express.Router();

router.post("/addproblem",addProblem);

export default router;