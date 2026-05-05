import express from "express";
const router = express.Router(); 

import {
    createJob,
    getJobs,
} from "../controllers/jobController.js";


//CRUD routes 
router.post("/", createJob);
router.get("/", getJobs);

export default router;