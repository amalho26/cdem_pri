import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import ChartForm from '../Components/createChart/ChartForm';


const CreateChartPage = () => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get('http://localhost:5001/api/all_data') // Replace with your API endpoint
      .then((response) => {
        setItems(response.data); // Set the data in state
        console.log("/////////////////////////////////")
        console.log(response.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, []); // Empty dependency array to run this only once on component mount

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Use the custom Header */}
      <Navbar />

      <main className="flex flex-col items-center py-5 px-10">
        <div className="max-w-[960px] w-full">
          {/* Chart Creation Form */}
          <ChartForm data={items}/>

        
        </div>
      </main>
    </div>
  );
};

export default CreateChartPage;
