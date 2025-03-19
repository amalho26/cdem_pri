import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div className="space-y-2">
          <p className="text-sm">&copy; 2024 Consortium on Electoral Democracy</p>
          <a href="mailto:admin@c-dem.ca" className="text-gray-400 hover:text-white">admin@c-dem.ca</a>
        </div>
        <div>
          <p className="text-sm">Follow us:</p>
          <div className="space-x-4">
            <a href="https://x.com" className="text-gray-400 hover:text-white">X</a>
            {/* Add more social links as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
