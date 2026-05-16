 import Application from "../models/Application.js";
 import Job from "../models/Job.js";


 const createApplication = async (req,res) => {
    try{
        const { jobId, message } = req.body;
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job Not Found"});
        }

        const application = await Application.create({
            studentId: req.user._id,
            jobId: job._id,
            companyId: job.companyId,
            message,
        });
        res.status(201).json(application);
    }catch(error){
        res.status(400).json({ error: error.message });
    };
 


};


const getMyApplications = async (req,res) => {
    try{
        const applications = await Application.find({ studentId: req.user._id })
        .populate("jobId");
        return res.status(200).json(applications);

    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const getCompanyApplications = async (req,res) => {
    try{
        const applications = await Application.find({ companyId: req.user._id })
        .populate("jobId")
        .populate("studentId", "name email role");
        return res.status(200).json(applications)

    }catch(error){
        res.status(400).json({ error: error.message })
    }
}



export {
    createApplication,
    getMyApplications,
    getCompanyApplications
};










