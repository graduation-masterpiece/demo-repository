import React, { useEffect, useState } from "react";
import MyLibraryCard from "./MyLibraryCard";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import axios from "axios";

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);

  // 페이지당 카드뉴스 12개(3X4)
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://15.164.227.43/api/my-library');
        setBooks(response.data);
      } catch (error) {
        console.error('책 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchBooks();
  }, []);



  // 전체 페이지 수
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // 12개 이하면 전체 배열, 아니면 현재 페이지의 카드들만 선택
  const currentBooks = books.length > itemsPerPage ? books.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage) : books;

  // 페이지 이동 함수
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };


  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[64vw] h-[90vh] mx-[18em] mt-[3em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
         My Library
        </p>

        {/* 카드 컨테이너 */}
        <div className="bg-white p-4 rounded-md shadow-md h-auto overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {currentBooks.map((book) => (
              <MyLibraryCard 
                id={book.id}
                title={book.title}
                likes={book.likes}
                image={book.image_url}
              />
            ))}
          </div>
        </div>

        {/* 페이지네이션 버튼 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-lg">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
