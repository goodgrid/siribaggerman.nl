import styles from "../styles/Footer.module.css";
import React from "react";

const Footer = ({ props, error }) => {

    return (
        <>
            <div className={styles.clearFix}>
                
            </div>
            <div className={styles.container}>
                    &copy; 1978-{(new Date()).getFullYear()} Siri Baggerman
            </div>
        </>
    )
}


Footer.getInitialProps = async ctx => {
    try {
        const res = await axios.get('http://goodgrid-strapi.sloppy.zone/menuItems');
        const menuItems = res.data.map(menuItem => {

            return {
                Title: menuItem.Title,
                url: menuItem.url
            }
        })

        return { menuItems };
    } catch (error) {
        return { error };
    }
};


export default Footer;