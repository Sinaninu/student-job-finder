import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAdminApplications,
  getAdminJobs,
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  deleteAdminApplication,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Admin routes are working" });
});

router.use(protect, authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/jobs", getAdminJobs);
router.get("/applications", getAdminApplications);

router.delete("/users/:id", deleteAdminUser);
router.delete("/applications/:id", deleteAdminApplication);

export default router;