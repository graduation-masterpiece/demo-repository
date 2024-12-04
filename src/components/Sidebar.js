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
    setNickname("Nick Name");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <div
        className={`h-screen w-64 bg-gray-200 text-black fixed top-0 ${
          isVisible ? "left-0" : "-left-64"
        } z-50 shadow-lg transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-end p-4 border-b border-gray-300">
            <button
              onClick={toggleSidebar}
              className="text-xl hover:text-gray-600 focus:outline-none"
            >
              <img
                src="/images/sidebar_left.png"
                alt="pic1"
                className="w-[32px] h-[28px]"
              />
            </button>
          </div>

          {isLoggedIn && (
            <div className="flex items-center px-6 mt-4 mb-6">
              <img
                src="/images/sidebar_user.png"
                alt="User Icon"
                className="h-6 w-6 mr-3"
              />
              <span className="text-lg font-medium mt-1">{nickname}</span>
            </div>
          )}

          <nav className="mt-6">
            <ul className="space-y-8 px-6">
              {!isLoggedIn && (
                <li
                  className="flex items-center space-x-3 cursor-pointer hover:text-white-600"
                  onClick={handleLogin}
                >
                  <img
                    src="/images/sidebar_login.png"
                    alt="Login"
                    className="h-6 w-6"
                  />
                  <span className="text-lg font-medium">Login</span>
                </li>
              )}

              <hr className="border-t border-gray-300" />
              <li className="flex items-center space-x-2 hover:text-red-500">
                <img
                  src="/images/sidebar_search.png"
                  alt="Library"
                  className="h-7 w-7 ml-[-1px]"
                />
                {/* Link to LibraryPage */}
                <Link to="/" className="text-lg font-medium">
                  Search
                </Link>
              </li>
              <li className="flex items-center space-x-3 hover:text-green-600">
                <img
                  src="/images/sidebar_lib.png"
                  alt="Library"
                  className="h-6 w-6"
                />
                {/* Link to LibraryPage */}
                <Link to="/library" className="text-lg font-medium">
                  Library
                </Link>
              </li>
              <li className="flex items-center space-x-3 hover:text-blue-600">
                <img
                  src="/images/sidebar_favorite.png"
                  alt="My Favorites"
                  className="h-6 w-6"
                />
                {/* Link to LibraryPage */}
                <Link to="/Favorite" className="text-lg font-medium">
                  My Favorite
                </Link>
              </li>
              <li className="flex items-center space-x-3 hover:text-gray-700">
                <img
                  src="/images/sidebar_settings.png"
                  alt="Settings"
                  className="h-6 w-6"
                />
                <Link to="/Settings" className="text-lg font-medium">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {isLoggedIn && (
          <div className="px-6 mb-6">
            <hr className="border-t border-gray-300 mb-4" />
            <li
              className="flex items-center space-x-3 cursor-pointer hover:text-red-600"
              onClick={handleLogout}
            >
              <img
                src="/images/sidebar_logout.png"
                alt="Logout"
                className="h-6 w-6"
              />
              <span className="text-lg font-medium">Logout</span>
            </li>
          </div>
        )}
      </div>

      {!isVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-10 w-10 flex items-center justify-center focus:outline-none"
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
