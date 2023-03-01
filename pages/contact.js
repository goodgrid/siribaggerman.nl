import React from "react";
import styles from "../styles/Contact.module.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import Image from "next/image";
import axios from "axios";
import { Config } from "../components/config.js";

const Contact = (props, error) => {

    return (
        <>
            <Header />
            <div className={styles.contactdetails}>
                <p>{props.telefoonnummer}</p>
                <p>{props.emailadres}</p>
            </div>
            <div className={styles.locatie}>
                <Image
                    src={`${Config.strapiHost}${props.locatie.data.attributes.formats.small.url}`}
                    width={props.locatie.data.attributes.formats.small.width}
                    height={props.locatie.data.attributes.formats.small.height}
                    alt="locatie atelier"
                />
            </div>
            <Footer/>
        </>

    )
    if (error) {
        console.log("ERROR: " + error.message)
        return <div>An error occured: {error.message}</div>;
    }

}

Contact.getInitialProps = async ctx => {
    try {
        const res = await axios.get(`${Config.strapiHost}/api/contact-detail?populate=locatie`)
        
        return res.data.data.attributes
    } catch (error) {
        return { error };
    }
};

export default Contact