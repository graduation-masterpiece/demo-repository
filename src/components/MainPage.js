import React, { useState, useEffect, useRef } from "react";
import { ServiceName } from "./ServiceName";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchResults from "./SearchResults";
import axios from "axios";
import { useSidebar } from "../SidebarContext";

const MainPage = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mainContentRef = useRef(null);
  const { isVisible: sidebarVisible } = useSidebar();

  // 사이드바 토글 시 레이아웃 조정
  useEffect(() => {
    if (!mainContentRef.current) return;

    requestAnimationFrame(() => {
      if (sidebarVisible) {
        mainContentRef.current.style.marginLeft = "270px";
        mainContentRef.current.style.width = "calc(100% - 270px)";
      } else {
        mainContentRef.current.style.marginLeft = "0";
        mainContentRef.current.style.width = "100%";
      }
    });
  }, [sidebarVisible]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const encodedQuery = encodeURIComponent(query);
    const url = `/api/naver-search?query=${encodedQuery}&display=30&start=1`;

    try {
      const response = await axios.get(url, {
        header: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept-Charset": "utf-8",
        },
      });
      setResults(response.data.items || []);
    } catch (error) {
      console.error("API Request Failed:", error);
      alert("Failed loading the book info.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#ECE6CC] overflow-hidden">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main
        ref={mainContentRef}
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: sidebarVisible ? "270px" : "0",
          width: sidebarVisible ? "calc(100% - 270px)" : "100%",
          height: "100vh",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-full max-w-[800px] px-4 flex flex-col">
            {/* 헤더 (ServiceName + SearchBar) */}
            <div
              className={`transition-all duration-700 ease-in-out ${
                results.length > 0
                  ? "mb-6"
                  : "flex-1 flex flex-col justify-center"
              }`}
            >
              <div className="text-center mb-8 transition-all duration-500">
                <ServiceName />
              </div>

              <div className="mb-4 w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* 검색 결과 */}
            <div
              className={`w-full flex-1 transition-all duration-700 ease-in-out transform ${
                results.length > 0
                  ? "max-h-[70vh] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 translate-y-full overflow-hidden"
              }`}
            >
              <div className="bg-white shadow-lg rounded-lg p-4 h-full overflow-y-auto">
                {results.length > 0 && <SearchResults results={results} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;