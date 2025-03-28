import React from 'react';
import { useState, useEffect } from 'react';
import HeroSection from '../Components/newDesign/HeroSection';
import NewsGrid from '../Components/newDesign/NewsGrid'
import Navbar from '../Components/Navbar';
import axios from 'axios';
import Footer from '../Components/Footer';

const MainPage = () => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <NewsGrid />
      </main>
      <Footer/>
    </div>
  );
};

export default MainPage;