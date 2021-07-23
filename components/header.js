import styles from "../styles/Header.module.css";
import Head from "next/head";
import Link from "next/link";
import React, {useState} from "react";
import axios from 'axios';

const Header = ({ menuItems, error }) => {

    return (
        <>
            <Head>
                <title>Siri Baggerman</title>
                <meta name="description" content="Siri Baggerman, Beeldend Kunstenaar" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className={styles.container}>
                <div className={styles.leftHeader}>
                    <h1 className={styles.title}>
                        Siri Baggerman
                    </h1>
                </div>
                <div className={styles.rightHeader}>
                    <Link href="/"><a className={styles.navitem}>Current work</a></Link>
                    <Link href="/know"><a className={styles.navitem}>Portfolio</a></Link>
                    <Link href="/greet"><a className={styles.navitem}>Contact</a></Link>
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