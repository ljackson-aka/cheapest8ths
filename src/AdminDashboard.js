import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(
        "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/admin", // New API Endpoint
        {
          method: "GET",
          headers: {
            Authorization: idToken, // Attach Cognito token
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      } else {
        console.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (submission_id, newStatus) => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(
        "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/admin/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
          },
          body: JSON.stringify({ submission_id, status: newStatus }),
        }
      );

      if (response.ok) {
        alert(`Submission ${newStatus.toLowerCase()}!`);
        setSubmissions(submissions.filter((s) => s.submission_id !== submission_id)); // Remove from UI
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : null}

      {submissions.length === 0 ? (
        <p>No pending submissions</p>
      ) : (
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
            {submissions.map((submission) => (
              <tr key={submission.submission_id}>
                <td>{submission.product_name}</td>
                <td>{submission.brand}</td>
                <td>{submission.thc_percentage}</td>
                <td>${submission.price}</td>
                <td>{submission.dispensary}</td>
                <td>{submission.submitted_by}</td>
                <td>
                  <button onClick={() => updateSubmissionStatus(submission.submission_id, "APPROVED")}>
                    ✅ Approve
                  </button>
                  <button onClick={() => updateSubmissionStatus(submission.submission_id, "DENIED")}>
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

export default AdminDashboard;
