import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [submissionStats, setSubmissionStats] = useState({
    total: 0,
    approved: 0,
    denied: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("✅ Full Cognito User Object:", currentUser); // Debug full object

        const username = currentUser.username || "Unknown User";
        setUser({ username, email: currentUser.attributes?.email || "N/A" });

        // Once we have the username, fetch their submission stats
        fetchSubmissionStats(username);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser(null);
      }
    };

    const fetchSubmissionStats = async (username) => {
      try {
        const response = await fetch(
          `https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/user-submissions?user_id=${username}`
        );

        if (!response.ok) throw new Error("Failed to fetch submission stats");

        const data = await response.json();
        console.log("📊 Submission Stats:", data); // Debug response

        setSubmissionStats({
          total: data.total_submissions || 0,
          approved: data.approved_submissions || 0,
          denied: data.denied_submissions || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching submission stats:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      window.location.href = "/"; // Redirect to home page
    } catch (err) {
      console.error("❌ Error signing out:", err);
    }
  };

  return user ? (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Display Submission Stats */}
      <h3>📊 Submission Stats:</h3>
      <p><strong>Total Submissions:</strong> {submissionStats.total}</p>
      <p><strong>Approved:</strong> ✅ {submissionStats.approved}</p>
      <p><strong>Denied:</strong> ❌ {submissionStats.denied}</p>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ) : (
    <p>Please sign in.</p>
  );
};

export default Profile;
