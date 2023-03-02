import styles from "../styles/Button.module.css";
import React from "react";

// Button based on https://codepen.io/natalia-reshetnikova/pen/oRRjPP

const Button = ({caption}) => {
    return (<div className={styles.button}>
        <span>{caption}</span>
    </div>)
}

export default Button;


