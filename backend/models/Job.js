import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true

    },

    companyId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true


    },

    jobType:{
        type: String,
        required: true

    },

    location:{
        type: String,
        required: true 

    }, 

    category:{
     type: String,
     required: true
    },
    //Some extra 
    ///salary:{
    //
    //},

    //requirements:{
    //},

    






},
 
{
timestamps: true
}





);
export default mongoose.model("Job", jobSchema);
