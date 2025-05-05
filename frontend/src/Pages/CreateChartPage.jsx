import React from 'react';
import Navbar from '../Components//Common/Navbar';
import ChartForm from '../Components/createChart/ChartForm';

const CreateChartPage = () => {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-[url('/src/Assets/Images/background.png')] bg-cover bg-center opacity-40"/>
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center py-5 px-10">
          <div className="max-w-[960px] w-full bg-white/90 p-4 rounded-md shadow-lg">
            <ChartForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateChartPage;