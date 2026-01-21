import styles from "../styles/Stories.module.css";
import axios from 'axios';
import Image from "next/image";
import React, {useEffect} from "react";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import { Config } from "../components/config.js";
import ReactMarkdown from 'react-markdown'

// Umami tracking helper
const trackEvent = (eventName, eventData = {}) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(eventName, eventData);
    }
};

const Stories = ( props, error ) => {

    // Scroll tracking
    useEffect(() => {
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercentage > 25 && scrollPercentage <= 50) {
                    trackEvent('scroll_depth', { depth: '25%', page: 'stories' });
                } else if (scrollPercentage > 50 && scrollPercentage <= 75) {
                    trackEvent('scroll_depth', { depth: '50%', page: 'stories' });
                } else if (scrollPercentage > 75 && scrollPercentage < 100) {
                    trackEvent('scroll_depth', { depth: '75%', page: 'stories' });
                } else if (scrollPercentage >= 100) {
                    trackEvent('scroll_depth', { depth: '100%', page: 'stories' });
                }
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);
    return (
        <>
            <Header />
            <main className={styles.main}>
                {props.stories.map((story, index) =>
                    <div className={styles.storyContainer} key={index}>
                        <div className={((index % 2 == 0)?styles.storyImageLeft:styles.storyImageRight)}>
                            <Image
                                src={Config.strapiHost + story.Images.small.url}
                                alt={story.Title}
                                width={200}
                                height={200*story.Images.small.height/story.Images.small.width}
                            />
                        </div>
                        <div className={styles.storyTitle}>
                            <h2>{story.Title}</h2>
                        </div>

                        
                        <ReactMarkdown>{story.Text}</ReactMarkdown>
                    </div>
                )}
            </main>
            <Footer/>
        </>
    );
    if (error) {
        return <div>An error occured: {error.message}</div>;
    }
};

Stories.getInitialProps = async ctx => {
    try {
        console.log(`Getting STORIES at ${Config.strapiHost}`)
        const res = await axios.get(`${Config.strapiHost}/stories`);
        const stories = res.data.map(story => {
            return {
                Title: story.work.Title,
                Images: story.work.Image.formats,
                Text: story.Text
            }
        }).sort((exp1, exp2) => exp1.Order - exp2.Order );
        return { stories }
    } catch (error) {
        return { error };
    }
};

export default Stories;