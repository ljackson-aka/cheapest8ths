import React, { useEffect, useState } from 'react';
import { fetchCheapest8ths } from '../api/apiService';
import styles from '../styles/CheapestEighth.module.css';

const CheapestEighth = () => {
  const [cheapestEighths, setCheapestEighths] = useState([]);
  const [cheapestOver25Thc, setCheapestOver25Thc] = useState([]);
  const [cheapestOver30Thc, setCheapestOver30Thc] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCheapest8ths();
      if (result) {
        setCheapestEighths(result.cheapestEighths || []);
        setCheapestOver25Thc(result.cheapestOver25Thc || []);
        setCheapestOver30Thc(result.cheapestOver30Thc || []);
      }
    };

    getData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Find CHEAP8THS Near You</h1>

      <div className={styles.cardContainer}>
        {/* Absolute Cheapest Eighths */}
        {cheapestEighths.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.categoryHeader}>Absolute Cheapest</h2>
            <div className={styles.grid}>
              {cheapestEighths.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}%</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cheapest Over 25% THC */}
        {cheapestOver25Thc.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.categoryHeader}>Over 25% THC</h2>
            <div className={styles.grid}>
              {cheapestOver25Thc.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}% 🔥</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cheapest Over 30% THC */}
        {cheapestOver30Thc.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.categoryHeader}>Over 30% THC</h2>
            <div className={styles.grid}>
              {cheapestOver30Thc.map((item, index) => (
                <div key={index} className={styles.card}>
                  <h3>{item.product_name} - ${item.price}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>THC:</strong> {item.thc}% 🚀</p>
                  <p><strong>Dispensary:</strong> {item.dispensary}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Deal:</strong> {item.deal || "No deals available"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheapestEighth;
