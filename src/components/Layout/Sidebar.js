import React from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../SidebarContext";

const Sidebar = ({ onToggle }) => {
  const { isVisible, toggleSidebar: toggleSidebarGlobal } = useSidebar();

  // 토글 사이드바
  const toggleSidebar = () => {
    toggleSidebarGlobal();
    if (onToggle) {
      onToggle(!isVisible);
    }
  };

  // 초기 상태 부모에게 전달
  React.useEffect(() => {
    if (onToggle) {
      onToggle(isVisible);
    }
  }, [isVisible, onToggle]);

  return (
    <div>
      <div
        className={`h-screen w-[270px] bg-[#424141] text-black fixed top-0 ${
          isVisible ? "left-0" : "-left-[270px]"
        } z-50 shadow-lg transition-all duration-300 flex flex-col justify-between sidebar-container`}
      >
        <div>
          <div className="flex items-center justify-between mt-10">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 px-2 py-2 bg-[#ECE6CC] rounded-r-lg border-[2.5px] border-black active:text-white"
            >
              <img
                src="/images/sidebar_search.png"
                alt="Library"
                className="h-7 w-7 ml-[-1px]"
              />
              <div className="text-[24px] font-medium">Home</div>
            </Link>

            <button
              onClick={toggleSidebar}
              className="p-2 bg-white border-gray-500 border-[2px] rounded-l-lg sidebar-toggle-btn"
            >
              <img
                src="/images/sidebar_left.png"
                alt="toggle"
                className="w-[32px] h-[28px]"
              />
            </button>
          </div>

          <nav>
            <ul className="space-y-5 mt-14">
              <Link
                to="/ShortBooks"
                className="flex items-center justify-center px-2 py-2 bg-[#FEABAB] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white"
              >
                <div className="flex flex-row space-x-3 mr-6">
                  <img
                    src="/images/sidebar_lib.png"
                    alt="Library"
                    className="h-6 w-6 mt-1"
                  />
                  <p className="text-[20px] font-semibold">Short Books</p>
                </div>
              </Link>

              <Link
                to="/MyLibrary"
                className="flex items-center justify-center px-2 py-2 bg-[#F0DF98] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white"
              >
                <div className="flex flex-row space-x-3 mr-10">
                  <img
                    src="/images/sidebar_favorite.png"
                    alt="My Library"
                    className="h-6 w-6 mt-1"
                  />
                  <p className="text-[20px] font-semibold">My Library</p>
                </div>
              </Link>

              <Link
                to="/Settings"
                className="flex items-center justify-center px-2 py-2 bg-[#A7D0AC] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white"
              >
                <div className="flex flex-row space-x-3 mr-[3.7em]">
                  <img
                    src="/images/sidebar_settings.png"
                    alt="Settings"
                    className="h-6 w-6 mt-1"
                  />
                  <p className="text-[20px] font-semibold">Settings</p>
                </div>
              </Link>
            </ul>
          </nav>
        </div>
      </div>

      {/* 열기 버튼 */}
      {!isVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-12 w-12 flex items-center justify-center focus:outline-none border-[2px] border-black rounded-lg bg-[#C4D0B3] sidebar-toggle-btn"
        >
          <img
            src="/images/sidebar_open.png"
            alt="open"
            className="w-[35px] h-[30px]"
          />
        </button>
      )}
    </div>
  );
};

export default Sidebar;