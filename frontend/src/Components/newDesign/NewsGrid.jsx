import React from 'react';
import NewsCard from './NewsCard';

const NewsGrid = () => {
  const news = [
    {
        image: 'https://atlas-content-cdn.pixelsquid.com/stock-images/bar-graph-y1KAkP1-600.jpg',
        name: 'Create Custom Graph',
        link: '/create',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/World_blank_map_countries.PNG/1200px-World_blank_map_countries.PNG',
      name: 'View Interactive Map',
      link: '/map',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Social_Network_Analysis_Visualization.png/1024px-Social_Network_Analysis_Visualization.png',
      name: 'Export Data',
      link: '/export',
    },
    {
      image: 'https://i.pinimg.com/474x/98/a8/04/98a80432aba635248f3c7386410108e2.jpg',
      name: 'Statistical Summary',
      link: '/stats',
    },
  ];

  return (
    <section className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {news.map((item, index) => (
          <NewsCard
            key={index}
            image={item.image}
            name={item.name}
            link={item.link}
            onClick={item.function}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
