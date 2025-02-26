import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Amplify, Auth, Hub } from "aws-amplify";
import awsExports from "./aws-exports";
import "./App.css";
import About from "./About";
import Profile from "./Profile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SubmitForm from "./components/SubmitForm"; // Submit Form Page
import AdminDashboard from "./AdminDashboard"; // Import Admin Dashboard

Amplify.configure(awsExports);

const API_URL = "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [strains, setStrains] = useState({
    cheapestEighth: [],
    cheapestOver25Thc: [],
    cheapestOver30Thc: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const userGroups =
          currentUser.signInUserSession.accessToken.payload["cognito:groups"] ||
          [];
        const isAdmin = userGroups.includes("admin");

        setUser({ ...currentUser, isAdmin });
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signIn") {
        checkAuth();
        navigate("/profile");
      } else if (payload.event === "signOut") {
        setUser(null);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        setStrains({
          cheapestEighth: parsedBody.cheapestEighth || [],
          cheapestOver25Thc: parsedBody.cheapestOver25Thc || [],
          cheapestOver30Thc: parsedBody.cheapestOver30Thc || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStrains();
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/submit">Submit a Strain</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            {user.isAdmin && <Link to="/admin">Admin Dashboard</Link>} {/* Admin Link */}
            <button className="nav-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button className="nav-button">Sign In</button>
            </Link>
            <Link to="/signup">
              <button className="nav-button">Sign Up</button>
            </Link>
          </>
        )}
      </nav>

      {/* Theme Toggle */}
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

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home strains={strains} loading={loading} />} />
        <Route path="/about" element={<About />} />
        <Route path="/submit" element={<SubmitForm />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

// Home Component
const Home = ({ strains, loading }) => {
  return (
    <div className="tables-wrapper">
      {[{ key: "cheapestEighth", title: "Cheapest 8ths" },
        { key: "cheapestOver25Thc", title: "Over 25% THC" },
        { key: "cheapestOver30Thc", title: "Over 30% THC" }
      ].map(({ key, title }) => (
        <SortableTable key={key} title={title} data={strains[key]} loading={loading} />
      ))}
    </div>
  );
};

// Sortable Table Component
const SortableTable = ({ title, data, loading }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "price", direction: "asc" });

  useEffect(() => {
    setSortedData([...data]);
  }, [data]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <div className="table-header">{title}</div>
      <div className="scrollable-content">
        {loading ? (
          <p>Loading...</p>
        ) : sortedData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("brand")}>Brand</th>
                <th onClick={() => handleSort("product_name")}>Product</th>
                <th onClick={() => handleSort("thc")}>THC %</th>
                <th onClick={() => handleSort("price")}>Price ($)</th>
                <th onClick={() => handleSort("dispensary")}>Dispensary</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((strain, index) => (
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
  );
};

export default App;
