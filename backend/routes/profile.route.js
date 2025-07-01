import express from "express"
import { getProfile, updateProfile } from "../controllers/profile.controller.js"

const router = express.Router();

router.post("/getprofile",getProfile);
router.post("/updateprofile",updateProfile);

export default router;
