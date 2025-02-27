import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = ({ theme }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/leaderboard"
        );

        console.log("API Response:", response.data); // Debugging

        // ✅ Parse the JSON string inside `body`
        const data = JSON.parse(response.data.body);

        if (data && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        } else {
          setError("Invalid leaderboard data format.");
        }
      } catch (err) {
        setError("Failed to load leaderboard. Please try again.");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={`leaderboard-container ${theme}`}>
      <h2>🏆 Leaderboard 🏆</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Submissions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <tr key={user.username}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.submissions}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No leaderboard data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
