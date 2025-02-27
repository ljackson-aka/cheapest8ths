import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const API_BASE_URL = "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod";

const AdminDashboard = () => {
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovedSubmissions();
    fetchPendingSubmissions();
  }, []);

  const fetchApprovedSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(`${API_BASE_URL}/approved-submissions`, {
        method: "GET",
        headers: {
          Authorization: idToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch approved submissions.");
      const data = await response.json();
      setApprovedSubmissions(data.submissions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(`${API_BASE_URL}/pending-submissions`, {
        method: "GET",
        headers: {
          Authorization: idToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch pending submissions.");
      const data = await response.json();
      setPendingSubmissions(data.submissions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (submission_id, newStatus) => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(`${API_BASE_URL}/update-submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({ submission_id, status: newStatus }),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Failed to update status.");

      alert(responseData.message || `Submission marked as ${newStatus.toLowerCase()}!`);

      setPendingSubmissions((prev) => prev.filter((item) => item.submission_id !== submission_id));
      if (newStatus === "APPROVED") {
        setApprovedSubmissions((prev) => [
          ...prev,
          { ...pendingSubmissions.find((item) => item.submission_id === submission_id), status: "APPROVED" },
        ]);
      }
    } catch (error) {
      alert(`Error: ${error.message || "Failed to update submission."}`);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading submissions...</p>}
      {error && <p className="error-message">{error}</p>}

      <h3>Pending Submissions</h3>
      {pendingSubmissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>THC %</th>
                <th>Price</th>
                <th>Dispensary</th>
                <th>Submitted By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSubmissions.map((submission) => (
                <tr key={submission.submission_id}>
                  <td>{submission.product_name}</td>
                  <td>{submission.brand || "N/A"}</td>
                  <td>{submission.thc_percentage ? `${submission.thc_percentage}%` : "N/A"}</td>
                  <td>{submission.price ? `$${parseFloat(submission.price).toFixed(2)}` : "N/A"}</td>
                  <td>{submission.dispensary}</td>
                  <td>{submission.submitted_by}</td>
                  <td>
                    <button onClick={() => updateSubmissionStatus(submission.submission_id, "APPROVED")} className="approve-button">
                      ✅ Approve
                    </button>
                    <button onClick={() => updateSubmissionStatus(submission.submission_id, "DENIED")} className="deny-button">
                      ❌ Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Approved Submissions</h3>
      {approvedSubmissions.length === 0 ? (
        <p>No approved submissions.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>THC %</th>
                <th>Price</th>
                <th>Dispensary</th>
                <th>Submitted By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubmissions.map((submission) => (
                <tr key={submission.submission_id}>
                  <td>{submission.product_name}</td>
                  <td>{submission.brand || "N/A"}</td>
                  <td>{submission.thc_percentage ? `${submission.thc_percentage}%` : "N/A"}</td>
                  <td>{submission.price ? `$${parseFloat(submission.price).toFixed(2)}` : "N/A"}</td>
                  <td>{submission.dispensary}</td>
                  <td>{submission.submitted_by}</td>
                  <td>{submission.timestamp ? new Date(submission.timestamp).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
