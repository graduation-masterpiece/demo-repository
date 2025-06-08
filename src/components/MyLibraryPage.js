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
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState(""); // 검색 상태 추가
  const [total, setTotal] = useState(0);
  const { isVisible: sidebarVisible, toggleSidebar } = useSidebar();
  const contentRef = useRef(null);

  // 사이드바 상태 변경 효과 (기존 동일)
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

  // 책 데이터 가져오기 (검색 파라미터 추가)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/my-library', {
          params: {
            page,
            itemsPerPage,
            sort,
            search, // 검색 파라미터 추가
          },
        });
        setBooks(response.data.books);
        setTotal(response.data.total);
      } catch (error) {
        console.error('An error has occurred during loading the book data: ', error);
      }
    };
    fetchBooks();
  }, [page, sort, search]); // 검색 의존성 추가

  // 페이지네이션 함수 (기존 동일)
  const totalPages = Math.ceil(total / itemsPerPage);
  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);

  // 정렬 변경 핸들러 (기존 동일)
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  // 검색 핸들러 추가
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // 검색 시 페이지 초기화
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden font-['Montserrat']">
      <Sidebar />

      {/* ─── 사이드바 토글 버튼 (기존 동일) ─── */}
      <div className="absolute top-4 left-4 z-50">
        {sidebarVisible ? (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#444444] hover:bg-[#555555] transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-12 h-12 flex items-center justify-center bg-transparent text-[#333333] hover:scale-110 transition-transform duration-200"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
        )}
      </div>

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
          {/* ─── 타이틀 + 검색 + 드롭다운 ─── */}
          <div className="flex flex-row justify-between items-start w-full mb-6">
            <h1 className="text-[48px] font-normal text-[#1B1B1B] text-left mb-10 relative">
              My Library
              <div className="w-[400px] h-[2px] bg-[#1B1B1B] absolute bottom-[-10px] left-0"></div>
            </h1>
            
            {/* 검색창 + 필터 컨테이너 */}
            <div className="flex items-center gap-4 mt-4">
              {/* 검색 입력 필드 */}
              <input
                type="text"
                placeholder="Search by title/author"
                value={search}
                onChange={handleSearchChange}
                className="text-lg border border-gray-400 rounded px-3 py-1 bg-white w-48 transition-all focus:w-64 focus:outline-none focus:border-gray-500"
              />
              
              {/* 기존 드롭다운 */}
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

          {/* ─── 카드 뷰어 (기존 동일) ─── */}
          <div className="flex-1 flex items-center justify-center w-full">
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

          {/* ─── 페이지네이션 (기존 동일) ─── */}
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
