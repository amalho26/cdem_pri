import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-black">
            <img src={require('../../Assets/Images/cdem_logo.jpg')} alt="C-DEM Logo" className="w-30 h-10"/>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="https://c-dem.ca/news/">
            <span className="text-gray-700 hover:text-black">News</span>
          </a>
          <a href="https://c-dem.ca/activities/">
            <span className="text-gray-700 hover:text-black">Our Project</span>
          </a>
          <a href="https://c-dem.ca/people-2/">
            <span className="text-gray-700 hover:text-black">Who We Are</span>
          </a>
          <a href="https://c-dem.ca/opportunities/">
            <span className="text-gray-700 hover:text-black">Opportunities</span>
          </a>
          <a href="https://c-dem.ca/research-publications/">
            <span className="text-gray-700 hover:text-black">Research</span>
          </a>
          <a href="https://c-dem.ca/contact-us-2/">
            <span className="text-gray-700 hover:text-black">Contact Us</span>
          </a>
          <Link to="/viewdata" className="text-gray-700 hover:text-black">View Data</Link>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-700 hover:text-black">Français</button>
          <input type="text" placeholder="Search" className="border p-2 rounded-md" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
