import express from "express";
const router = express.Router(); 

import {
    createJob,
    getJobs,
    getJobById,
} from "../controllers/jobController.js";


//CRUD routes 
router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;