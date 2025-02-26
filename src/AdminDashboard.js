import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const API_BASE_URL = "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Fetch pending submissions
  const fetchSubmissions = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch submissions.");

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle submission approval or denial
  const updateSubmissionStatus = async (submission_id, newStatus) => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(`${API_BASE_URL}/update-submission-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({ submission_id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status.");

      alert(`Submission marked as ${newStatus.toLowerCase()}!`);

      // Remove from UI after updating status
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((s) => s.submission_id !== submission_id)
      );
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Failed to update submission. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      {loading && <p>Loading submissions...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && submissions.length === 0 && <p>No pending submissions.</p>}

      {!loading && submissions.length > 0 && (
        <table style={styles.table}>
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
            {submissions.map((submission) => (
              <tr key={submission.submission_id}>
                <td>{submission.product_name}</td>
                <td>{submission.brand || "N/A"}</td>
                <td>{submission.thc_percentage}%</td>
                <td>${submission.price.toFixed(2)}</td>
                <td>{submission.dispensary}</td>
                <td>{submission.submitted_by}</td>
                <td>
                  <button
                    onClick={() => updateSubmissionStatus(submission.submission_id, "APPROVED")}
                    style={styles.approveButton}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateSubmissionStatus(submission.submission_id, "DENIED")}
                    style={styles.denyButton}
                  >
                    ❌ Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "auto",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  approveButton: {
    marginRight: "8px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  denyButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
