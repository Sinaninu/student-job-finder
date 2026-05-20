import Job from "../models/Job.js";
import Application from "../models/Application.js";

const buildJobPayload = (body, companyId) => ({
  title: body.title,
  description: body.description,
  companyId,
  jobType: body.jobType,
  location: body.location,
  category: body.category,
  industry: body.industry || "",
  majorTags: Array.isArray(body.majorTags)
    ? body.majorTags
    : String(body.majorTags || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
  salaryMin: body.salaryMin || undefined,
  salaryMax: body.salaryMax || undefined,
  requirements: body.requirements || "",
  isActive: body.isActive ?? true,
});

const createJob = async (req, res) => {
  try {
    const job = await Job.create(buildJobPayload(req.body, req.user._id));
    return res.status(201).json(job);
  } catch (error) {
    return res.status(400).json({
      message: "Could not create job",
      error: error.message,
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, category, industry, major } = req.query;
    const query = { isActive: true };

    if (keyword) query.$text = { $search: keyword };
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (category) query.category = { $regex: `^${category}$`, $options: "i" };
    if (industry) query.industry = { $regex: `^${industry}$`, $options: "i" };
    if (major) query.majorTags = { $regex: major, $options: "i" };

    const jobs = await Job.find(query)
      .populate("companyId", "name email role companyProfile")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      message: "Could not load jobs",
      error: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("companyId", "name email role companyProfile");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({
      message: "Could not load job",
      error: error.message,
    });
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user._id }).sort({
      createdAt: -1,
    });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantsCount = await Application.countDocuments({
          jobId: job._id,
        });

        return {
          ...job.toObject(),
          applicantsCount,
        };
      })
    );

    return res.status(200).json(jobsWithCounts);
  } catch (error) {
    return res.status(500).json({
      message: "Could not load company jobs",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "admin" &&
      job.companyId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own jobs",
      });
    }

    Object.assign(job, buildJobPayload(req.body, job.companyId));
    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    return res.status(400).json({
      message: "Could not update job",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "admin" &&
      job.companyId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own jobs",
      });
    }

    await job.deleteOne();

    return res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    return res.status(400).json({
      message: "Could not delete job",
      error: error.message,
    });
  }
};

export {
  createJob,
  getJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
};