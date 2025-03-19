import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center px-4"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://wallpapers.com/images/hd/historical-background-4000-x-2667-pigdz3dcyjqrwfn1.jpg")',
      }}
    >
      <div className="text-center">
        <h1 className="text-white text-8xl font-black leading-tight">Data Playground</h1>
      </div>
    </section>
  );
};

export default HeroSection;
