import express from "express";
const router = express.Router(); 

import {
    createApplication,
    getMyApplications,
    getCompanyApplications,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";


//CRUD routes 
router.post("/", protect, createApplication);
router.get("/my-applications", protect, getMyApplications);
router.get("/company", protect,  getCompanyApplications);


export default router;