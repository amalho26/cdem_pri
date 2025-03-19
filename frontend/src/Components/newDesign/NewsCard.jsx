import React from "react";

const NewsCard = ({ image, name, link }) => {
  return (
    <div className="max-w-sm mx-auto">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white shadow-lg rounded-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300"
      >
        {/* Image Section */}
        <div className="h-48 bg-gray-200">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
