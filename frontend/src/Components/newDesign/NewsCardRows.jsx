import React from 'react';
import NewsCard from './NewsCard';

const newsItems = [{}];

const NewsCardsRow = () => {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
      <div className="flex justify-between gap-4">
        {newsItems.map((item) => (
          <NewsCard key={item.id} name={item.name} link={item.link} />
        ))}
      </div>
    </div>
  );
};

export default NewsCardsRow;
