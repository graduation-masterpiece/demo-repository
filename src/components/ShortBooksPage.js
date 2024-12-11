import React, { useState } from "react";
import Sidebar from "./Sidebar";

const ShortBooksPage = () => {
  // 페이지 상태 설정
  const [currentIndex, setCurrentIndex] = useState(0);

  // 텍스트 데이터 배열
  const textData = [
    "편의점에서 밤마다 알바생과 떠돌이가 마주치면 생기는 일",
    "그러나 독고의 등장으로 인해 편의점은 활력을 되찾고, 다양한 손님과 직원들이 그의 영향을 받습니다.",
    "김호연 작가의 다른 작품을 검색해보세요!",
  ];

  // 이전 페이지로 이동
  const handlePrePage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentIndex < textData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[70em] mx-[18em] mt-[4.5em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
          Short Books
        </p>
        <div className="flex flex-row items-center justify-center space-x-3 mt-3 p-3 rounded-xl h-[700px] border-[2px] border-gray-600 bg-[#C4D0B3]">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrePage}
            className="bg-[#424141] px-3 py-4 rounded-2xl"
          >
            <img
              src="images/card_left.png"
              alt="card_left"
              className="w-6 h-10"
            />
          </button>

          {/* 카드 영역 */}
          <div className="flex justify-center items-center w-[1000px] h-[650px] bg-[#424141] rounded-2xl">
            <div
              className={`relative w-[800px] h-[600px] ${
                currentIndex > 0 ? "opacity-60" : "opacity-100"
              }`} // 2번째 페이지부터 투명도 적용
            >
              <img
                src="images/card_book.png"
                alt="card_book"
                className="w-full h-full object-cover"
              />
              <div className="text-black text-[52px] font-bold break-words flex flex-col justify-center items-center w-[600px] h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {textData[currentIndex]}
              </div>
            </div>
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={handleNextPage}
            className="bg-[#424141] px-3 py-4 rounded-2xl"
          >
            <img
              src="images/card_right.png"
              alt="card_right"
              className="w-6 h-10"
            />
          </button>
        </div>
        <div className="fixed top-[10.3em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="images/search.png" alt="search" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[37em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="images/white_like.png" alt="like" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[43em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="images/share.png" alt="share" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[49em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="images/white_trash.png" alt="search" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortBooksPage;
