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
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden">
      <Sidebar />
      <div 
        ref={contentRef}
        className="transition-all duration-300 h-screen"
        style={{ 
          marginLeft: sidebarVisible ? '270px' : '0',
          width: sidebarVisible ? 'calc(100% - 270px)' : '100%'
        }}
      >
        <div className="flex flex-col w-full h-[90vh] max-w-[900px] mx-auto mt-[3em] px-4">
          {/* 타이틀 + 드롭다운 */}
          <div className="flex flex-row justify-between items-center">
            <p className="text-[50px] font-bold border-b-gray-800 px-4">
              My Library
            </p>
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

          {/* 카드 컨테이너 */}
          <div className="bg-white p-4 rounded-md shadow-md h-auto overflow-y-auto border-t-4 border-black mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
    </div>
  );
};

export default MyLibraryPage;
