import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom"; // Import React Router
import "./App.css";

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
  const [sortConfigs, setSortConfigs] = useState({
    cheapestEighth: { key: null, direction: "asc" },
    cheapestOver25Thc: { key: null, direction: "asc" },
    cheapestOver30Thc: { key: null, direction: "asc" }
  });

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("API Raw Response:", data); // Debugging API response

        const parsedBody = JSON.parse(data.body);

        console.log("Parsed Data:", parsedBody); // Debugging parsed data

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

  const sortedData = (category, data) => {
    const sortConfig = sortConfigs[category];
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  };

  const requestSort = (category, key) => {
    let direction = "asc";
    if (sortConfigs[category].key === key && sortConfigs[category].direction === "asc") {
      direction = "desc";
    }
    setSortConfigs({ ...sortConfigs, [category]: { key, direction } });
  };

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        {/* Top Navbar */}
        <nav className="navbar">
          <Link to="#" onClick={(e) => e.preventDefault()}>Sign Up</Link>
          <Link to="#" onClick={(e) => e.preventDefault()}>Profile</Link>
          <Link to="#" onClick={(e) => e.preventDefault()}>About</Link>
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

        {/* Error Handling */}
        {error && <p className="error-message">Error: {error}</p>}

        {/* Table Sections */}
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
                        <th onClick={() => requestSort(key, "brand")}>Brand ⬍</th>
                        <th onClick={() => requestSort(key, "product_name")}>Product ⬍</th>
                        <th onClick={() => requestSort(key, "thc")}>THC % ⬍</th>
                        <th onClick={() => requestSort(key, "price")}>Price ($) ⬍</th>
                        <th onClick={() => requestSort(key, "dispensary")}>Dispensary ⬍</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData(key, strains[key]).map((strain, index) => (
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
      </div>
    </Router>
  );
};

export default App;
