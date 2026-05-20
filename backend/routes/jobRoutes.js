import express from "express";
const router = express.Router();

import {
  createJob,
  getJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// Public route
router.get("/", getJobs);

// Company/Admin routes
router.get(
  "/company/my-jobs",
  protect,
  authorizeRoles("company", "admin"),
  getCompanyJobs
);

router.post(
  "/",
  protect,
  authorizeRoles("company", "admin"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("company", "admin"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("company", "admin"),
  deleteJob
);

router.get("/:id", getJobById);

export default router;