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
                src={`${Config.strapiHost}${props.avatar.data.attributes.formats.thumbnail.url}`}
                placeholder="blur"
                blurDataURL={`${Config.strapiHost}${props.avatar.data.attributes.formats.thumbnail.url}`}
                width="110"
                height="110"
                alt="Avatar"
            />
        </div>
        <div className={styles.timeline}>
            {props.experiences.map((experience, index) =>
                
                <div key={index} className={ styles.container + " " + ((index % 2 == 0)?styles.left:styles.right) }>
                    
                    <div className={styles.content}>
                        <div className={styles.experienceDescription}>{experience.description}</div>    
                        {(() => {
                            if (experience.content !== null) {
                                return <div className={styles.experienceImage} style={{position: "relative", width:"100%", "minHeight":"200px", backgroundColor: "lightgray"}}><Image
                                    src={`${Config.strapiHost}${(experience.content.attributes.formats.small!==undefined)?experience.content.attributes.formats.small.url:experience.content.attributes.formats.thumbnail.url}`}
                                    layout='fill'
                                    objectFit='contain'
                                    alt={experience.description}
                                /></div>
                            }
                        })()}
                        <div className={styles.experienceBottom}>
                            <div className={styles.experienceType}>{experience.type.replace("_"," // ")}</div>
                            <div className={styles.experienceYear}>{(new Date(experience.date).getFullYear())}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer/>
        </>
    )
}

Timeline.getInitialProps = async ctx => {
    try {
        const resExp = await axios.get(`${Config.strapiHost}/api/experiences?populate=Content`)
        
        const experiences = resExp.data.data.map(experience => {
            
            return {
                description: experience.attributes.Description,
                date: experience.attributes.Date,
                type: experience.attributes.typeAndSubtype,
                content: ((experience.attributes.Content.data===null)?null:experience.attributes.Content.data)
            }
        }).sort((exp1, exp2) => {
            return new Date(exp2.Date) - new Date(exp1.Date);
        })
        
       
        const resAva = await axios.get(`${Config.strapiHost}/api/avatar?populate=Image`);
        const avatar = resAva.data.data.attributes.Image
        
        
        return { avatar: avatar, experiences: experiences };
    } catch (error) {

        console.log("ERROR")
        return {}
    }
};

export default Timeline