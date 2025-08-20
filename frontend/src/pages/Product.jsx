import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem'; 
import Title from '../components/Title'; 
import styles from './Product.module.css';

export default function Product() {
  const { productId } = useParams();
  const { products, addToCart } = useContext(shopContext);

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setMainImage(product.image[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [productId, products]);

  if (!productData) return <div>Loading...</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart({ ...productData, selectedSize, quantity: 1 });
  };

  const relatedProducts = products.filter(
    (p) => p.category === productData.category && p._id !== productData._id
  );

  return (
    <>
      <div className={styles.productPage}>
        <div className={styles.left}>
          <div className={styles.thumbnailWrapper}>
            {productData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={productData.name}
                className={`${styles.thumbnail} ${mainImage === img ? styles.activeThumb : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          <div className={styles.mainImageWrapper}>
            <img src={mainImage} alt={productData.name} className={styles.mainImage} />
          </div>

          <div className={styles.mobileSlider}>
            {productData.image.map((img, index) => (
              <div key={index} className={styles.mobileSlide}>
                <img src={img} alt={`${productData.name}-${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <h2 className={styles.productName}>{productData.name}</h2>
          <p className={styles.price}>Price: ₹{productData.price}</p>
          <p className={styles.description}>Description: {productData.description}</p>
          <p className={styles.description}>Category: {productData.category}</p>
          <p className={styles.description}>SubCategory: {productData.subcategory}</p>

          <div className={styles.sizeSection}>
            <p className={styles.label}>Select Size</p>
            <div className={styles.sizeButtons}>
              {productData.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            ADD TO CART
          </button>

          <div className={styles.policy}>
            <p>• 100% Original product</p>
            <p>• Cash on delivery available</p>
            <p>• Easy return & exchange within 7 days</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.collectionWrapper}>
          <Title
            text1="Related"
            text2="Items"
            para1="Products you may also like from the same category."
          />

          <div className={styles.productGrid}>
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image[0]}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
