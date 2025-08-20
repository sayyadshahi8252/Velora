import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { shopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, backendUrl } = useContext(shopContext);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        setToken(token); 
        localStorage.setItem('token', token); 
        
        toast.success('Login successful!'); 
        navigate('/'); 
      } else {
        toast.error(response.data.message || 'Login failed'); 
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Something went wrong during login';
      toast.error(message); 
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>
        <p className={styles.registerText}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
