/* global gtag */

import React, { useState, useEffect, useRef, forwardRef } from "react";
import axios from "axios";

/**
 * SearchBar 컴포넌트
 * - 부모 컴포넌트에서 ref를 받아, Spotlight 튜토리얼에서 이 DOM의 위치를 알 수 있도록 forwardRef 적용
 * - 키 입력 시 디바운싱된 자동완성 호출
 * - 검색 실행 시 onSearch 콜백 호출 및 search history 저장
 */
const SearchBar = forwardRef(({ onSearch }, ref) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 관리

  const searchRef = useRef(null); // “외부 클릭” 판별용
  const inputRef = useRef(null);

  // -------------------------------------------------
  // 1) 외부 클릭 감지: searchRef 영역 외부 클릭 시 자동완성 dropdown 닫기
  // -------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------------
  // 2) query 상태가 바뀔 때마다 디바운싱된 자동완성 요청
  // -------------------------------------------------
  useEffect(() => {
    if (query.length > 1) {
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // -------------------------------------------------
  // 3) 자동완성 API 호출
  // -------------------------------------------------
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `/api/autocomplete?prefix=${encodeURIComponent(query)}`
      );
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocompletion Error: ", error);
    }
  };

  // -------------------------------------------------
  // 4) 검색 실행 함수: search-history 저장 + onSearch 콜백
  // -------------------------------------------------
  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력해 주세요!");
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);

    // Google Analytics 이벤트 (gtag) 호출
    if (window.gtag) {
      gtag("event", "search", {
        search_term: searchTerm,
      });
    }

    try {
      // 1) 검색 기록 저장 요청 (비동기)
      axios
        .post("/api/search-history", { query: searchTerm })
        .catch((error) => {
          console.error("Search history save failed:", error);
        });

      // 2) 메인 검색 요청 (부모 onSearch 콜백 호출)
      await onSearch(searchTerm);
    } catch (error) {
      console.error("Search Error: ", error);
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // -------------------------------------------------
  // 5) 폼 제출 핸들러 (Enter 키 입력 시 호출)
  // -------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComposing) return; // 한글 조합 중일 때는 제출 무시
    executeSearch(query);
  };

  // -------------------------------------------------
  // 6) 자동완성 목록 클릭 시
  // -------------------------------------------------
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  // -------------------------------------------------
  // 7) 한글 조합 시작/끝 상태 관리
  // -------------------------------------------------
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  return (
    // 1) 최상위 div: 외부 클릭 판별용 searchRef
    <div className="flex justify-center" ref={searchRef}>
      {/* 2) 이 div(rounded-full 배경 영역)에만 forwardRef를 연결해서, spotlight가 이 부분만 잡게 함 */}
      <div className="relative w-[650px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="h-[50px] items-center bg-white rounded-full overflow-hidden border border-gray-300 flex justify-between mt-10" ref={ref}>
            <div className="w-full flex items-center pl-2 pr-4">
              <input
                ref={inputRef}
                className="w-full h-full bg-transparent text-black border-none outline-none placeholder-gray-400 ml-3"
                placeholder="Please enter a book name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="px-4" disabled={isLoading}>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="background-magnifier w-[40px] h-[36px] bg-contain bg-no-repeat" />
              )}
            </button>
          </div>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default SearchBar;