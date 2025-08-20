import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import styles from './BestSeller.module.css' 

export default function BestSeller() {
  const { products } = useContext(shopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 8));
    }
  }, [products]);

  return (
    <div className={styles.bestSellerSection}>
      <div>
        <Title
          text1="Best"
          text2="Seller"
          para1="Explore the most popular books curated just for you. Find your next favorite read here."
        />
      </div>
    
      <div className={styles.productGrid}> 
        {bestSeller.map((product) => (
          <ProductItem
            key={product._id}
            id={product._id}
            image={Array.isArray(product.image) ? product.image[0] : product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}