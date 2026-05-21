import User from "../models/User.js";
import Job from "../models/Job.js";

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: { path: "companyId", select: "name email companyProfile" },
    });

    res.status(200).json(user.savedJobs || []);
  } catch (error) {
    res.status(400).json({ message: "Could not load saved jobs", error: error.message });
  }
};

export const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedJobs: job._id } },
      { new: true }
    ).populate({ path: "savedJobs", populate: { path: "companyId", select: "name email companyProfile" } });

    res.status(200).json({ message: "Job saved", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(400).json({ message: "Could not save job", error: error.message });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedJobs: req.params.jobId } },
      { new: true }
    ).populate({ path: "savedJobs", populate: { path: "companyId", select: "name email companyProfile" } });

    res.status(200).json({ message: "Job removed", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(400).json({ message: "Could not remove saved job", error: error.message });
  }
};
