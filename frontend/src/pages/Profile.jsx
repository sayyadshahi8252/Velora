import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import styles from "./Profile.module.css";

export default function Profile() {
  const { token, backendUrl } = useContext(shopContext);
  const [user, setUser] = useState({ name: "", email: "" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: decoded.name || "", email: decoded.email || "" });
    }
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { token } }
        );
        if (res.data.success) {
          setOrders(res.data.orders.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [token, backendUrl]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{getInitials(user.name)}</div>
        <div className={styles.userInfo}>
          <h2>{user.name || "Guest User"}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button>Edit Profile</button>
        <button>Change Password</button>
        <button>Logout</button>
      </div>

      <div className={styles.ordersSection}>
        <h3>Recent Orders</h3>
        {orders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <ul className={styles.ordersList}>
            {orders.map((order) => (
              <li key={order._id} className={styles.orderCard}>
                <p>Order #{order._id}</p>
                <p>
                  Status:
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase().replace(/\s/g, "")]}`}>
                    {order.status}
                  </span>
                </p>
                <p>Total: ₹{order.amount.toFixed(2)}</p>
                <p>Date: {new Date(order.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}