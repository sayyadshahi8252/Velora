import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import styles from "./ProductItem.module.css";

export default function ProductItem({ id, image, name, price }) {
  const { currency } = useContext(shopContext);

  return (
    <div className={styles.card}>
      <Link to={`/product/${id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img src={image} alt={name} className={styles.productImage} />
        </div>
        <div className={styles.info}>
          <p className={styles.productName}>{name}</p>
          <p className={styles.productPrice}>
            {currency} {price}
          </p>
        </div>
      </Link>
    </div>
  );
}
