 import Job from "../models/Job.js";

const createJob = async (req,res)=> {
    try{
        const job = await Job.create(req.body);
        res.status(201).json(job)
    }
    catch(error){
        res.status(400).json({error: error.message});
    }

};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId", "name email role");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
    createJob,
    getJobs,
};