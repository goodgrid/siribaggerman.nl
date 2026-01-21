import styles from "../styles/Header.module.css";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import React, {useState} from "react";
import axios from 'axios';
import { Config } from "../components/config.js";

const Header = ({ menuItems, error }) => {

    return (
        <>
            <Head>
                <title>Siri Baggerman</title>
                <meta name="description" content="Siri Baggerman, Visual Artist" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Script defer src="https://cloud.umami.is/script.js" data-website-id={Config.umamiWebsiteId} strategy="lazyOnload"/>

            <div className={styles.container}>
                <div className={styles.leftHeader}>
                    <h1 className={styles.title}>
                        Siri Baggerman
                    </h1>
                </div>
                <div className={styles.rightHeader}>
                    <nav className={styles.navigation}>
                        <Link href="/" className={styles.navitem}>Current work</Link>
                        <Link href="/portfolio" className={styles.navitem}>Portfolio</Link>
                        <Link href="/contact" className={styles.navitem}>Contact</Link>
                    </nav>
                </div>
            </div>
            <div className={styles.clearFix}></div>
        </>
    )
}


Header.getInitialProps = async ctx => {
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


export default Header;