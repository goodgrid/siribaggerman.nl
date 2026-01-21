import React, {useEffect} from "react";
import styles from "../styles/Contact.module.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import Image from "next/image";
import axios from "axios";
import { Config } from "../components/config.js";

// Umami tracking helper
const trackEvent = (eventName, eventData = {}) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(eventName, eventData);
    }
};

const Contact = (props, error) => {

    // Scroll tracking
    useEffect(() => {
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercentage > 25 && scrollPercentage <= 50) {
                    trackEvent('scroll_depth', { depth: '25%', page: 'contact' });
                } else if (scrollPercentage > 50 && scrollPercentage <= 75) {
                    trackEvent('scroll_depth', { depth: '50%', page: 'contact' });
                } else if (scrollPercentage > 75 && scrollPercentage < 100) {
                    trackEvent('scroll_depth', { depth: '75%', page: 'contact' });
                } else if (scrollPercentage >= 100) {
                    trackEvent('scroll_depth', { depth: '100%', page: 'contact' });
                }
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

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