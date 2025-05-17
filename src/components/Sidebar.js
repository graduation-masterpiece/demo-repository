import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useSidebar } from "../SidebarContext"

const Sidebar = ({ onToggle }) => {
  const { isVisible, toggleSidebar: toggleSidebarGlobal } = useSidebar()
  const location = useLocation()

  // Toggle sidebar
  const toggleSidebar = () => {
    toggleSidebarGlobal()
    if (onToggle) {
      onToggle(!isVisible)
    }
  }

  // Pass initial state to parent
  React.useEffect(() => {
    if (onToggle) {
      onToggle(isVisible)
    }
  }, [isVisible, onToggle])

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`h-screen w-[240px] bg-[#333333] text-white fixed top-0 ${
          isVisible ? "left-0" : "-left-[240px]"
        } z-50 transition-all duration-300 flex flex-col font-['Montserrat']`}
      >
        {/* Home button */}
        <div className="px-4 py-4 border-b border-[#444444] flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-[#444444] transition-colors"
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

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-4">
            <li>
              <Link
                to="/ShortBooks"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
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

      {/* Open button (visible when sidebar is closed) */}
      {!isVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 w-12 h-12 flex items-center justify-center bg-transparent rounded-none transition-transform duration-200 text-[#333333] hover:scale-110"
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
    </>
  )
}

export default Sidebar
