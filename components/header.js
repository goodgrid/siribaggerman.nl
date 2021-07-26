import styles from "../styles/Header.module.css";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
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
            <Script src="https://goodgrid.nl/matomo/matomo.js" strategy="lazyOnload"/>
            <Script strategy="lazyOnload">{`
                  var _paq = window._paq = window._paq || [];
                  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                  _paq.push(['trackPageView']);
                  _paq.push(['enableLinkTracking']);
                  (function() {
                    var u="//goodgrid.nl/matomo/";
                    _paq.push(['setTrackerUrl', u+'matomo.php']);
                    _paq.push(['setSiteId', '3']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                  })();
                  
            `}</Script>

            <div className={styles.container}>
                <div className={styles.leftHeader}>
                    <h1 className={styles.title}>
                        Siri Baggerman
                    </h1>
                </div>
                <div className={styles.rightHeader}>
                    <nav className={styles.navigation}>
                        <Link href="/"><a className={styles.navitem}>Current work</a></Link>
                        <Link href="/know"><a className={styles.navitem}>Portfolio</a></Link>
                        <Link href="/meet"><a className={styles.navitem}>Contact</a></Link>
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