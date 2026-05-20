import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,

    },

    companyId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true


    },

    jobType:{
        type: String,
        required: true,
        enum: ["Internship", "Full-time", "Part-time", "Contract", "Temporary"],

    },

    location:{
        type: String,
        required: true,
        trim: true, 

    }, 

    category:{
     type: String,
     required: true,
     trim: true,
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

     majorTags: [{ type: String, trim: true }],
   
    salaryMin: {
        type: Number,
        default: 0,
    },

    salaryMax: {
        type: Number,
        default: 0,
    },
    
    requirements: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },


},
 
{
timestamps: true
}
);
jobSchema.index({ title: "text", description: "text", category: "text", industry: "text", majorTags: "text" });
export default mongoose.model("Job", jobSchema);
