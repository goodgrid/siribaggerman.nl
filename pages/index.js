import styles from "../styles/Home.module.css";
import axios from 'axios';
import Image from "next/image";
import React, {useState, useEffect} from "react";
import ImageGallery from "react-image-gallery";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import { Config } from "../components/config.js";
import Story from "../components/story.js";
import Link from "next/link";

// Umami tracking helper
const trackEvent = (eventName, eventData = {}) => {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(eventName, eventData);
    }
};

const Home = ( props, error ) => {

    if (error) {
        return <div>An error occured: {error.message}</div>;
    }

    if (!props.works) {
        return <div>Loading...</div>;
    }

    // ImageGallery state
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [viewStartTime, setViewStartTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);

    function openGallery(number) {
        console.log("Opening gallery at index:", number - 1);
        const workTitle = props.works[number - 1]?.title || 'Unknown';
        const workData = {
            work_index: number - 1, 
            work_title: workTitle,
            total_works: props.works.length,
            image_name: workTitle
        };
        
        trackEvent('lightbox_open', workData);
        setGalleryIndex(number - 1);
        setGalleryOpen(true);
        setViewStartTime(Date.now());
        
        // Start 10-second timer tracking
        startTimerTracking(workData);
    }

    function closeGallery() {
        console.log("Closing gallery");
        const workTitle = props.works[galleryIndex]?.title || 'Unknown';
        const workData = {
            current_index: galleryIndex,
            work_title: workTitle,
            image_name: workTitle,
            time_open: Date.now() - viewStartTime
        };
        
        trackEvent('lightbox_close', workData);
        setGalleryOpen(false);
        setGalleryIndex(0);
        setViewStartTime(null);
        
        // Stop timer tracking
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }

    function startTimerTracking(workData) {
        let secondsViewed = 0;
        const interval = setInterval(() => {
            secondsViewed += 10;
            trackEvent('lightbox_view_duration', {
                ...workData,
                seconds_viewed: secondsViewed,
                duration_formatted: `${secondsViewed}s`
            });
        }, 10000);
        
        setTimerInterval(interval);
    }

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
                    trackEvent('scroll_depth', { depth: '25%', page: 'home' });
                } else if (scrollPercentage > 50 && scrollPercentage <= 75) {
                    trackEvent('scroll_depth', { depth: '50%', page: 'home' });
                } else if (scrollPercentage > 75 && scrollPercentage < 100) {
                    trackEvent('scroll_depth', { depth: '75%', page: 'home' });
                } else if (scrollPercentage >= 100) {
                    trackEvent('scroll_depth', { depth: '100%', page: 'home' });
                }
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // Reset gallery on page load
    useEffect(() => {
        if (galleryOpen) {
            closeGallery();
        }
    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>

                <div>

                {props.works.filter(work => work.images?.small?.url || work.images?.medium?.url || work.images?.large?.url).map((work, index) =>
                    <div key={index} className={styles.workContainer} >
                    <a href="#" onClick={(e) => { e.preventDefault(); openGallery(index + 1); }}>
                        <Image
                            className={styles.workImage}
                            src={work.images?.small?.url ? Config.strapiHost + work.images.small.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : Config.strapiHost + work.images.large.url}
                            alt={work.title || 'Artwork'}
                            placeholder="blur"
                            blurDataURL={work.images?.thumbnail?.url ? Config.strapiHost + work.images.thumbnail.url : '/placeholder-blur.jpg'}
                            width="500"
                            height={work.images?.small?.height ? 500*work.images.small.height/work.images.small.width : work.images?.medium?.height ? 500*work.images.medium.height/work.images.medium.width : 500*work.images.large.height/work.images.large.width}
                        />
                        {(() => {
                            if (work.status == "Sold") {
                                return <div className={styles.workSoldIndicator} >sold</div>
                            }
                        })()}
                        
                    </a>
                    </div>
                )}
                {/* Conditionele ImageGallery */}
                {galleryOpen && props.works && props.works.length > 0 && (
                    <ImageGallery
                        items={props.works.filter(work => work.images?.large?.url).map(work => ({
                            original: work.images?.large?.url ? Config.strapiHost + work.images.large.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : work.images?.small?.url ? Config.strapiHost + work.images.small.url : '/placeholder-large.jpg',
                            thumbnail: work.images?.thumbnail?.url ? Config.strapiHost + work.images.thumbnail.url : work.images?.small?.url ? Config.strapiHost + work.images.small.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : '/placeholder-thumb.jpg',
                            title: work.title || 'Untitled',
                            description: `Material: ${work.material || 'Unknown'} | Size: ${work.sizes || 'Unknown'} | Price: ${work.price || 'Unknown'} | Status: ${work.status || 'Unknown'}`
                        }))}
                        startIndex={galleryIndex}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        showIndex={false}
                        showThumbnails={false}
                        showNav={true}
                        isOpen={galleryOpen}
                        onClose={closeGallery}
                        onSlide={index => {
                            setGalleryIndex(index);
                            const workTitle = props.works[index]?.title || 'Unknown';
                            const workData = {
                                new_index: index, 
                                work_title: workTitle,
                                image_name: workTitle,
                                direction: index > galleryIndex ? 'next' : 'previous'
                            };
                            
                            trackEvent('lightbox_navigate', workData);
                            
                            // Reset timer for new image
                            if (timerInterval) {
                                clearInterval(timerInterval);
                            }
                            startTimerTracking(workData);
                        }}
                        renderCustomControls={() => (
                            <button 
                                onClick={closeGallery}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    color: '#ccff00',
                                    border: '2px solid #ccff00',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    zIndex: 10000,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        )}
                    />
                )}
                </div>
            </main>
            <span className={styles.indextext}>
                Siri studeerde in 2005 af aan de Hogeschool voor de Kunsten in Utrecht. De jaren daarna woonde en werkte ze in Helsinki, Berlijn en Utrecht. Vanaf 2009 richtte ze zich op het medium film en performance. Sinds 2020 richt ze zich weer op haar oorspronkelijke discipline, schilderen.
            </span>
            <Footer/>
        </>
    );
};

Home.getInitialProps = async ctx => {
    try {
        
        console.log(`Getting WORKS at ${Config.strapiHost}`)
        const res = await axios.get(`${Config.strapiHost}/api/works?populate=Image&pagination[pageSize]=100`);
        
        // Debug: log de data structuur
        console.log("Strapi response:", JSON.stringify(res.data.data[0], null, 2));

        const works = res.data.data.map(work => {
            return {
                title: work.attributes.Title,
                images: work.attributes.Image?.data?.attributes?.formats || {},
                status: work.attributes.Status,
                sizes: work.attributes.Sizes,
                material: work.attributes.Material,
                price: work.attributes.Price
            }
        }).reverse()
        
        // Debug: log de mapped data
        console.log("Mapped works:", JSON.stringify(works[0], null, 2));

        return { works };
    } catch (error) {
        console.log("ERROR", error.message)
        // Fallback mock data wanneer Strapi niet draait
        const mockWorks = [
            {
                title: "Test Artwork 1",
                images: {
                    small: { url: "/mock/small1.jpg", height: 300, width: 400 },
                    large: { url: "/mock/large1.jpg", height: 600, width: 800 },
                    thumbnail: { url: "/mock/thumb1.jpg", height: 100, width: 100 }
                },
                status: "Available",
                sizes: "50x70 cm",
                material: "Oil on canvas",
                price: "€750"
            },
            {
                title: "Test Artwork 2", 
                images: {
                    small: { url: "/mock/small2.jpg", height: 300, width: 400 },
                    large: { url: "/mock/large2.jpg", height: 600, width: 800 },
                    thumbnail: { url: "/mock/thumb2.jpg", height: 100, width: 100 }
                },
                status: "Sold",
                sizes: "40x50 cm", 
                material: "Acrylic on canvas",
                price: "€550"
            },
            {
                title: "Test Artwork 3",
                images: {
                    small: { url: "/mock/small3.jpg", height: 300, width: 400 },
                    large: { url: "/mock/large3.jpg", height: 600, width: 800 },
                    thumbnail: { url: "/mock/thumb3.jpg", height: 100, width: 100 }
                },
                status: "Available",
                sizes: "60x80 cm",
                material: "Mixed media", 
                price: "€950"
            }
        ];
        
        return { works: mockWorks };
    }
};

export default Home;