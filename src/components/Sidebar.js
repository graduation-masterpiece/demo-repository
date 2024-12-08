import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link 추가

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("Nickname");

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleLogin = () => {
    setNickname("Nickname");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <div
        className={`h-screen w-[270px] bg-[#424141] text-black fixed top-0 ${
          isVisible ? "left-0" : "-left-[270px]"
        } z-50 shadow-lg transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-end">
            <button
              onClick={toggleSidebar}
              className="mt-5 p-2 bg-white border-gray-500 border-[2px] rounded-l-lg"
            >
              <img
                src="/images/sidebar_left.png"
                alt="pic1"
                className="w-[32px] h-[28px]"
              />
            </button>
          </div>

          {isLoggedIn && (
            <div className="flex justify-center items-center space-x-3 mt-14 mb-6 px-5 py-1 bg-white w-[230px] rounded-r-lg border-[2.5px] border-black">
              <img
                src="/images/sidebar_user.png"
                alt="User Icon"
                className="h-6 w-6 mt-1"
              />
              <span className="text-[26px] font-semibold mt-1 overflow-hidden">
                {nickname}
              </span>
            </div>
          )}

          <nav className="mt-6">
            <ul className="space-y-5">
              {!isLoggedIn && (
                <li
                  className="flex justify-center items-center mt-14 mb-6 px-2 py-1 bg-white w-[230px] rounded-r-lg border-[2.5px] border-black"
                  onClick={handleLogin}
                >
                  <div className="flex flex-row space-x-3 mr-[70px] cursor-pointer">
                    <img
                      src="/images/sidebar_login.png"
                      alt="login"
                      className="h-6 w-6 mt-3"
                    />
                    <span className="text-[26px] font-semibold mt-1">
                      Login
                    </span>
                  </div>
                </li>
              )}

              <hr className="border-[2px] border-[#777777] w-[230px]" />
              {/* <li className="flex items-center justify-center space-x-2 hover:text-red-500 px-2 py-1 bg-white w-[230px] rounded-r-lg border-[2.5px] border-black">
                <img
                  src="/images/sidebar_search.png"
                  alt="Library"
                  className="h-7 w-7 ml-[-1px]"
                />
               
                <Link to="/" className="text-lg font-medium">
                  Search
                </Link>
              </li> */}

              <Link to="/ShortBooks" className="flex items-center justify-center px-2 py-2 bg-[#FEABAB] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white">
                <div className="flex flex-row space-x-3 mr-6">
                  <img
                    src="/images/sidebar_lib.png"
                    alt="Library"
                    className="h-6 w-6 mt-1"
                  />
                  <p className="text-[20px] font-semibold">
                    Short Books
                  </p>
                </div>
              </Link>

              <Link to="/MyLibrary" className="flex items-center justify-center px-2 py-2 bg-[#F0DF98] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white">
                <div className="flex flex-row space-x-3 mr-10">
                  <img
                    src="/images/sidebar_favorite.png"
                    alt="My Library"
                    className="h-6 w-6 mt-1"
                  />
                  {/* Link to LibraryPage */}
                  <p className="text-[20px] font-semibold">
                    My Library
                  </p>
                </div>
              </Link>

              <Link to="/Settings" className="flex items-center justify-center px-2 py-2 bg-[#A7D0AC] w-[230px] rounded-r-lg border-[2.5px] border-black active:text-white">
                <div className="flex flex-row space-x-3 mr-[3.7em]">
                  <img
                    src="/images/sidebar_settings.png"
                    alt="Settings"
                    className="h-6 w-6 mt-1"
                  />
                  {/* Link to LibraryPage */}
                  <p className="text-[20px] font-semibold">
                    Settings
                  </p>
                </div>
              </Link>
            </ul>
          </nav>
        </div>

        {isLoggedIn && (
          <div className="mb-6">
            <li
              className="flex items-end justify-between w-[130px] px-3 py-1 space-x-2 cursor-pointer active:white bg-white border-[2px] border-black rounded-l-lg ml-auto"
              onClick={handleLogout}
            >
              
              <span className="text-[20px] font-medium">Logout</span>
              <img
                src="/images/sidebar_logout.png"
                alt="Logout"
                className="h-6 w-6 mb-0.5"
              />
            </li>
          </div>
        )}
      </div>

      {!isVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-12 w-12 flex items-center justify-center focus:outline-none border-[2px] border-black rounded-lg bg-[#C4D0B3]"
        >
          <img
            src="/images/sidebar_open.png"
            alt="pic1"
            className="w-[35px] h-[30px]"
          />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
