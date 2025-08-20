import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar({ setToken }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token'); 
    toast.success('Logged out successfully!'); 
  };

  return (
    <div className={styles.navbar}>
      <h1>Velora</h1>
      
 
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>

    
      <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
        <NavLink to="/add" onClick={() => setIsMenuOpen(false)}>Add</NavLink>
        <NavLink to="/list" onClick={() => setIsMenuOpen(false)}>List</NavLink>
        <NavLink to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</NavLink>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
