import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import styles from "./Collection.module.css";

export default function Collection() {
  const { products } = useContext(shopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); 
  const [showSidebar, setShowSidebar] = useState(false); 

  useEffect(() => {
    let updatedProducts = [...products];

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedCategories.some(
          (cat) => cat.toLowerCase() === product.category.toLowerCase()
        )
      );
    }

    if (selectedTypes.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedTypes.some(
          (type) => type.toLowerCase() === product.subcategory.toLowerCase()
        )
      );
    }

    if (sortOrder === "high") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "low") {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [selectedCategories, selectedTypes, products, sortOrder]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  return (
    <div className={styles.collectionPage}>
      <button
        className={styles.filterToggleBtn}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${showSidebar ? styles.active : ""}`}>
        <h3>FILTERS</h3>

        <div className={styles.filterSection}>
          <h4>CATEGORIES</h4>
          {["MEN", "WOMEN", "KIDS"].map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                value={cat}
                onChange={handleCategoryChange}
              />{" "}
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h4>TYPE</h4>
          {["Topwear", "Bottomwear", "Winterwear","T-Shirts"].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                onChange={handleTypeChange}
              />{" "}
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.productSection}>
        <div className={styles.topBar}>
          <h3>ALL COLLECTIONS</h3>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Sort by: Relevant</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image[0]}
                name={product.name}
                price={product.price}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
