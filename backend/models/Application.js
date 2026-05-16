import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
{
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true

    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 

    },

    status : {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"


    },

    message:{
        type: String


    },

},

{
timestamps: true
}


);
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);