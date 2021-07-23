import styles from "../styles/Home.module.css";
import axios from 'axios';
import Image from "next/image";
import React, {useState} from "react";
import FsLightbox from 'fslightbox-react';
import Header from "../components/header.js";
import { Config } from "../components/config.js";




const Home = ( props, error ) => {

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
    console.log(props)
    return (
        <>
            <Header />
            <main className={styles.main}>

                <div>

                {props.works.reverse().map((work, index) =>
                    <div key={index} className={styles.workContainer} >
                    <a href="#" onClick={() => openLightboxOnSlide(index+1)}>
                        <Image
                            className={styles.workImage}
                            src={Config.strapiHost + work.Images.small.url}
                            alt={work.Title}
                            placeholder="blur"
                            blurDataURL={Config.strapiHost + work.Images.thumbnail.url}
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
                    sources={props.works.reverse().map(work => {
                        return Config.strapiHost + work.Images.large.url
                    })}
                />
                </div>
            </main>
        </>
    );
    if (error) {
        return <div>An error occured: {error.message}</div>;
    }
};

Home.getInitialProps = async ctx => {
    try {
        console.log(`Getting WORKS at ${Config.strapiHost}`)
        const res = await axios.get(`${Config.strapiHost}/works`);
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