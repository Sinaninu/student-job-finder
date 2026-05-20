import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadStudentResume,
  deleteStudentResume,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/resume", protect, uploadResume.single("resume"), uploadStudentResume);
router.delete("/resume", protect, deleteStudentResume);

export default router;
