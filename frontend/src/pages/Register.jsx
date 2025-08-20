import React, { useState, useContext } from 'react';
import styles from './Register.module.css';
import { shopContext } from '../context/ShopContext';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setToken, backendUrl } = useContext(shopContext); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token); 
        alert('Registration successful!');
      } else {
        alert(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong during registration');
    }

    console.log('Name:', name, 'Email:', email, 'Password:', password);
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerBox}>
        <h2>Register</h2>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

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

          <button type="submit">Register</button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
