import express from "express";
const router = express.Router();

import {
    createJob,
    getJobs,
    getJobById,
} from "../controllers/jobController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// CRUD routes
router.get("/", getJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  authorizeRoles("company", "admin"),
  createJob
);

export default router;