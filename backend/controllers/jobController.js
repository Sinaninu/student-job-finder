const Job = require("../models/Job");

const createJob = async (req,res)=> {
    try{
        const job = await Job.create(req.body);
        res.status(201).json(job)
    }
    catch(error){
        res.status(400).json({error: error.message});
    }

};

const getJobs = async (req,res) => {
    try{
        const jobs = await Job.find();
        res.status(200).json(jobs)
    }
    catch(error){
        res.status(400).json({error: error.message});
    }

}


module.exports = {
    createJob,
    getJobs,
};