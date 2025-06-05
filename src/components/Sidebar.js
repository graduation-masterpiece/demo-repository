// src/components/Sidebar.js

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../SidebarContext";

const Sidebar = ({ onToggle }) => {
  const { isVisible, toggleSidebar: toggleSidebarGlobal } = useSidebar();
  const location = useLocation();

  // 사이드바 열기/닫기 토글
  const toggleSidebar = () => {
    toggleSidebarGlobal();
    if (onToggle) onToggle(!isVisible);
  };

  // 부모에게 초기 상태 전달
  React.useEffect(() => {
    if (onToggle) onToggle(isVisible);
  }, [isVisible, onToggle]);

  // 현재 경로가 active인지 체크
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar 컨테이너 */}
      <div
        className={`sliding-sidebar h-screen w-[240px] bg-[#333333] text-white fixed top-0 ${
          isVisible ? "left-0" : "-left-[240px]"
        } z-[90] transition-all duration-300 flex flex-col justify-between font-['Montserrat']`}
      >
        {/* ──────────── 상단: 메뉴 목록 ──────────── */}
        <div>
          {/* Home 버튼 */}
          <div className="px-4 py-4 border-b border-[#444444] flex items-center justify-between">
            <Link
              to="/"
              className="menu-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-[#444444] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                <path d="M3 16.2V21m0-4.8V21m0 0h4.8" />
                <path d="M21 7.8V3m0 4.8V3m0 0h-4.8" />
                <path d="M3 7.8V3m0 4.8V3m0 0h4.8" />
              </svg>
              <span className="text-lg font-normal">Home</span>
            </Link>
            <button
              onClick={toggleSidebar}
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
          </div>

          {/* 네비게이션 링크 */}
          <nav className="px-4 py-6">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/ShortBooks"
                  className={`menu-item flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive("/ShortBooks")
                      ? "bg-[#444444] text-white"
                      : "text-gray-300 hover:bg-[#444444] hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  <span className="text-lg font-normal">Short Books</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/MyLibrary"
                  className={`menu-item flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive("/MyLibrary")
                      ? "bg-[#444444] text-white"
                      : "text-gray-300 hover:bg-[#444444] hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                  <span className="text-lg font-normal">Library</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/Settings"
                  className={`menu-item flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive("/Settings")
                      ? "bg-[#444444] text-white"
                      : "text-gray-300 hover:bg-[#444444] hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="text-lg font-normal">Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ──────────── 하단: 소셜 미디어 아이콘 링크 ──────────── */}
        <div className="px-4 py-6 border-t border-[#444444] flex justify-center space-x-6">
          {/* GitHub 아이콘 */}
          <a
            href="https://github.com/YourOrganization"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0.2975C5.37 0.2975 0 5.6675 0 12.2975C0 17.5725 3.438 22.0425 8.205 23.6225C8.805 23.7075 9.025 23.3725 9.025 23.0825C9.025 22.8225 9.015 22.0425 9.01 20.9825C5.6725 21.7225 4.9675 19.3525 4.9675 19.3525C4.4225 17.9525 3.6325 17.5625 3.6325 17.5625C2.545 16.8225 3.7175 16.8375 3.7175 16.8375C4.9175 16.9275 5.545 18.0875 5.545 18.0875C6.6325 19.8925 8.365 19.3725 9.045 19.0825C9.1325 18.3125 9.4425 17.7725 9.7875 17.4825C7.1275 17.1925 4.3325 16.1425 4.3325 11.4675C4.3325 10.1475 4.7975 9.0475 5.5525 8.1875C5.4325 7.8975 5.045 6.6825 5.6625 5.0425C5.6625 5.0425 6.6725 4.7325 9.01 6.3025C9.98 6.0475 11.015 5.9175 12.0475 5.9125C13.08 5.9175 14.115 6.0475 15.085 6.3025C17.4225 4.7325 18.4325 5.0425 18.4325 5.0425C19.0525 6.6825 18.665 7.8975 18.545 8.1875C19.3025 9.0475 19.7675 10.1475 19.7675 11.4675C19.7675 16.1525 16.965 17.1875 14.2975 17.4725C14.745 17.8425 15.145 18.5675 15.145 19.6775C15.145 21.2925 15.135 22.4875 15.135 23.0825C15.135 23.3725 15.3525 23.7125 15.9625 23.6275C20.7325 22.0425 24.165 17.5725 24.165 12.2975C24.165 5.6675 18.795 0.2975 12 0.2975Z" />
            </svg>
          </a>

          {/* Instagram 공식 로고 */}
          <a
            href="https://instagram.com/YourAccount"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
              <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM17.5 6a1 1 0 110 2 1 1 0 010-2z" />
            </svg>
          </a>

          {/* YouTube 아이콘 */}
          <a
            href="https://youtube.com/YourChannel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186c-.27-1.018-1.064-1.814-2.082-2.084C19.44 3.5 12 3.5 12 3.5s-7.44 0-9.416.602c-1.018.27-1.812 1.066-2.082 2.084C0 8.166 0 12 0 12s0 3.834.502 5.814c.27 1.018 1.064 1.814 2.082 2.084C4.56 20.5 12 20.5 12 20.5s7.44 0 9.416-.602c1.018-.27 1.812-1.066 2.082-2.084.502-1.98.502-5.814.502-5.814s0-3.834-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;