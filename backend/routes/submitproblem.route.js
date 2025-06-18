import express from "express";
import { submitProblem, addSubmission } from "../controllers/submitproblem.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/submitproblem",checkToken,submitProblem);
router.post("/addsubmission",checkToken,addSubmission);

export default router;