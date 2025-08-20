import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('Backend URL:', backendUrl);

      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token); 
        toast.success('Login successful!'); 
        navigate('/list'); 
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.heading}>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              className={styles.input}
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              className={styles.input}
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}
