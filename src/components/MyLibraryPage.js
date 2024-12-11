import React, { useEffect, useState } from "react";
import MyLibraryCard from "./MyLibraryCard";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import axios from "axios";

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/my-library');
        setBooks(response.data);
      } catch (error) {
        console.error('책 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[1200px] h-[770px] mx-[18em] mt-[4.5em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
         My Library
        </p>
        <div className="border-[1px] border-black mx-4 mt-7 h-[670px] border-gray-500 border-[4px] rounded-xl bg-white">
          <div className="grid grid-cols-3 gap-4 p-4">
            {books.map((book) => (
              <MyLibraryCard 
                id={book.id}
                title={book.title}
                likes={book.likes}
                image={`http://localhost:5001/generated_images/${book.image_url.split('/').pop()}`}
              />
            ))}
          </div>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default MyLibraryPage;