import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {QrScanner} from '@yudiel/react-qr-scanner';

export default function Scan() {
  const handleScan = data => {
    if (data) {
      // Navigate to ticket page to fetch data.
      window.location.href = "/ticket?ticketID=" + data;
    }
  }

  const handleError = err => {
    console.error(err)
    alert("Scan Failure: " + err);
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainMenu}>
        <h2>Scan QR Code</h2>

        <QrScanner
          onDecode={handleScan}
          onError={handleError}
          />
      </div>
    </div>
  )
}
