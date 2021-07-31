import styles from "../styles/Home.module.css";
import axios from 'axios';
import Image from "next/image";
import React, {useState} from "react";
import FsLightbox from 'fslightbox-react';
import Header from "../components/header.js";
import Footer from "../components/footer.js";
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

    function tellme() {
        alert("test")
    }

    return (
        <>
            <Header />
            <main className={styles.main}>

                <div>

                {props.works.map((work, index) =>
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
                        />
                        {(() => {
                            if (work.Status == "Sold") {
                                return <div className={styles.workSoldIndicator} >sold</div>
                            }
                        })()}
                        
                    </a>
                    </div>
                )}
                <FsLightbox
                    toggler={toggler.toggler}
                    slide={toggler.slide}
                    sources={props.works.map(work => {
                        return Config.strapiHost + work.Images.large.url
                    })}
                    captions={props.works.map(work => {
                        return <div key={work.Title} className={styles.workCaption}>
                            <h3>{work.Title}</h3>
                            <hr/>
                            <p>Materiaal: {work.Material} // Formaat: {work.Sizes} // Prijs: {work.Price} // Status: {work.Status}</p>
                            
                        </div>
                    })}
                />
                </div>
            </main>
            <span className={styles.indextext}>
                Siri studeerde in 2005 af aan de Hogeschool voor de Kunsten in Utrecht. De jaren daarna woonde en werkte ze in Helsinki, Berlijn en Utrecht. Vanaf 2009 richtte ze zich op het medium film en performance. Sinds 2020 richt ze zich weer op haar oorspronkelijke discipline, schilderen.
            </span>
            <Footer/>
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
                Images: work.Image.formats,
                Status: work.Status,
                Sizes: work.Sizes,
                Material: work.Material,
                Price: work.Price
            }
        }).reverse()

        return { works };
    } catch (error) {
        return { error };
    }
};

export default Home;