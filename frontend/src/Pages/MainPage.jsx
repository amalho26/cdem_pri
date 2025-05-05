import React from 'react';
import MainPageSection from '../Components/newDesign/MainPageSection';
import NewsGrid from '../Components/newDesign/NewsGrid'
import Navbar from '../Components/Common/Navbar';
import Footer from '../Components/Common/Footer';

const MainPage = () => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <MainPageSection />
        <NewsGrid />
      </main>
      <Footer/>
    </div>
  );
};

export default MainPage;