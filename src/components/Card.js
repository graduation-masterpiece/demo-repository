import React from 'react';

const Card = ({ title, likes, image }) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="rounded-lg object-cover w-full h-[150px]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-lg">
          ▶
        </div>
      </div>
      <h2 className="text-center text-lg mt-2 overflow-hidden">{title}</h2>
      <p className="text-center text-sm text-gray-600 overflow-hidden ">♡ {likes}</p>
    </div>
  );
};

export default Card;
