import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null); // input에 포커스 주기 위한 ref

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
      const response = await axios.get(`/api/autocomplete?prefix=${query}`);
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocompletion Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 실행 함수 (자동완성 저장과 검색을 한 번에 처리)
  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      alert("Enter a keyword!");
      // 검색 실패 시에도 포커스 복구
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      await Promise.all([
        axios.post('/api/search-history', { query: searchTerm }),
        Promise.resolve(onSearch(searchTerm))
      ]);
    } catch (error) {
      console.error("Search Error: ", error);
    } finally {
      setIsLoading(false);
      // 검색이 끝나면 항상 input에 포커스
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // 폼 제출 핸들러 (엔터, 버튼 클릭 모두 이 함수로 통합)
  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  return (
    <div className="flex justify-center" ref={searchRef}>
      <div className="relative w-[650px]">
        {/* form으로 감싸고 onSubmit 사용 */}
        <form onSubmit={handleSubmit}>
          <div className="h-[50px] items-center bg-[#fff] rounded-full overflow-hidden border border-gray-300 flex justify-between mt-10">
            {/* 입력 필드 */}
            <div className="w-full flex items-center pl-2 pr-4">
              <input
                ref={inputRef}
                className="w-full h-full bg-transparent text-black border-none outline-none placeholder-gray-400 ml-3"
                placeholder="Please enter a book name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {/* 검색 버튼 */}
            <button
              type="submit"
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
        </form>

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
