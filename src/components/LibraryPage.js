import React from "react";
import Card from "./Card";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";

const data = [
  { id: 1, title: "winnie the pooh", likes: 14, image: "/images/pic1.png" },
  { id: 2, title: "sponge bob", likes: 10, image: "/images/pic2.png" },
  { id: 3, title: "one piece", likes: 7, image: "/images/pic3.png" },
  { id: 4, title: "sponge bob", likes: 10, image: "/images/pic1.png" },
];

const LibraryPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col p-20">
        <p className="text-[50px] font-bold border-b-black border-b-[1px] ml-80 whitespace-nowrap w-fit">
          Library
        </p>
        <div className="grid grid-cols-3 gap-10 mt-20 w-[60%] mx-auto">
          {data.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default LibraryPage;
