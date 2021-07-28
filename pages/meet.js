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
                <p>{props.contact.Telefoonnummer}</p>
                <p>{props.contact.Emailadres}</p>
            </div>
            <div className={styles.locatie}>
                <Image
                    src={`${Config.strapiHost}${props.contact.Locatie.formats.small.url}`}
                    width={props.contact.Locatie.formats.small.width}
                    height={props.contact.Locatie.formats.small.height}
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
        const resContact = await axios.get(`${Config.strapiHost}/contact-details`);
        const contact = resContact.data;
        return { contact };
    } catch (error) {
        return { error };
    }
};

export default Contact