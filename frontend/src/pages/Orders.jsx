import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import styles from "./Orders.module.css";

export default function Orders() {
  const { backendUrl, token, ordersUpdated } = useContext(shopContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, ordersUpdated]);

  return (
    <div className={styles.container}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <h3>
                Order #{order._id.substring(0, 8)}
                <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase().replace(/\s/g, '')]}`}>
                  {order.status}
                </span>
              </h3>
              <p>
                <b>Total:</b> ${order.amount.toFixed(2)} | <b>Date:</b> {new Date(order.date).toLocaleString()}
              </p>


              <table className={styles.orderTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={
                            Array.isArray(item.image)
                              ? item.image[0] || "/placeholder.png"
                              : item.image
                          }
                          alt={item.name}
                          className={styles.itemImage}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.mobileCards}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={styles.mobileItemCard}>
                    <img
                      src={
                        Array.isArray(item.image)
                          ? item.image[0] || "/placeholder.png"
                          : item.image
                      }
                      alt={item.name}
                      className={styles.mobileImage}
                    />
                    <div className={styles.mobileItemDetails}>
                      <p><b>Name:</b> {item.name}</p>
                      <p><b>Size:</b> {item.size}</p>
                      <p><b>Quantity:</b> {item.quantity}</p>
                      <p><b>Price:</b> ₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h4>Delivery Address:</h4>
              <p>
                {order.address.street}, {order.address.city}, {order.address.state},{" "}
                {order.address.zipcode}, {order.address.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}