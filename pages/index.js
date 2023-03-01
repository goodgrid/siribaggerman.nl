import styles from "../styles/Home.module.css";
import axios from 'axios';
import Image from "next/image";
import React, {useState} from "react";
import FsLightbox from 'fslightbox-react';
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import { Config } from "../components/config.js";
import Story from "../components/story.js";
import Link from "next/link"



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
                    <a href={"#" + work.title} onClick={() => openLightboxOnSlide(index+1)}>
                        <Image
                            className={styles.workImage}
                            src={Config.strapiHost + work.images.small.url}
                            alt={work.title}
                            placeholder="blur"
                            blurDataURL={Config.strapiHost + work.images.thumbnail.url}
                            width="500"
                            height={500*work.images.small.height/work.images.small.width}
                        />
                        {(() => {
                            if (work.status == "Sold") {
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
                        return Config.strapiHost + work.images.large.url
                    })}
                    captions={props.works.map(work => {
                        return <div key={work.title} className={styles.workCaption}>
                            <h3>{work.title} <Story/></h3> 
                            
                            <p>Materiaal: {work.material} &nbsp;&frasl;&frasl;&nbsp; Formaat: {work.sizes} &nbsp;&frasl;&frasl;&nbsp; Prijs: {work.price} &nbsp;&frasl;&frasl;&nbsp; Status: {work.status}</p>
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
        const res = await axios.get(`${Config.strapiHost}/api/works?populate=Image`);

        const works = res.data.data.map(work => {
            return {
                title: work.attributes.Title,
                images:  work.attributes.Image.data.attributes.formats,
                status: work.attributes.Status,
                sizes: work.attributes.Sizes,
                material: work.attributes.Material,
                price: work.attributes.Price
            }
        }).reverse()

        return { works };
    } catch (error) {
        console.log("ERROR", error.message)
        return { error };
    }
};

export default Home;