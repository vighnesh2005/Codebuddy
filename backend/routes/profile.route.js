import express from "express"
import { getProfile, updateProfile } from "../controllers/profile.controller.js"
import { checkToken } from "../middleware/checkToken.js"

const router = express.Router();

router.post("/getprofile",getProfile);
router.post("/updateprofile",checkToken,updateProfile);

export default router;
