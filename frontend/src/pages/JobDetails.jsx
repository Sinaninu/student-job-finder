import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>

      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job type:</strong> {job.jobType}</p>
      <p><strong>Category:</strong> {job.category}</p>
      <p><strong>Company:</strong> {job.companyId?.name || "Unknown company"}</p>
    </div>
  );
}