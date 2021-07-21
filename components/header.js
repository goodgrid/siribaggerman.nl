/*jshint esversion: 6 */
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
                    <nav id="hamnav">
                        <label htmlFor="hamburger">&#9776;</label>
                        <input type="checkbox" id="hamburger"/>

                        <div id="hamitems">
                            <Link href="/">See</Link>
                            <Link href="/know">Know</Link>
                            <Link href="/greet">Meet</Link>
                        </div>
                    </nav>
                </div>
            </div>

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