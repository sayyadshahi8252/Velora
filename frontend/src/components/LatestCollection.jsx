import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import styles from './LatestCollection.module.css';

export default function LatestCollection() {
  const { products, currency } = useContext(shopContext);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProduct(products.slice(0, 10));
    }
  }, [products]);

  useEffect(() => {
    console.log("Products from context:", products);
  }, [products]);

  return (
    <div className={styles.collectionWrapper}>
      <Title
        text1="Trending"
        text2="Collection"
        para1="Explore the most popular books curated just for you. Find your next favorite read here."
      />
      <div className={styles.productGrid}>
        {latestProduct.map((product) => (
          <ProductItem
            key={product.id}
            id={product._id}
            image={product.image[0]}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
