import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        setError("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplyMessage("");

      await API.post("/applications", {
        jobId: id,
        message: "I am interested in this position.",
      });

      setApplyMessage("Application submitted successfully.");
    } catch (error) {
      setApplyMessage(
        error.response?.data?.message || "Could not submit application."
      );
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="job-details-page">
      <div className="job-details-card">
        <button className="btn-outline" onClick={() => navigate("/jobs")}>
          Back to Jobs
        </button>

        <h1>{job.title}</h1>
        <p className="job-description">{job.description}</p>

        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Job type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Category:</strong> {job.category}
        </p>
        <p>
          <strong>Company:</strong> {job.companyId?.name || "Unknown company"}
        </p>

        <div className="job-details-actions">
          <button className="btn-primary" onClick={handleApply}>
            Apply Now
          </button>
        </div>

        {applyMessage && <p className="apply-message">{applyMessage}</p>}
      </div>
    </div>
  );
}