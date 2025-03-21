import React from 'react';
import { useState, useEffect } from 'react';
import HeroSection from '../Components/newDesign/HeroSection';
import NewsGrid from '../Components/newDesign/NewsGrid'
import Navbar from '../Components/Navbar';
import axios from 'axios';
import Footer from '../Components/Footer';

const MainPage = () => {

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    axios
    .get('http://localhost:5001/api/all_data', {
      headers: {
        "db": "2021_democracy_checkup", // Set the database name dynamically
      },
    })
      .then((response) => {
        setItems(response.data); // Set the data in state
        console.log(response.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      });
  }, []); // Empty dependency array to run this only once on component mount
  return (
    <div className="min-h-screen flex flex-col bg-white">
        {console.log(items)}
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