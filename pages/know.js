import React from "react";
import styles from "../styles/Timeline.module.css";
import Header from "../components/header.js";
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
            />
        </div>
        <div className={styles.timeline}>
            {props.experiences.map((experience, index) =>
                <div key={index} className={ styles.container + " " + ((index % 2 == 0)?styles.left:styles.right) }>
                    <div className={styles.content}>
                        <p>{experience.Description}</p>
                    </div>
                </div>
            )}
        </div>
        </>

    )
    if (error) {
        console.log("ERROR: " + error.message)
        return <div>An error occured: {error.message}</div>;
    }

}

Timeline.getInitialProps = async ctx => {
    try {
        const resExp = await axios.get(`${Config.strapiHost}/experiences`);
        const experiences = resExp.data.map(experience => {
            return {
                Description: experience.Description,
                Year: experience.Year,
                Content: experience.Content.formats
            }
        })
        const resAva = await axios.get(`${Config.strapiHost}/avatar`);
        const avatar = resAva.data.Image;
        return { avatar, experiences };
    } catch (error) {
        return { error };
    }
};

export default Timeline