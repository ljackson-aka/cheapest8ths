import React, { useEffect, useState } from 'react';
import { fetchCheapest8ths } from '../api/apiService';
import styles from '../styles/CheapestEighth.module.css';

const CheapestEighth = () => {
  const [cheapestEighth, setCheapestEighth] = useState(null);
  const [cheapestOver25Thc, setCheapestOver25Thc] = useState(null);
  const [cheapestOver30Thc, setCheapestOver30Thc] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCheapest8ths();
      if (result) {
        setCheapestEighth(result.cheapestEighth);
        setCheapestOver25Thc(result.cheapestOver25Thc);
        setCheapestOver30Thc(result.cheapestOver30Thc);
      }
    };

    getData();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <h1 className={styles.header}>Find CHEAP8THS Near You</h1>

      {/* Cards Grid */}
      <div className={styles.cardContainer}>
        {/* Absolute Cheapest Eighth */}
        {cheapestEighth && (
          <div className={styles.card}>
            <h2>Absolute Cheapest</h2>
            <h3>{cheapestEighth.product_name} - ${cheapestEighth.price}</h3>
            <p><strong>Brand:</strong> {cheapestEighth.brand}</p>
            <p><strong>THC:</strong> {cheapestEighth.thc}%</p>
            <p><strong>Dispensary:</strong> {cheapestEighth.dispensary}</p>
            <p><strong>Type:</strong> {cheapestEighth.type}</p>
            <p><strong>Deal:</strong> {cheapestEighth.deal || "No deals available"}</p>
          </div>
        )}

        {/* Cheapest Over 25% THC */}
        {cheapestOver25Thc && (
          <div className={styles.highThcCard}>
            <h2>Over 25% THC</h2>
            <h3>{cheapestOver25Thc.product_name} - ${cheapestOver25Thc.price}</h3>
            <p><strong>Brand:</strong> {cheapestOver25Thc.brand}</p>
            <p><strong>THC:</strong> {cheapestOver25Thc.thc}% 🔥</p>
            <p><strong>Dispensary:</strong> {cheapestOver25Thc.dispensary}</p>
            <p><strong>Type:</strong> {cheapestOver25Thc.type}</p>
            <p><strong>Deal:</strong> {cheapestOver25Thc.deal || "No deals available"}</p>
          </div>
        )}

        {/* Cheapest Over 30% THC */}
        {cheapestOver30Thc && (
          <div className={styles.highThcCard}>
            <h2>Over 30% THC</h2>
            <h3>{cheapestOver30Thc.product_name} - ${cheapestOver30Thc.price}</h3>
            <p><strong>Brand:</strong> {cheapestOver30Thc.brand}</p>
            <p><strong>THC:</strong> {cheapestOver30Thc.thc}% 🚀</p>
            <p><strong>Dispensary:</strong> {cheapestOver30Thc.dispensary}</p>
            <p><strong>Type:</strong> {cheapestOver30Thc.type}</p>
            <p><strong>Deal:</strong> {cheapestOver30Thc.deal || "No deals available"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheapestEighth;