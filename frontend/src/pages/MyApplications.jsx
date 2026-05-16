import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get("/applications/my-applications");
        setApplications(response.data);
      } catch (error) {
        setError("Could not load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="applications-page">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div className="application-card" key={application._id}>
              <h3>{application.jobId?.title}</h3>

              <p>
                <strong>Location:</strong>{" "}
                {application.jobId?.location}
              </p>

              <p>
                <strong>Job Type:</strong>{" "}
                {application.jobId?.jobType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>

              <p>
                <strong>Message:</strong>{" "}
                {application.message}
              </p>

              <p>
                <strong>Applied:</strong>{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}