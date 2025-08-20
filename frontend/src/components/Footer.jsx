import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>About Velora</h3>
          <p>
            Velora is your go-to online clothing store. Trending collections, bestsellers, and more.
          </p>
        </div>

        <div className={styles.section}>
          <h3>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

       
        <div className={styles.section}>
          <h3>Contact</h3>
          <p>Email: support@velora.com</p>
          <p>Phone: +91 12345 67890</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Velora. All rights reserved.</p>
      </div>
    </footer>
  );
}
