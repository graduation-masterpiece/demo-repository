import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 관리
  const searchRef = useRef(null);
  const inputRef = useRef(null);

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
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`/api/autocomplete?prefix=${query}`);
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocompletion Error: ", error);
    }
  };

  // 검색 실행 함수 (search-history와 naver-search를 동시에)
  const executeSearch = async (searchTerm) => {
  if (!searchTerm.trim()) {
    alert("Enter a keyword!");
    if (inputRef.current) inputRef.current.focus();
    return;
  }

  setIsLoading(true);
  setShowSuggestions(false);

  try {
    // search-history 요청이 끝난 뒤 naver-search 요청
    await axios.post('/api/search-history', { query: searchTerm });
    await onSearch(searchTerm);
  } catch (error) {
    console.error("Search Error: ", error);
  } finally {
    setIsLoading(false);
    if (inputRef.current) inputRef.current.focus();
  }
};


  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComposing) return; // 한글 조합 중이면 무시
    executeSearch(query);
  };

  // 자동완성 클릭
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  // 한글 조합 상태 관리
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  return (
    <div className="flex justify-center" ref={searchRef}>
      <div className="relative w-[650px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="h-[50px] items-center bg-[#fff] rounded-full overflow-hidden border border-gray-300 flex justify-between mt-10">
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
