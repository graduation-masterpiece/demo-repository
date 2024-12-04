import React from 'react';

const Pagination = () => {
  return (
    <div className="fixed bottom-[50px] left-1/2 transform -translate-x-1/2 flex">
      <button className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400">
        ←
      </button>
      <div className="px-4 py-1 bg-gray-200">1</div>
      <button className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400">
        →
      </button>
    </div>
  );
};

export default Pagination;
