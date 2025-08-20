import React from "react";
import styles from "./Hero.module.css";
import heroImage from "../assets/Pastel Elegance with Tulle Scarf.png";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1>Experience the World of Knowledge</h1>
        <p>
          Velora brings you a curated collection of books and stories  
          that inspire, educate, and entertain. Dive into endless adventures  
          and let your imagination flourish.
        </p>
      </div>
      <div className={styles.right}>
        <img src={heroImage} alt="Hero" className={styles.heroImage} />
      </div>
    </section>
  );
};

export default Hero;
