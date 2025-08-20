import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { shopContext } from '../context/ShopContext';
import styles from './Navbar.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const { cart, token, setToken, products } = useContext(shopContext);

  const handleProfileClick = () => {
    if (token) setOpenDropdown(prev => !prev);
    else navigate("/login");
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setOpenDropdown(false);
    toast.success("Logged out successfully!"); 
    navigate("/"); 
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (productName) => {
    setSearchTerm("");
    navigate(`/collection?search=${encodeURIComponent(productName)}`);
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 3);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Velora</Link>

      <div className={`${styles.menu} ${openMenu ? styles.menuOpen : ""}`}>
        <button className={styles.closeBtn} onClick={() => setOpenMenu(false)}>
          <FaTimes />
        </button>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.link} onClick={() => setOpenMenu(false)}>Home</NavLink>
        <NavLink to="/collection" className={({ isActive }) => isActive ? styles.active : styles.link} onClick={() => setOpenMenu(false)}>Collection</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : styles.link} onClick={() => setOpenMenu(false)}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : styles.link} onClick={() => setOpenMenu(false)}>Contact</NavLink>
      </div>

      <div className={styles.cta}>
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm && (
            <div className={styles.searchDropdown}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <div 
                    key={p._id} 
                    className={styles.searchItem}
                    onClick={() => handleProductClick(p.name)}
                  >
                    {p.name}
                  </div>
                ))
              ) : (
                <div className={styles.searchItem}>No products found</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.profileWrapper}>
          <FaUserCircle className={styles.profileIcon} onClick={handleProfileClick} />
          {openDropdown && token && (
            <div className={styles.dropdown}>
              <NavLink to="/profile" className={styles.dropdownItem} onClick={() => setOpenDropdown(false)}>My Profile</NavLink>
              <NavLink to="/orders" className={styles.dropdownItem} onClick={() => setOpenDropdown(false)}>Orders</NavLink>
              <button className={styles.dropdownItem} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <NavLink to="/cart" className={styles.iconBtn} style={{ position: "relative" }}>
          <FaShoppingCart className={styles.cartIcon} />
          {cart.length > 0 && <span className={styles.cartCount}>{cart.reduce((total, item) => total + (item.quantity || 1), 0)}</span>}
        </NavLink>

        <button className={styles.hamburger} onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
