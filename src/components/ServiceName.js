// components/ServiceName.js
import React from "react";

export const ServiceName = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-40 mr-10">
      {/* 이미지 영역 */}
      <div>
        <img
          src="/images/book.png" // 닫기 아이콘 이미지 경로
          alt="Book"
          className="w-[120px] h-[110px]"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="text-[48px] font-bold text-black mt-7">
        Books in short form
      </div>
    </div>
  );
};
