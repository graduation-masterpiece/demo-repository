// src/components/SettingsPage.js

import React, { useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useSidebar } from "../SidebarContext";

const SettingsPage = () => {
  const { isVisible: sidebarVisible, toggleSidebar } = useSidebar();
  const contentRef = useRef(null);

  // 사이드바 상태에 따라 메인 콘텐츠 레이아웃 조정
  useEffect(() => {
    if (!contentRef.current) return;

    if (sidebarVisible) {
      contentRef.current.style.marginLeft = "270px";
      contentRef.current.style.width = "calc(100% - 270px)";
    } else {
      contentRef.current.style.marginLeft = "0";
      contentRef.current.style.width = "100%";
    }
  }, [sidebarVisible]);

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden font-['Montserrat'] relative">
      {/* 사이드바 */}
      <Sidebar />

      {/* 사이드바 토글 버튼 */}
      <div className="absolute top-4 left-4 z-50">
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
              stroke="currentColor"
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

      <div
        ref={contentRef}
        className="transition-all duration-300 h-screen overflow-y-auto"
        style={{
          marginLeft: sidebarVisible ? "270px" : "0",
          width: sidebarVisible ? "calc(100% - 270px)" : "100%",
        }}
      >
        <div className="flex flex-col items-start h-full max-w-7xl mx-auto px-8 py-12">
          {/* 페이지 제목 */}
          <h1 className="text-[48px] font-normal text-[#1B1B1B] text-left mb-6 relative">
            Settings
            <div className="w-[500px] h-[2px] bg-[#1B1B1B] absolute bottom-[-10px] left-0"></div>
          </h1>

          {/* Feedback & Survey 섹션 (하얀 박스 없이) */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#333333] mb-2">
              Feedback & Survey
            </h2>
            <p className="text-[#7A6F5A] mb-4">
              Please click the button below to participate in a brief survey.
            </p>
            <a
              href="https://docs.google.com/forms/d/여기에_설문_ID_삽입"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#B08B4F] text-white rounded-full hover:bg-[#A7763A] transition-colors shadow-md"
            >
              Take the Survey
            </a>
          </section>

          {/* 추가 설정 항목이 필요하면 여기에 바로 이어서 작성 */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;