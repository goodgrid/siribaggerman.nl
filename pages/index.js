import styles from "../styles/Home.module.css";
import Head from "next/head";
import axios from 'axios';
import Image from "next/image";
import React, {useState} from "react";
import FsLightbox from 'fslightbox-react';
import Header from "../components/header.js";



const Home = ({ works, error }) => {

    const [toggler, setToggler] = React.useState({
        toggler: false,
        sourceIndex: 0
    });

    function openLightboxOnSlide(number) {
        setToggler({
            toggler: !toggler.toggler,
            slide: number
        });
    }

    return (
        <main className={styles.main}>
                <Header />
                <div>
                {works.reverse().map((work, index) =>

                    <div key={index} className={styles.workContainer} >
                    <a href="#" onClick={() => openLightboxOnSlide(index+1)}>
                        <Image
                            className={styles.workImage}
                            src={"https://goodgrid-strapi.sloppy.zone" + work.Images.small.url}
                            alt={work.Title}
                            placeholder="blur"
                            blurDataURL={"https://goodgrid-strapi.sloppy.zone" + work.Images.thumbnail.url}
                            width="500"
                            height={500*work.Images.small.height/work.Images.small.width}
                            layout="intrinsic"
                        />
                    </a>
                    </div>
                )}
                <FsLightbox
                    toggler={toggler.toggler}
                    slide={toggler.slide}
                    sources={works.map(work => {
                        return "https://goodgrid-strapi.sloppy.zone" + work.Images.large.url
                    })}
                />
                </div>
        </main>

    );
    if (error) {
        return <div>An error occured: {error.message}</div>;
    }
};

Home.getInitialProps = async ctx => {
    try {
        const res = await axios.get('http://goodgrid-strapi.sloppy.zone/works');
        const works = res.data.map(work => {
            return {
                Title: work.Title,
                Images: work.Image.formats
            }
        })

        return { works };
    } catch (error) {
        return { error };
    }
};

export default Home;