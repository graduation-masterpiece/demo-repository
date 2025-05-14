import React, { useState, useEffect, useRef } from "react";
import { ServiceName } from "./ServiceName";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SearchResults from "./SearchResults";
import axios from "axios";

const MainPage = () => {
  const [results, setResults] = useState([]); // 검색 결과 상태
  const [sidebarVisible, setSidebarVisible] = useState(false); // 사이드바 상태 기본값을 false로 변경 (닫힌 상태)
  const [isSearching, setIsSearching] = useState(false); // 검색 진행 상태
  const mainContentRef = useRef(null); // 메인 콘텐츠 참조
  const [showResults, setShowResults] = useState(false); // 검색 결과 표시 상태

  // 커스텀 이벤트 리스너를 사용하여 사이드바 상태 직접 연결
  useEffect(() => {
    // 사이드바 토글 이벤트를 위한 핸들러
    const handleSidebarChange = (e) => {
      setSidebarVisible(e.detail.isVisible);
    };

    // 전역 이벤트 리스너 등록
    window.addEventListener('sidebarToggled', handleSidebarChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('sidebarToggled', handleSidebarChange);
    };
  }, []);

  // 사이드바 상태가 변경될 때마다 적용되는 효과
  useEffect(() => {
    if (!mainContentRef.current) return;
    
    // 애니메이션을 위해 requestAnimationFrame 사용
    requestAnimationFrame(() => {
      if (sidebarVisible) {
        mainContentRef.current.style.marginLeft = '270px';
        mainContentRef.current.style.width = 'calc(100% - 270px)';
      } else {
        mainContentRef.current.style.marginLeft = '0';
        mainContentRef.current.style.width = '100%';
      }
    });
  }, [sidebarVisible]);

  // 검색 결과가 업데이트될 때 애니메이션 트리거
  useEffect(() => {
    if (results.length > 0) {
      // 약간의 딜레이 후 결과 표시 (애니메이션 효과 향상)
      setTimeout(() => {
        setShowResults(true);
      }, 100);
    } else {
      setShowResults(false);
    }
  }, [results]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true); // 검색 시작
    
    const encodedQuery = encodeURIComponent(query);
    const url = `/api/naver-search?query=${encodedQuery}&display=30&start=1`;

    try {
      const response = await axios.get(url, {
	      header: {
	        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	        'Accept-Charset': 'utf-8'
	      }
      });
      setResults(response.data.items || []); // 검색 결과 상태 업데이트
    } catch (error) {
      console.error("API Request Failed:", error);
      alert("Failed loading the book info.");
      setResults([]); // 오류 시 결과 초기화
    } finally {
      setIsSearching(false); // 검색 완료
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#ECE6CC]">
      {/* 사이드바 컴포넌트 */}
      <Sidebar onToggle={(isVisible) => {
        // 커스텀 이벤트 발생
        const event = new CustomEvent('sidebarToggled', {
          detail: { isVisible }
        });
        window.dispatchEvent(event);
      }} />

      {/* 메인 컨텐츠 - 사이드바 상태에 따라 조정 */}
      <main 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ 
          marginLeft: sidebarVisible ? '270px' : '0',
          width: sidebarVisible ? 'calc(100% - 270px)' : '100%',
          height: '100vh' // 전체 높이 설정
        }}
      >
        {/* 전체 컨텐츠 래퍼 */}
        <div className="flex flex-col items-center justify-center h-full">
          {/* 메인 컨텐츠 컨테이너 */}
          <div className="w-full max-w-[800px] px-4 flex flex-col">
            
            {/* 헤더 영역 (제목 + 검색창) - 결과에 따라 위치 이동 */}
            <div className={`transition-all duration-700 ease-in-out ${
              showResults ? 'mb-6 translate-y-[-20vh]' : 'flex-1 flex flex-col justify-center'
            }`}>
              {/* 제목 부분 - ServiceName 컴포넌트 사용 */}
              <div className={`mb-8 transition-all duration-500 ${
                showResults ? 'transform scale-75 -mt-4' : ''
              }`}>
                <ServiceName />
              </div>

              {/* 검색 바 */}
              <div className="mb-4 w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* 검색 결과 박스 - 결과 있을 때만 표시 (애니메이션으로 아래에서 위로 밀어올림) */}
            <div className={`w-full flex-1 transition-all duration-700 ease-in-out transform ${
              showResults 
                ? 'max-h-[70vh] opacity-100 translate-y-0' 
                : 'max-h-0 opacity-0 translate-y-[50vh] pointer-events-none overflow-hidden'
            }`}>
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
