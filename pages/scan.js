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

  const style = {
    backgroundColor: process.env.BACKGROUND_COLOUR || "#000000",
    buttonColor: process.env.BUTTON_COLOUR,
    buttonColorDisabled: process.env.BUTTON_COLOUR_DISABLED,
  }

  return (
    <div className={styles.container} style={{backgroundColor: style.backgroundColor}}>
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
