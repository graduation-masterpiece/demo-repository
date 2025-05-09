import React, { useEffect, useState } from "react";
import MyLibraryCard from "./MyLibraryCard";
import Sidebar from "./Sidebar";
import axios from "axios";

const FILTER_OPTIONS = [
  { value: "default", label: "기본순" },
  { value: "latest", label: "생성순" },
  { value: "likes", label: "좋아요순" },
];

const itemsPerPage = 12;

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("default");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // page, itemsPerPage, sort 모두 params로 전달
        const response = await axios.get('/api/my-library', {
          params: {
            page,
            itemsPerPage,
            sort,
          },
        });
        setBooks(response.data.books);
        setTotal(response.data.total);
      } catch (error) {
        console.error('책 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchBooks();
  }, [page, sort]);

  // 전체 페이지 수는 서버에서 받은 total로 계산
  const totalPages = Math.ceil(total / itemsPerPage);

  // 페이지 이동 함수
  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // 필터링 변경 시 페이지 0으로
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-full max-w-5xl h-[90vh] mx-auto mt-[3em] px-2 sm:px-4">
        {/* 타이틀 + 드롭다운 */}
        <div className="flex flex-row justify-between items-center">
          <p className="text-[7vw] sm:text-[50px] font-bold border-b-gray-800 px-4">
            My Library
          </p>
          <div className="mt-2">
            <select
              className="text-lg border border-gray-400 rounded px-3 py-1 bg-white"
              value={sort}
              onChange={handleSortChange}
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 카드 컨테이너 외부 상단에 검정색 선 */}
        <div className="w-full border-t-4 border-black rounded-t-md mt-2">
          <div className="bg-white p-4 rounded-b-md shadow-md h-auto overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {books.map((book) => (
                <MyLibraryCard 
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  likes={book.likes}
                  image={book.image_url}
                />
              ))}
            </div>
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
              Prev
            </button>
            <span className="text-lg">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
