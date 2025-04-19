import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 자동완성 요청 (디바운싱 적용)
  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/autocomplete?prefix=${query}`);
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("자동완성 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 실행 함수 (자동완성 저장과 검색을 한 번에 처리)
  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // 검색 기록 저장과 실제 검색을 병렬로 처리
      await Promise.all([
        axios.post('http://localhost:5001/api/search-history', { query: searchTerm }),
        onSearch(searchTerm) // 부모 컴포넌트의 검색 함수 실행
      ]);
    } catch (error) {
      console.error("검색 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => executeSearch(query);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(query);
    }
  };

  return (
    <div className="flex justify-center" ref={searchRef}>
      <div className="relative w-[650px]">
        <div className="h-[50px] items-center bg-[#fff] rounded-full overflow-hidden border border-gray-300 flex justify-between mt-10">
          {/* 입력 필드 */}
          <div className="w-full flex items-center pl-2 pr-4">
            <input
              className="w-full h-full bg-transparent text-black border-none outline-none placeholder-gray-400 ml-3"
              placeholder="Please enter a book name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 검색 버튼 */}
          <button 
            type="button" 
            onClick={handleSearchClick}
            className="px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="background-magnifier w-[40px] h-[36px] bg-contain bg-no-repeat" />
            )}
          </button>
        </div>

        {/* 자동완성 드롭다운 */}
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
};

export default SearchBar;