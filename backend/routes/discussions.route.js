import express from "express";
import { Discussions, getComments, addDiscussion , addcomment } from "../controllers/discussion.controller.js";

const router = express.Router();

router.post("/discussions",Discussions);
router.post("/getcomments",getComments);
router.post("/adddiscussion",addDiscussion);
router.post("/addcomment",addcomment);

export default router; 