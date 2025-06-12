// src/components/MainPage.js

import React, { useState, useEffect, useRef } from "react";
import { ServiceName } from "./ServiceName";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchResults from "./SearchResults";
import { useSidebar } from "../SidebarContext";
import axios from "axios";
import TutorialSpotlight from "./TutorialSpotlight";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MainPage = () => {
  const [results, setResults] = useState([]);
  const [, setIsSearching] = useState(false);

  // localStorage에 'tutorialSeen' 플래그를 저장/불러오는 커스텀 훅
  const [tutorialSeen, setTutorialSeen] = useLocalStorage("tutorialSeen", false);
  const showTutorial = !tutorialSeen;

  // 사이드바 상태와 토글 함수
  const { isVisible: sidebarVisible, toggleSidebar } = useSidebar();
  const mainContentRef = useRef(null);

  // Spotlight가 강조할 DOM ref들
  const searchBarWrapperRef = useRef(null);
  const toggleButtonRef     = useRef(null);
  const sidebarWrapperRef   = useRef(null);
  const shortBooksItemRef   = useRef(null);
  const libraryItemRef      = useRef(null);
  const settingsItemRef     = useRef(null);

  // ────────────────────────────────────────────────────────────────────
  // 사이드바가 열리거나 닫힐 때 메인 콘텐츠 레이아웃 조정
  useEffect(() => {
    if (!mainContentRef.current) return;
    requestAnimationFrame(() => {
      if (sidebarVisible) {
        mainContentRef.current.style.marginLeft = "15rem";
        mainContentRef.current.style.width      = "calc(100% - 15rem)";
      } else {
        mainContentRef.current.style.marginLeft = "0";
        mainContentRef.current.style.width      = "100%";
      }
    });
  }, [sidebarVisible]);

  // ────────────────────────────────────────────────────────────────────
  // 검색 처리 함수 (기존 로직 그대로)
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
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      });
      setResults(response.data.items || []);
    } catch (error) {
      console.error("API Request Failed:", error);
      alert("책 정보를 불러오지 못했습니다.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const [generationData, setGenerationData] = useState({ day: 0, week: 0, month: 0 });

  useEffect(() => {
    const fetchGenerationData = async () => {
      try {
        const res = await axios.get("/api/generated");
        
        setGenerationData(res.data.result || { day: 0, week: 0, month: 0 });
        console.log("Generation data fetch result: ", res.data.result);
      } catch (err) {
        console.error("Generation data fetch failed: ", err);
      }
    };

    fetchGenerationData();
  }, []);

  return (
    <div className="flex w-screen h-screen bg-[#ECE6CC] relative">
      {/* ────────────────────────────────────────────────────────────────────
          1) 튜토리얼 Spotlight
         ──────────────────────────────────────────────────────────────────── */}
      {showTutorial && (
        <TutorialSpotlight
          onFinish={() => {
            // 튜토리얼 완료 시 사이드바가 열려 있으면 닫고, localStorage에 표시
            if (sidebarVisible) toggleSidebar();
            setTutorialSeen(true);
          }}
          toggleSidebar={toggleSidebar}
          sidebarWrapperRef={sidebarWrapperRef}
          searchBarWrapperRef={searchBarWrapperRef}
          toggleButtonRef={toggleButtonRef}
          shortBooksItemRef={shortBooksItemRef}
          libraryItemRef={libraryItemRef}
          settingsItemRef={settingsItemRef}
        />
      )}

      {/* ────────────────────────────────────────────────────────────────────
          2) 사이드바 토글 버튼 (화면 좌측 상단)
         ──────────────────────────────────────────────────────────────────── */}
      <div ref={toggleButtonRef} className="absolute top-4 left-4 z-50">
        {sidebarVisible ? (
          <button
            onClick={() => toggleSidebar()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#444444] hover:bg-[#555555] transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => toggleSidebar()}
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

      {/* ────────────────────────────────────────────────────────────────────
          3) 튜토리얼 다시보기 버튼 (화면 우측 상단)
         ──────────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => {
          // 사이드바가 열려 있으면 닫은 뒤에, 튜토리얼을 다시 표시
          if (sidebarVisible) toggleSidebar();
          setTutorialSeen(false);
        }}
        className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-200 transition-colors"
        aria-label="Replay Tutorial"
      >
        {/* 물음표 아이콘 (크기를 좀 더 크게 조정) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.82 1c0 1.5-2 2.25-2 3.5" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* ────────────────────────────────────────────────────────────────────
          4) 사이드바 전체 래퍼
         ──────────────────────────────────────────────────────────────────── */}
      <div ref={sidebarWrapperRef} className="absolute top-0 left-0">
        <Sidebar
          isVisible={sidebarVisible}
          shortBooksItemRef={shortBooksItemRef}
          libraryItemRef={libraryItemRef}
          settingsItemRef={settingsItemRef}
        />
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          5) 메인 콘텐츠 영역: 검색창 + 결과
         ──────────────────────────────────────────────────────────────────── */}
      <main
        ref={mainContentRef}
        className="flex-1 overflow-auto transition-all duration-300"
        style={{
          marginLeft: sidebarVisible ? "15rem" : "0",
          width: sidebarVisible ? "calc(100% - 15rem)" : "100%",
        }}
      >
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-[1000px] px-4 flex flex-col h-full relative">
            {/* 서비스 이름 + 검색창 */}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out flex flex-col items-center w-full z-20 ${
                results.length > 0
                  ? "top-[1vh] scale-[0.65]"
                  : "top-[40%] -translate-y-1/2 scale-100"
              }`}
            >
              <ServiceName />
              <SearchBar ref={searchBarWrapperRef} onSearch={handleSearch} />
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
                style={{ paddingBottom: "2rem" }}
              >
                {results.length > 0 && <SearchResults results={results} /> ?
                () : (
                  <div className="text-center text-gray-500 mt-4">
                    <p className="mt-1 text-sm">
                      Generation Last day: {generationData.day ?? 0} / Generation Last week: {generationData.week ?? 0} / Generation Last month: {generationData.month ?? 0}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
