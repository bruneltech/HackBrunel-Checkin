import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.mainMenu}>
        <img src="event-graphic.png" alt="Hackbrunel Logo" className={styles.logo} />

        <a href="/scan" className={styles.button}>
          <p>Scan</p>
        </a>

        {/* <a href="/manual" className={styles.button}>
          <p>Manual Lookup</p>
        </a> */}
      </div>
    </div>
  )
}
