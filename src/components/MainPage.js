import React, { useState } from "react";
import { ServiceName } from "./ServiceName";
import SearchBar from "./SearchBar";
// import { ImageSection } from "./ImageSection";
import Sidebar from "./Sidebar";
import SearchResults from "./SearchResults";
import axios from "axios";

const MainPage = () => {
  const [results, setResults] = useState([]); // 검색 결과 상태

  const handleSearch = async (query) => {
    const clientId = "tUH85Dx01c0068T7jLDd";
    const clientSecret = "EKPw9gjRR9"
    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
      query
    )}&display=10&start=1`;

    try {
      const response = await axios.get(url, {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });
      setResults(response.data.items); // 검색 결과 상태 업데이트
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("책 정보를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col mx-[25em] mt-[3em] h-[800px]">
        <div>
          <ServiceName />
          {/* 검색 바 */}
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 회색 줄 추가 */}
        <div className="w-[100%] h-1 bg-gray-300 my-6"></div>

        {/* 검색 결과 박스 */}
        <div className="mt-1 w-full h-[40vh] bg-white shadow-lg rounded-lg p-4 overflow-y-auto">
          <SearchResults results={results} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
