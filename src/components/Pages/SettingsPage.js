import React, { useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useSidebar } from "../SidebarContext";

const SettingsPage = () => {
  const { isVisible: sidebarVisible } = useSidebar(); // 전역 사이드바 상태 사용
  const contentRef = useRef(null);

  // 사이드바 상태가 변경될 때 콘텐츠 조정
  useEffect(() => {
    if (!contentRef.current) return;
    
    if (sidebarVisible) {
      contentRef.current.style.marginLeft = '270px';
      contentRef.current.style.width = 'calc(100% - 270px)';
    } else {
      contentRef.current.style.marginLeft = '0';
      contentRef.current.style.width = '100%';
    }
  }, [sidebarVisible]);

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden">
      <Sidebar />
      <div 
        ref={contentRef}
        className="transition-all duration-300 h-screen overflow-y-auto"
        style={{ 
          marginLeft: sidebarVisible ? '270px' : '0',
          width: sidebarVisible ? 'calc(100% - 270px)' : '100%'
        }}
      >
        <div className="flex flex-col max-w-4xl mx-auto px-4 py-8">
          <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4 mb-6">
           Settings
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl text-gray-700">Setting Page is in develop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
