import React from 'react';
import velrahero from '../assets/Velora.png';
import styles from './Hero2.module.css';

export default function Hero2() {
  return (
    <div className={styles.heroContainer}>
      <img src={velrahero} alt="Velora Hero" className={styles.heroImage} />
    </div>
  );
}
