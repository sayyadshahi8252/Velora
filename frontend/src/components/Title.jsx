import React from 'react';
import styles from './Title.module.css';

export default function Title({text1,text2,para1}) {
  return (
    <div className={styles.titleContainer}>
      <h2>
        <span className={styles.textPrimary}>{text1} </span>
        <span className={styles.textSecondary}>{text2}</span>
      </h2>
      <p className={styles.subtitle}>
        {para1}
      </p>
    </div>
  );
}
