import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Orders.module.css";

export default function Orders({ token }) {
  const [ orders, setOrders ] = useState([]);
  const [ filteredOrders, setFilteredOrders ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ sortStatus, setSortStatus ] = useState("");
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 500);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSort = (status) => {
    setSortStatus(status);
    if (!status) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status.toLowerCase() === status.toLowerCase())
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>All Orders</h1>
        <div className={styles.sortBy}>
          <label>Sort By Status:</label>
          <select value={sortStatus} onChange={(e) => handleSort(e.target.value)} className={styles.select}>
            <option value="">All Orders</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {isMobile ? (
 
        <div className={styles.cardList}>
          {filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>User:</span>
                <div>
                  <span className={styles.userName}>{order.userId?.name}</span>
                  <span className={styles.userEmail}>({order.userId?.email})</span>
                </div>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>Items:</span>
                <span>{order.items.map((item) => item.name || item).join(", ")}</span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>Amount:</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>Address:</span>
                <span>
                  {order.address.street}, {order.address.city}, {order.address.state},{" "}
                  {order.address.zipcode}, {order.address.country}
                </span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>Payment:</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.label}>Status:</span>
                <span
                  className={`${styles.statusBadge} ${styles[ order.status.toLowerCase().replace(/\s/g, "") ]
                    }`}
                >
                  {order.status}
                </span>
              </div>
              <div className={styles.cardActionRow}>
                <span className={styles.label}>Update Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={styles.select}
                >
                  <option>Order Placed</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>OrderId</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className={styles.userName}>User: {order.userId}</span>
                    {/* <span className={styles.userName}>{order.userId?.name}</span> */}
                    {/* <span className={styles.userEmail}>({order.userId?.email})</span> */}
                  </td>
                  <td>{order.items.map((item) => item.name || item).join(", ")}</td>
                  <td>${order.amount.toFixed(2)}</td>
                  <td>
                    {order.address.street}, {order.address.city}, {order.address.state},{" "}
                    {order.address.zipcode}, {order.address.country}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[ order.status.toLowerCase().replace(/\s/g, "") ]
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={styles.select}
                    >
                      <option>Order Placed</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      {/* <option>Canceled</option>  */}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}