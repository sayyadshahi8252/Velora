import React, { useContext, useEffect } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, setCart, currency, delivery_fee, token, backendUrl } = useContext(shopContext);

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;


  const updateBackendCart = async (itemId, size, quantity) => {
    if (!token || !userId) return;
    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { token } }
      );
    } catch (err) {
      console.error("Error updating cart in backend:", err);
    }
  };


const removeItem = (id, size) => {
    const updatedCart = cart.filter(item => !(item._id === id && item.selectedSize === size));
    setCart(updatedCart);
    updateBackendCart(id, size, 0);
  };

  const increaseQty = (id, size) => {
    const updatedCart = cart.map(item =>
      item._id === id && item.selectedSize === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    const item = updatedCart.find(item => item._id === id && item.selectedSize === size);
    if (item) updateBackendCart(id, size, item.quantity);
  };

  const decreaseQty = (id, size) => {
    const updatedCart = cart.map(item =>
      item._id === id && item.selectedSize === size
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setCart(updatedCart);
    const item = updatedCart.find(item => item._id === id && item.selectedSize === size);
    if (item) updateBackendCart(id, size, item.quantity);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const total = subtotal + delivery_fee;

  if (cart.length === 0) return <div className={styles.empty}>Your cart is empty.</div>;


    const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/placeorder", { state: { cart } });
  };

  return (
    <div className={styles.cartPage}>
      <h2>Your Cart</h2>
      <div className={styles.cartItems}>
        {cart.map(item => (
          <div key={`${item._id}-${item.selectedSize}`} className={styles.cartItem}>
            <img src={item.image?.[0]} alt={item.name} className={styles.cartImg} />
            <div className={styles.itemInfo}>
              <h3>{item.name}</h3>
              <p>Size: {item.selectedSize}</p>
              <p>Price: {currency}{item.price}</p>
              <div className={styles.qtyControls}>
                <button onClick={() => decreaseQty(item._id, item.selectedSize)}>-</button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => increaseQty(item._id, item.selectedSize)}>+</button>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => removeItem(item._id, item.selectedSize)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <h3>CART TOTALS</h3>
        <div className={styles.summaryRow}>
          <span>Subtotal :</span>
          <span>{currency}{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping Fee :</span>
          <span>{currency}{delivery_fee.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRowTotal}>
          <strong>Total :</strong>
          <strong>{currency}{total.toFixed(2)}</strong>
        </div>
        <button className={styles.checkoutBtn} onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
      </div>
    </div>
  );
}
