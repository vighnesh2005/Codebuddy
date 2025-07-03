import express from "express";
import { Discussions, getComments, addDiscussion , addcomment } from "../controllers/discussion.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/discussions",Discussions);
router.post("/getcomments",getComments);
router.post("/adddiscussion",checkToken,addDiscussion);
router.post("/addcomment",checkToken,addcomment);

export default router; 