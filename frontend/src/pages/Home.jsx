import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import Hero2 from './Hero2'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.homeContainer}>

      <Hero />
      <Hero2 />
      <LatestCollection />

      <BestSeller />
    </div>
  )
}
