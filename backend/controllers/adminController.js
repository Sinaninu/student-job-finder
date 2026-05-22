import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const adminUserFields = "name email role createdAt companyProfile studentProfile resume";

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "company" }),
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: "submitted" }),
    ]);

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalCompanies,
      totalJobs,
      activeJobs,
      inactiveJobs: totalJobs - activeJobs,
      totalApplications,
      pendingApplications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load admin stats",
      error: error.message,
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter)
      .select(adminUserFields)
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Could not load users",
      error: error.message,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("companyId", "name email role companyProfile")
      .sort({ createdAt: -1 });

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

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: "Could not load admin jobs",
      error: error.message,
    });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title location jobType isActive")
      .populate("studentId", "name email role resume studentProfile")
      .populate("companyId", "name email companyProfile")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Could not load admin applications",
      error: error.message,
    });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Safety: do not allow deleting admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin users cannot be deleted",
      });
    }

    // If deleted user is a student, delete their applications
    if (user.role === "student") {
      await Application.deleteMany({ studentId: userId });
    }

    // If deleted user is a company, delete its jobs and related applications
    if (user.role === "company") {
      const companyJobs = await Job.find({ companyId: userId }).select("_id");
      const jobIds = companyJobs.map((job) => job._id);

      await Application.deleteMany({
        $or: [{ companyId: userId }, { jobId: { $in: jobIds } }],
      });

      await Job.deleteMany({ companyId: userId });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const deleteAdminApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete application",
      error: error.message,
    });
  }
};