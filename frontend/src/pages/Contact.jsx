
import React, { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', name, 'Email:', email, 'Message:', message);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactBox}>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
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

          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message"
            rows="5"
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
