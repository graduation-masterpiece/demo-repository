import React, { useEffect, useState, useRef } from "react";
import MyLibraryCard from "./MyLibraryCard";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useSidebar } from "../SidebarContext";

const FILTER_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "latest", label: "Latest" },
  { value: "likes", label: "Likes" },
];

const itemsPerPage = 12;

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("default");
  const [total, setTotal] = useState(0);
  const { isVisible: sidebarVisible } = useSidebar(); // 전역 사이드바 상태 사용
  const contentRef = useRef(null);

  

  // 사이드바 상태가 변경될 때 콘텐츠 조정
  useEffect(() => {
    if (!contentRef.current) return;
    
    if (sidebarVisible) {
      contentRef.current.style.marginLeft = '270px';
      contentRef.current.style.width = 'calc(100% - 270px)';
    } else {
      contentRef.current.style.marginLeft = '0';
      contentRef.current.style.width = '100%';
    }
  }, [sidebarVisible]);

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
        console.error('An error has occurred during loading the book data: ', error);
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
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden font-['Montserrat']">
      <Sidebar />
      <div 
        ref={contentRef}
        className="transition-all duration-300 h-screen overflow-y-auto pb-16"
        style={{ 
          marginLeft: sidebarVisible ? '270px' : '0',
          width: sidebarVisible ? 'calc(100% - 270px)' : '100%'
        }}
      >
        <div
          className={`flex flex-col items-start min-h-full max-w-7xl mx-auto px-8 py-8 transition-all duration-300 ${
            !sidebarVisible ? "ml-auto mr-auto" : ""
          }`}
        >
          {/* 타이틀 + 드롭다운 */}
          <div className="flex flex-row justify-between items-start w-full mb-6">
            <h1 className="text-[48px] font-normal text-[#1B1B1B] text-left mb-10 relative">
              My Library
              <div className="w-[400px] h-[2px] bg-[#1B1B1B] absolute bottom-[-10px] left-0"></div>
            </h1>
            <div className="mt-4">
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

          {/* 카드 뷰어 중앙 정렬 */}
          <div className="flex-1 flex items-center justify-center w-full">
            {/* 카드 컨테이너 */}
            <div className="flex-1 mx-auto w-full max-w-full mt-4 mb-8 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
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
            <div className="max-w-7xl mx-auto px-4 mb-4">
              <div className="flex justify-end items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className="bg-gray-50 px-3 py-2 rounded disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <span className="text-xl">&lt;</span>
                </button>
                <span className="text-lg">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages - 1}
                  className="bg-gray-50 px-3 py-2 rounded disabled:opacity-50"
                  aria-label="Next page"
                >
                  <span className="text-xl">&gt;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLibraryPage;
