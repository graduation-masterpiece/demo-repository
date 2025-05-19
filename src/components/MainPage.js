import React, { useState, useEffect, useRef } from "react";
import { ServiceName } from "./ServiceName";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchResults from "./SearchResults";
import axios from "axios";
import { useSidebar } from "../SidebarContext";
import useUTMLogger from "./UTMLogger";

const MainPage = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mainContentRef = useRef(null);
  const { isVisible: sidebarVisible } = useSidebar();

  useUTMLogger();

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

  // search-history는 SearchBar에서 처리되므로 여기서는 naver-search만!
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
        headers: {
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
      <Sidebar />

      <main
        ref={mainContentRef}
        className="flex-1 overflow-hidden transition-all duration-300"
        style={{
          marginLeft: sidebarVisible ? "270px" : "0",
          width: sidebarVisible ? "calc(100% - 270px)" : "100%",
        }}
      >
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-[1000px] px-4 flex flex-col h-full relative">
            {/* 제목 + 검색창 */}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out flex flex-col items-center w-full z-20 ${
                results.length > 0
                  ? "top-[1vh]"
                  : "top-[40%] -translate-y-1/2"
              }`}
            >
              <div
                className={`transition-all duration-700 ease-in-out ${
                  results.length > 0 ? "scale-[0.65]" : "scale-100"
                }`}
              >
                <ServiceName />
              </div>

              {/* 검색창은 항상 크기 유지, 바로 아래에 위치 */}
              <div className="mt-0 w-full max-w-lg">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* 검색 결과창 */}
            <div
              className={`flex-1 pt-[30vh] transition-all duration-700 ease-in-out transform ${
                results.length > 0
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-[50vh] pointer-events-none"
              } overflow-hidden mb-10 z-10`}
            >
              <div
                className="bg-white shadow-lg rounded-lg p-4 h-full overflow-y-auto"
                style={{
                  paddingBottom: "2rem",
                }}
              >
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
