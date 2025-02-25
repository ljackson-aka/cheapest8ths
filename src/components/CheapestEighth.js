import React, { useEffect, useState } from "react";
import { fetchCheapest8ths } from "../api/apiService";
import Wrapper from "./Wrapper"; // Wrapper component for styling and layout consistency
import styles from "../styles/CheapestEighth.module.css";

const CheapestEighth = () => {
  const [cheapestEighths, setCheapestEighths] = useState([]);
  const [cheapestOver25Thc, setCheapestOver25Thc] = useState([]);
  const [cheapestOver30Thc, setCheapestOver30Thc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfigs, setSortConfigs] = useState({
    cheapestEighth: { key: null, direction: "asc" },
    cheapestOver25Thc: { key: null, direction: "asc" },
    cheapestOver30Thc: { key: null, direction: "asc" },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchCheapest8ths();
        if (result) {
          console.log("API Response:", result);
          setCheapestEighths(result.cheapestEighth || []);
          setCheapestOver25Thc(result.cheapestOver25Thc || []);
          setCheapestOver30Thc(result.cheapestOver30Thc || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
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
    <Wrapper>
      <h1 className={styles.header}>Find CHEAP8THS Near You</h1>

      {error && <p className={styles.errorMessage}>Error: {error}</p>}
      {loading && <p className={styles.loadingMessage}>Loading...</p>}

      <div className={styles.gridContainer}>
        {[
          { key: "cheapestEighth", title: "Absolute Cheapest", data: cheapestEighths },
          { key: "cheapestOver25Thc", title: "Over 25% THC", data: cheapestOver25Thc },
          { key: "cheapestOver30Thc", title: "Over 30% THC", data: cheapestOver30Thc },
        ].map(({ key, title, data }) => (
          <div className={styles.categorySection} key={key}>
            <h2 className={styles.categoryTitle}>{title}</h2>
            <div className={styles.scrollableTable}>
              {data.length > 0 ? (
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
                    {sortedData(key, data).map((item, index) => (
                      <tr key={index}>
                        <td>{item.brand}</td>
                        <td>{item.product_name}</td>
                        <td>{item.thc}%</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.dispensary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noData}>No data available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default CheapestEighth;
