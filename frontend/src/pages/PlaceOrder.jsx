import React, { useContext, useState } from 'react';
import styles from "./PlaceOrder.module.css";
import { shopContext } from '../context/ShopContext';
import axios from "axios";

export default function PlaceOrder() {
  const { backendUrl, token, cart, setCart, delivery_fee, triggerOrdersUpdate } = useContext(shopContext);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '',
    state: '', zipcode: '', country: '', phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    for (let key in formData) {
      if (!formData[key].trim()) newErrors[key] = `${key} is required`;
    }

    if (!paymentMethod) newErrors.payment = "Please select a payment method";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderItems = cart.map(item => ({
      itemId: item._id,
      name: item.name,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
      image: Array.isArray(item.image) ? item.image[0] : item.image
    }));

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + delivery_fee;

    try {
      const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        { userId, items: orderItems, amount: totalAmount, address: formData },
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
        triggerOrdersUpdate();
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        {/* Delivery Info */}
        <div className={styles.deliveryInfo}>
          <h3>Delivery Information</h3>
          <form>
            <div className={styles.row}>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            </div>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} />
            <div className={styles.row}>
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <input type="text" name="zipcode" placeholder="Zipcode" value={formData.zipcode} onChange={handleChange} />
              <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
            </div>
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </form>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3>Cart Totals</h3>
          <div className={styles.cartItem}>
            <span>Subtotal</span>
            <span>₹{(cart.reduce((sum, i) => sum + i.price * i.quantity, 0)).toFixed(2)}</span>
          </div>
          <div className={styles.cartItem}>
            <span>Shipping Fee</span>
            <span>₹{delivery_fee.toFixed(2)}</span>
          </div>
          <div className={styles.cartItemTotal}>
            <span>Total</span>
            <span>₹{(cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + delivery_fee).toFixed(2)}</span>
          </div>

          <h3>Payment Method</h3>
          <div className={styles.paymentMethods}>
            <label>
              <input type="radio" name="payment" value="stripe" onChange={() => setPaymentMethod('stripe')} /> Stripe
            </label>
            <label>
              <input type="radio" name="payment" value="razorpay" onChange={() => setPaymentMethod('razorpay')} /> Razorpay
            </label>
            <label>
              <input type="radio" name="payment" value="cod" onChange={() => setPaymentMethod('cod')} /> Cash on Delivery
            </label>
          </div>

          <button className={styles.placeOrderBtn} onClick={handleSubmit}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
