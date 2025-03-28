import React from 'react';
import backgroundImg from "../../Assets/background.png";

const HeroSection = () => {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      // style={{
      //   backgroundImage:
      //     'url("https://wallpapers.com/images/hd/historical-background-4000-x-2667-pigdz3dcyjqrwfn1.jpg")',
      // }}
    >
      <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `url(${backgroundImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-5xl md:text-7xl font-bold">Data Playground</h1>
      </div>
    </section>
  );
};

export default HeroSection;