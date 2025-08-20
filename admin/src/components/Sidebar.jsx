import React from 'react';
import styles from "./Sidebar.module.css";
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <NavLink to="/add">
        🟢 <p>Add Item</p>
      </NavLink>
      <NavLink to="/list">
        📄 <p>List Items</p>
      </NavLink>
      <NavLink to="/orders">
        🛒 <p>Orders</p>
      </NavLink>
    </div>
  );
}
