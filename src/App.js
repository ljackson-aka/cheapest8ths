import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Amplify, Auth, Hub } from "aws-amplify";
import awsExports from "./aws-exports";
import "./App.css";
import About from "./About";

Amplify.configure(awsExports);

const API_URL = "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [strains, setStrains] = useState({
    cheapestEighth: [],
    cheapestOver25Thc: [],
    cheapestOver30Thc: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Now safe to use

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("✅ User is authenticated:", currentUser);
        setUser(currentUser);
      } catch (err) {
        console.log("❌ No user signed in");
        setUser(null);
      }
    };

    checkAuth();

    // Listen for Auth events
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log("🔥 AUTH EVENT:", payload.event);
      if (payload.event === "signIn") {
        checkAuth();
        navigate("/profile"); // Redirect to profile after login
      } else if (payload.event === "signOut") {
        setUser(null);
        navigate("/"); // Redirect to home after logout
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const username = prompt("Enter your username:");
      const password = prompt("Enter your password:");
      if (!username || !password) return;

      console.log("🔄 Attempting sign-in...");
      const signedInUser = await Auth.signIn(username, password);
      console.log("✅ Sign-in successful:", signedInUser);
      setUser(signedInUser);
      navigate("/profile");
    } catch (error) {
      console.error("❌ Sign-in error:", error);
      alert("Sign-in failed: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      console.log("✅ Signed out successfully");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("❌ Sign-out error:", error);
    }
  };

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        setStrains({
          cheapestEighth: parsedBody.cheapestEighth || [],
          cheapestOver25Thc: parsedBody.cheapestOver25Thc || [],
          cheapestOver30Thc: parsedBody.cheapestOver30Thc || []
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStrains();
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <nav className="navbar">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={handleSignIn}>Sign In</button>
        )}
        <Link to="/about">About</Link>
      </nav>

      <div className="theme-toggle">
        <label>
          Theme:
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      {error && <p className="error-message">Error: {error}</p>}

      <Routes>
        <Route path="/" element={<Home strains={strains} loading={loading} />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const Home = ({ strains, loading }) => (
  <div className="tables-wrapper">
    {[
      { key: "cheapestEighth", title: "Cheapest 8ths" },
      { key: "cheapestOver25Thc", title: "Over 25% THC" },
      { key: "cheapestOver30Thc", title: "Over 30% THC" }
    ].map(({ key, title }) => (
      <div className="table-container" key={key}>
        <div className="table-header">{title}</div>
        <div className="scrollable-content">
          {loading ? (
            <p>Loading...</p>
          ) : strains[key].length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Product</th>
                  <th>THC %</th>
                  <th>Price ($)</th>
                  <th>Dispensary</th>
                </tr>
              </thead>
              <tbody>
                {strains[key].map((strain, index) => (
                  <tr key={index}>
                    <td>{strain.brand}</td>
                    <td>{strain.product_name}</td>
                    <td>{strain.thc}%</td>
                    <td>${strain.price.toFixed(2)}</td>
                    <td>{strain.dispensary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Profile = ({ user }) => (
  <div>
    <h2>Welcome, {user?.attributes?.email}</h2>
  </div>
);

export default App;
