import styles from '../styles/Home.module.css'


export default function Home() {
    const style = {
        backgroundColor: process.env.BACKGROUND_COLOUR || "#000000",
        buttonColor: process.env.BUTTON_COLOUR,
        buttonColorDisabled: process.env.BUTTON_COLOUR_DISABLED,
    }

    return (
        <div className={styles.container} style={{backgroundColor: style.backgroundColor}}>
            <div className={styles.mainMenu}>
                <img src="event-graphic.png" alt="Logo" className={styles.logo} />

                <a href="/scan" className={styles.button} style={{backgroundColor: style.buttonColor}}>
                    <p>Scan</p>
                </a>

                {/* <a href="/manual" className={styles.button}>
                  <p>Manual Lookup</p>
                </a> */}
            </div>
        </div>
    )
}
