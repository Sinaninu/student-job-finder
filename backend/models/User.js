import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    url: String,
    mimetype: String,
    size: Number,
    uploadedAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student",
      required: true,
    },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    resume: resumeSchema,

    studentProfile: {
      major: { type: String, trim: true },
      skills: [{ type: String, trim: true }],
      preferredJobTypes: [{ type: String, trim: true }],
      preferredIndustries: [{ type: String, trim: true }],
    },

    companyProfile: {
      companyName: { type: String, trim: true },
      website: { type: String, trim: true },
      industry: { type: String, trim: true },
      logoUrl: { type: String, trim: true },
      description: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
