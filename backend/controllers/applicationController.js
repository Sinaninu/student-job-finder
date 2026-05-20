import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const createApplication = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply for jobs" });
    }

    const { jobId, message } = req.body;
    const job = await Job.findById(jobId);

    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.companyId.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot apply to your own job" });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId: job._id,
      companyId: job.companyId,
      message,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already applied for this job" });
    }
    res.status(400).json({ message: "Could not submit application", error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("jobId")
      .populate("companyId", "name email companyProfile")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: "Could not load applications", error: error.message });
  }
};

export const getCompanyApplications = async (req, res) => {
  try {
    const filter = { companyId: req.user._id };
    if (req.query.jobId) filter.jobId = req.query.jobId;

    const applications = await Application.find(filter)
      .populate("jobId")
      .populate("studentId", "name email role resume studentProfile")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: "Could not load company applications", error: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only withdraw your own application" });
    }

    application.status = "withdrawn";
    await application.save();

    res.status(200).json({ message: "Application withdrawn", application });
  } catch (error) {
    res.status(400).json({ message: "Could not withdraw application", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const allowed = ["submitted", "reviewed", "closed", "accepted", "rejected"];
    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (req.user.role !== "admin" && application.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update applications for your own jobs" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Application status updated", application });
  } catch (error) {
    res.status(400).json({ message: "Could not update application", error: error.message });
  }
};
