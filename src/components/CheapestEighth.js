import React, { useEffect, useState } from 'react';
import { fetchCheapest8ths } from '../api/apiService';
import styles from '../styles/CheapestEighth.module.css';

const CheapestEighth = () => {
  const [cheapestEighths, setCheapestEighths] = useState([]);
  const [cheapestOver25Thc, setCheapestOver25Thc] = useState([]);
  const [cheapestOver30Thc, setCheapestOver30Thc] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchCheapest8ths();
        if (result) {
          console.log("API Response:", result); // Debugging line
          setCheapestEighths(result.cheapestEighth || []);
          setCheapestOver25Thc(result.cheapestOver25Thc || []);
          setCheapestOver30Thc(result.cheapestOver30Thc || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Find CHEAP8THS Near You</h1>

      <div className={styles.gridContainer}>
        {/* 🏆 Absolute Cheapest Eighths */}
        <div className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>Absolute Cheapest</h2>
          <div className={styles.cardGrid}>
            {cheapestEighths.length > 0 ? (
              cheapestEighths.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}%</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))
            ) : (
              <p className={styles.noData}>No data available</p>
            )}
          </div>
        </div>

        {/* 🔥 Cheapest Over 25% THC */}
        <div className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>Over 25% THC</h2>
          <div className={styles.cardGrid}>
            {cheapestOver25Thc.length > 0 ? (
              cheapestOver25Thc.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}% 🔥</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))
            ) : (
              <p className={styles.noData}>No data available</p>
            )}
          </div>
        </div>

        {/* 🚀 Cheapest Over 30% THC */}
        <div className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>Over 30% THC</h2>
          <div className={styles.cardGrid}>
            {cheapestOver30Thc.length > 0 ? (
              cheapestOver30Thc.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}% 🚀</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))
            ) : (
              <p className={styles.noData}>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheapestEighth;
