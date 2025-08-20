import React, { useEffect, useState } from 'react';
import styles from './List.module.css';
import axios from 'axios';
import { backendUrl } from '../App';

export default function List({ token }) {
  const [list, setList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token }
      });
      if (response.data.success) {
        setList(response.data.products || response.data.data || []);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, {
        headers: { token }
      });
      if (response.data.success) {
        setList(list.filter(product => product._id !== id));
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Product List</h1>

      {isMobile ? (
        <div className={styles.cardList}>
          {list.map((item) => (
            <div key={item._id} className={styles.productCard}>
              <div className={styles.cardHeader}>
                {item.image && item.image[0] ? (
                  <img src={item.image[0]} alt={item.name} className={styles.productImage} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
                <div className={styles.cardDetails}>
                  <p><b>Name:</b> {item.name}</p>
                  <p><b>Category:</b> {item.category}</p>
                  <p><b>Price:</b> ${item.price}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.image && item.image[0] ? (
                    <img src={item.image[0]} alt={item.name} className={styles.productImage} />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>
                  <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}