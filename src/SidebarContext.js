import React, { createContext, useState, useContext } from 'react';

// 사이드바 컨텍스트 생성
const SidebarContext = createContext();

// SidebarProvider 컴포넌트
export const SidebarProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleSidebar = () => {
    setIsVisible(prev => !prev);
  };
  
  return (
    <SidebarContext.Provider value={{ isVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// 커스텀 훅 - 사이드바 컨텍스트 사용
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}; 