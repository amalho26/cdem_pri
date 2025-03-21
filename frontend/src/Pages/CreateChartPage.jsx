import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import ChartForm from '../Components/createChart/ChartForm';


const CreateChartPage = () => {

  

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Use the custom Header */}
      <Navbar />

      <main className="flex flex-col items-center py-5 px-10">
        <div className="max-w-[960px] w-full">
          {/* Chart Creation Form */}
          <ChartForm />

        
        </div>
      </main>
    </div>
  );
};

export default CreateChartPage;
