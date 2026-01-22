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

    // Filter works met images voor consistentie
    const filteredWorks = props.works.filter(work => work.images?.small?.url || work.images?.medium?.url || work.images?.large?.url);

    function openGallery(index) {
        const workTitle = filteredWorks[index]?.title || 'Unknown';
        const workData = {
            work_index: index, 
            work_title: workTitle,
            total_works: filteredWorks.length,
            image_name: workTitle
        };
        
        trackEvent('lightbox_open', workData);
        setGalleryIndex(index);
        setGalleryOpen(true);
        setViewStartTime(Date.now());
        
        // Preload alle lightbox afbeeldingen
        preloadGalleryImages();
        
        // Start 10-second timer tracking
        startTimerTracking(workData);
    }

    function preloadGalleryImages() {
        props.works.forEach(work => {
            if (work.images?.large?.url) {
                // Gebruik fetch voor preloading in plaats van new Image()
                fetch(Config.strapiHost + work.images.large.url, { mode: 'no-cors' })
                    .catch(() => {}); // Ignore errors
            }
            if (work.images?.medium?.url) {
                fetch(Config.strapiHost + work.images.medium.url, { mode: 'no-cors' })
                    .catch(() => {}); // Ignore errors
            }
        });
    }

    function closeGallery() {
        const workTitle = filteredWorks[galleryIndex]?.title || 'Unknown';
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

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>

                {filteredWorks.map((work, index) =>
                    <div key={index} className={styles.workContainer} >
                    <a href="#" onClick={(e) => { e.preventDefault(); openGallery(index); }}>
                        <Image
                            className={styles.workImage}
                            src={work.images?.small?.url ? Config.strapiHost + work.images.small.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : Config.strapiHost + work.images.large.url}
                            alt={work.title || 'Artwork'}
                            placeholder="blur"
                            blurDataURL={work.images?.thumbnail?.url ? Config.strapiHost + work.images.thumbnail.url : '/placeholder-blur.jpg'}
                            width={work.images?.small?.width || work.images?.medium?.width || work.images?.large?.width || 500}
                            height={work.images?.small?.height || work.images?.medium?.height || work.images?.large?.height || 500}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: 'auto'
                            }}
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
                {galleryOpen && filteredWorks && filteredWorks.length > 0 && (
                    <ImageGallery
                        items={filteredWorks.map(work => ({
                            original: work.images?.large?.url ? Config.strapiHost + work.images.large.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : work.images?.small?.url ? Config.strapiHost + work.images.small.url : '/placeholder-large.jpg',
                            thumbnail: work.images?.thumbnail?.url ? Config.strapiHost + work.images.thumbnail.url : work.images?.small?.url ? Config.strapiHost + work.images.small.url : work.images?.medium?.url ? Config.strapiHost + work.images.medium.url : '/placeholder-thumb.jpg',
                            title: work.title || 'Untitled',
                            description: "" // Leeg om dubbele caption te voorkomen
                        }))}
                        startIndex={galleryIndex}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        showIndex={false}
                        showThumbnails={false}
                        showNav={true}
                        showBullets={false}
                        preloadNextImage={true}
                        preloadPrevImage={true}
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
                            <>
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
                                {/* Custom caption buiten de afbeelding */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'rgba(0, 0, 0, 0.9)',
                                        color: '#ccff00',
                                        padding: '20px 30px',
                                        borderRadius: '12px',
                                        width: '500px', // Vaste breedte
                                        minWidth: '500px', // Minimum breedte
                                        maxWidth: '500px', // Maximum breedte
                                        textAlign: 'center',
                                        zIndex: 9999,
                                        fontSize: '16px',
                                        lineHeight: '1.6',
                                        border: '1px solid rgba(204, 255, 0, 0.3)'
                                    }}
                                >
                                    <h3 style={{ 
                                        margin: '0 0 10px 0', 
                                        fontSize: '20px', 
                                        fontWeight: 'bold',
                                        color: '#ffffff'
                                    }}>
                                        {filteredWorks[galleryIndex]?.title || 'Untitled'}
                                    </h3>
                                    <p style={{ 
                                        margin: '0 0 5px 0',
                                        fontSize: '14px',
                                        opacity: '0.9'
                                    }}>
                                        Material: {filteredWorks[galleryIndex]?.material || 'Unknown'} | 
                                        Size: {filteredWorks[galleryIndex]?.sizes || 'Unknown'}
                                    </p>
                                    <p style={{ 
                                        margin: '0',
                                        fontSize: '14px',
                                        opacity: '0.9'
                                    }}>
                                        Price: {filteredWorks[galleryIndex]?.price || 'Unknown'} | 
                                        Status: <span style={{ 
                                            color: filteredWorks[galleryIndex]?.status === 'Sold' ? '#ff6b6b' : '#51cf66',
                                            fontWeight: 'bold'
                                        }}>
                                            {filteredWorks[galleryIndex]?.status || 'Unknown'}
                                        </span>
                                    </p>
                                </div>
                            </>
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
        const res = await axios.get(`${Config.strapiHost}/api/works?populate=Image&pagination[pageSize]=100`);
        
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

        return { works };
    } catch (error) {
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