import React from "react";
import MyLibraryCard from "./MyLibraryCard";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";

const data = [
  { id: 1, title: "winnie the pooh", likes: 14, image: "/images/pic1.png" },
  { id: 2, title: "sponge bob", likes: 10, image: "/images/pic2.png" },
  { id: 3, title: "one piece", likes: 7, image: "/images/pic3.png" },
  { id: 4, title: "불편한 편의점", likes: 9, image: "/images/card_book.png" },
];

const MyLibraryPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[1200px] h-[770px] mx-[18em] mt-[4.5em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
         My Library
        </p>
        <div className="border-[1px] border-black mx-4 mt-7 h-[670px] border-gray-500 border-[4px] rounded-xl bg-white">
        <div className="grid grid-cols-3 gap-4 p-4">
          {data.map((item) => (
            <MyLibraryCard key={item.id} {...item} />
          ))}
        </div>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default MyLibraryPage;
