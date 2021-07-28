import React from "react";
import styles from "../styles/Timeline.module.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import Image from "next/image";
import axios from "axios";
import { Config } from "../components/config.js";

const Timeline = (props, error) => {
    return (
        <>
        <Header />
        <div className={styles.avatar}>
            <Image
                src={`${Config.strapiHost}${props.avatar.formats.thumbnail.url}`}
                placeholder="blur"
                blurDataURL={`${Config.strapiHost}${props.avatar.formats.thumbnail.url}`}
                width="110"
                height="110"
                alt="Avatar"
            />
        </div>
        <div className={styles.timeline}>
            {props.experiences.map((experience, index) =>
                <div key={index} className={ styles.container + " " + ((index % 2 == 0)?styles.left:styles.right) }>
                    <div className={styles.content}>
                        <div className={styles.experienceDescription}>{experience.Description}</div>
                        {(() => {
                            if (experience.Content !== null) {
                                return <div className={styles.experienceImage} ><Image
                                    src={`${Config.strapiHost}${experience.Content.small.url}`}
                                    layout="responsive"
                                    alt={experience.Description}
                                    width="100%"
                                    height="100%"
                                /></div>
                            }
                        })()}
                        <div className={styles.experienceType}>{experience.typeSubtype}</div>
                    </div>
                </div>
            )}
        </div>
        <Footer/>
        </>
    )
    if (error) {
        console.error("ERROR: " + error.message)
        return <div>An error occured: {error.message}</div>;
    }
}

Timeline.getInitialProps = async ctx => {
    try {
        const resExp = await axios.get(`${Config.strapiHost}/experiences`);
        const experiences = resExp.data.map(experience => {
            return {
                Description: experience.Description,
                Date: experience.Date,
                Content: ((experience.Content===null)?null:experience.Content.formats)
            }
        }).sort((exp1, exp2) => {
            return new Date(exp2.Date) - new Date(exp1.Date);
        });
        const resAva = await axios.get(`${Config.strapiHost}/avatar`);
        const avatar = resAva.data.Image;
        
        return { avatar, experiences };
    } catch (error) {
        return { error };
    }
};

export default Timeline