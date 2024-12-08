import React from 'react';

const Pagination = () => {
  return (
    <div className="fixed bottom-[50px] left-1/2 transform -translate-x-1/2 flex">
      <button className="px-3 py-1 rounded-l  mr-2">
        ←
      </button>
      <div className="px-3 py-1 bg-black text-white rounded-lg">1</div>
      <button className="px-3 py-1 rounded-r  ml-2">
        →
      </button>
    </div>
  );
};

export default Pagination;
