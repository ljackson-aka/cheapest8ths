import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [submissionStats, setSubmissionStats] = useState({
    total: 0,
    approved: 0,
    denied: 0,
  });
  const [rank, setRank] = useState("Unranked");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("✅ Full Cognito User Object:", currentUser);

        const username = currentUser.username || "Unknown User";
        setUser({ username, email: currentUser.attributes?.email || "N/A" });

        // Fetch submission stats and leaderboard rank
        fetchSubmissionStats(username);
        fetchLeaderboardRank(username);
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
        console.log("📊 Submission Stats:", data);

        setSubmissionStats({
          total: data.total_submissions || 0,
          approved: data.approved_submissions || 0,
          denied: data.denied_submissions || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching submission stats:", err);
      }
    };

    const fetchLeaderboardRank = async (username) => {
      try {
        const response = await fetch(
          "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/leaderboard"
        );

        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const data = await response.json();
        console.log("🏆 Raw API Response:", JSON.stringify(data, null, 2));

        let leaderboardData;
        if (typeof data.body === "string") {
          leaderboardData = JSON.parse(data.body).leaderboard;
        } else if (data.leaderboard) {
          leaderboardData = data.leaderboard;
        } else {
          console.error("❌ Unexpected leaderboard format:", data);
          setRank("Unranked");
          return;
        }

        console.log("🏆 Parsed Leaderboard Data:", leaderboardData);

        const userEntry = leaderboardData.find(
          (entry) => entry.username.toLowerCase() === username.toLowerCase()
        );

        if (userEntry) {
          setRank(userEntry.rank);
        } else {
          console.warn("⚠️ User not found in leaderboard:", username);
          setRank("Unranked");
        }
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setRank("Unranked");
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

      {/* Display Rank */}
      <h3>🏆 Leaderboard Rank:</h3>
      <p><strong>Rank:</strong> {rank}</p>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ) : (
    <p>Please sign in.</p>
  );
};

export default Profile;
