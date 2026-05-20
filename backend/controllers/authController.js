import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const allowedRoles = ["student", "company"];

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  resume: user.resume,
  studentProfile: user.studentProfile,
  companyProfile: user.companyProfile,
  savedJobs: user.savedJobs,
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = allowedRoles.includes(req.body.role) ? req.body.role : "student";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyProfile: role === "company" ? { companyName: name } : undefined,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, portalRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (portalRole && portalRole !== user.role && user.role !== "admin") {
      return res.status(403).json({ message: "Invalid portal for your account type." });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  res.status(200).json({ user: req.user });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;

    if (req.user.role === "student") {
      updates.studentProfile = {
        ...req.user.studentProfile?.toObject?.(),
        major: req.body.major ?? req.user.studentProfile?.major,
        skills: Array.isArray(req.body.skills) ? req.body.skills : req.user.studentProfile?.skills,
        preferredJobTypes: Array.isArray(req.body.preferredJobTypes)
          ? req.body.preferredJobTypes
          : req.user.studentProfile?.preferredJobTypes,
        preferredIndustries: Array.isArray(req.body.preferredIndustries)
          ? req.body.preferredIndustries
          : req.user.studentProfile?.preferredIndustries,
      };
    }

    if (req.user.role === "company") {
      updates.companyProfile = {
        ...req.user.companyProfile?.toObject?.(),
        companyName: req.body.companyName ?? req.user.companyProfile?.companyName,
        website: req.body.website ?? req.user.companyProfile?.website,
        industry: req.body.industry ?? req.user.companyProfile?.industry,
        logoUrl: req.body.logoUrl ?? req.user.companyProfile?.logoUrl,
        description: req.body.description ?? req.user.companyProfile?.description,
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(400).json({ message: "Could not update profile", error: error.message });
  }
};

// POST /api/auth/resume
export const uploadStudentResume = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can upload a CV/resume" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF, DOC, or DOCX file" });
    }

    if (req.user.resume?.filename) {
      await fs.unlink(path.join(process.cwd(), "uploads", "resumes", req.user.resume.filename)).catch(() => {});
    }

    const resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/resumes/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Resume uploaded", resume: user.resume, user });
  } catch (error) {
    res.status(400).json({ message: "Resume upload failed", error: error.message });
  }
};

// DELETE /api/auth/resume
export const deleteStudentResume = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can delete a CV/resume" });
    }

    if (req.user.resume?.filename) {
      await fs.unlink(path.join(process.cwd(), "uploads", "resumes", req.user.resume.filename)).catch(() => {});
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { resume: "" } },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Resume deleted", user });
  } catch (error) {
    res.status(400).json({ message: "Could not delete resume", error: error.message });
  }
};
