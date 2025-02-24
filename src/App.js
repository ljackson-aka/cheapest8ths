import React from 'react';
import CheapestEighth from './components/CheapestEighth';
import styles from './styles/App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        Find <span>CHEAP8THS</span> Near You
      </header>
      <CheapestEighth />
    </div>
  );
}

export default App;