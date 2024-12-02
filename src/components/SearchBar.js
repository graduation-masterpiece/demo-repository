// components/SearchBar.js
import React, { useRef, useState } from "react";
import {useNavigate} from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();
  const handleSearchClick = () => {
    navigate("/Summary");
  }

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [inputText, setInputText] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name); // 선택한 PDF 파일 이름 저장
      setInputText(""); // 입력창 초기화
    } else {
      alert("Only PDF files are allowed."); // PDF 파일만 허용
      event.target.value = ""; // 파일 입력 초기화
    }
  };

  const clearFile = () => {
    setFileName("");
    fileInputRef.current.value = ""; // 파일 입력 초기화
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="w-[650px] h-[50px] items-center bg-[#fff] rounded-full overflow-hidden border border-gray-300 flex justify-between mt-10">
        
        {/* 왼쪽 클립 아이콘 (파일 선택 버튼) */}
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center justify-center w-[48px] h-[48px] ml-[8px]"
        >
          <div className="background-clip w-[24px] h-[24px] bg-cover bg-no-repeat" />
        </button>
        
        {/* 숨겨진 파일 입력 필드 */}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* 입력 필드 */}
        <div className="w-full flex items-center pl-2 pr-4">
          {fileName ? (
            <div className="flex justify-between items-center w-full">
              <span className="text-gray-500 truncate">{fileName}</span>
              <button
                type="button"
                className="text-gray-500 hover:text-red-500 ml-2"
                onClick={clearFile}
              >
                ✕
              </button>
            </div>
          ) : (
            <input
              className="w-full h-full bg-transparent text-gray-500 border-none outline-none placeholder-gray-400"
              placeholder="Please enter a book name"
              value={inputText}
              onChange={handleInputChange}
            />
          )}
        </div>

        {/* 오른쪽 돋보기 아이콘 */}
        <button type="button" onClick={handleSearchClick}>
          <div className="background-magnifier w-[40px] h-[36px] bg-contain bg-no-repeat" />
        </button>
      </div>
    </div>
  );
};
