import express from "express";
import { Discussions, getComments, addDiscussion , addcomment } from "../controllers/discussion.controller.js";
import cors from "cors";
app.use("/api/discussions", cors({
  origin: "http://localhost:3000",
  credentials: true
}));


const router = express.Router();

router.post("/discussions",Discussions);
router.post("/getcomments",getComments);
router.post("/adddiscussion",addDiscussion);
router.post("/addcomment",addcomment);

export default router; 