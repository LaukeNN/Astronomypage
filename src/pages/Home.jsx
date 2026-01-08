
import React from 'react';
import Hero from '../components/Hero';
import News from '../components/News';
import Events from '../components/Events';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <News />
            <Events />
            <Gallery />
            <Contact />
        </>
    );
};

export default Home;
