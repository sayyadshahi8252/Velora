import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const shopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '₹';
  const delivery_fee = 30;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');

  const [ordersUpdated, setOrdersUpdated] = useState(false);
  const triggerOrdersUpdate = () => setOrdersUpdated(prev => !prev);

  const addToCart = async (product) => {
    if (!product.selectedSize) return;

    const existing = cart.find(
      item => item._id === product._id && item.selectedSize === product.selectedSize
    );

    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id && item.selectedSize === product.selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId: product._id, size: product.selectedSize },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUserCart = async () => {
    if (!token || products.length === 0) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const cartData = response.data.cartData || {};
        const mergedCart = [];

        for (let itemId in cartData) {
          const product = products.find(p => p._id === itemId);
          if (!product) continue;

          for (let size in cartData[itemId]) {
            mergedCart.push({
              _id: itemId,
              name: product.name,
              price: product.price,
              image: product.image,
              selectedSize: size,
              quantity: cartData[itemId][size]
            });
          }
        }

        setCart(mergedCart);
        localStorage.setItem("cart", JSON.stringify(mergedCart));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);

    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (token && products.length > 0) fetchUserCart();
  }, [token, products]);

  return (
    <shopContext.Provider value={{
      products,
      currency,
      delivery_fee,
      cart,
      setCart,
      addToCart,
      backendUrl,
      token,
      setToken,
      ordersUpdated,       
      triggerOrdersUpdate  
    }}>
      {children}
    </shopContext.Provider>
  );
};

export default ShopContextProvider;


