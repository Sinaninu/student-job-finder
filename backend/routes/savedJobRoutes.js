import express from "express";
import { getSavedJobs, saveJob, removeSavedJob } from "../controllers/savedJobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("student"), getSavedJobs);
router.post("/:jobId", protect, authorizeRoles("student"), saveJob);
router.delete("/:jobId", protect, authorizeRoles("student"), removeSavedJob);

export default router;
