import express from "express";
import {
  createApplication,
  getMyApplications,
  getCompanyApplications,
  withdrawApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), createApplication);
router.get("/my-applications", protect, authorizeRoles("student"), getMyApplications);
router.get("/company", protect, authorizeRoles("company", "admin"), getCompanyApplications);
router.patch("/:id/status", protect, authorizeRoles("company", "admin"), updateApplicationStatus);
router.delete("/:id", protect, authorizeRoles("student"), withdrawApplication);

export default router;