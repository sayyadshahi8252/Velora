import React from "react";
import styles from "./AboutUs.module.css";
import aboutImage from "../assets/ChatGPT Image Aug 20, 2025, 10_24_00 PM.png"

export default function AboutUs() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.content}>
        <h2 className={styles.title}>About Velora</h2>
        <p className={styles.description}>
          Welcome to <strong>Velora</strong>, your ultimate destination for stylish and high-quality clothing.  
          We combine modern fashion trends with comfort and affordability, making every outfit a statement.
        </p>
        <ul className={styles.keyPoints}>
          <li>Premium Quality Materials</li>
          <li>Latest Fashion Trends</li>
          <li>Customer-Focused Service</li>
          <li>Eco-Friendly Practices</li>
        </ul>
        <p className={styles.description}>
          At Velora, we believe fashion is more than just clothing—it's an experience. 
          Our goal is to bring elegance, style, and confidence to every wardrobe.
        </p>
      </div>
      <div className={styles.imageContainer}>
        <img src={aboutImage} alt="Velora Fashion" className={styles.image} />
      </div>
    </section>
  );
}
