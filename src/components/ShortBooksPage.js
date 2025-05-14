import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import ErrorReportModal from "./ErrorReportModal";
import axios from "axios";
import { useSidebar } from "../SidebarContext";

const ShortBooksPage = () => {
  const { id } = useParams();
  const [shortBooks, setShortBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
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

  const handlePrePage = useCallback(() => {
    const currentBook = shortBooks[currentBookIndex];
    if (!currentBook?.summary) return;

    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1);
    } else if (currentBookIndex > 0) {
      setCurrentBookIndex((prev) => prev - 1);
      setCurrentSentenceIndex(0);
    }
  }, [shortBooks, currentBookIndex, currentSentenceIndex]);

  const handleNextPage = useCallback(() => {
    const currentBook = shortBooks[currentBookIndex];
    if (!currentBook?.summary) return;

    if (currentSentenceIndex < currentBook.summary.length + 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    } else if (currentBookIndex < shortBooks.length - 1) {
      setCurrentBookIndex((prev) => prev + 1);
      setCurrentSentenceIndex(0);
    }
  }, [shortBooks, currentBookIndex, currentSentenceIndex]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = id ? `/api/book/${id}` : "/api/book-cards";
        const response = await axios.get(url);
        setShortBooks(Array.isArray(response.data) ? response.data : [response.data]);
        setCurrentBookIndex(0);
        setCurrentSentenceIndex(0);
      } catch (error) {
        console.error("An error has occurred during loading the book data: ", error);
      }
    };

    fetchBooks();
  }, [id]);
  
  const debounceTimeout = useRef(null);
  const timeoutTime = 300;  // 밀리초 단위. 1000ms = 1s
  
  useEffect(() => {
    const wheelHandler = (event) => {
      if (debounceTimeout.current) {
        return;
      }

      setShortBooks((prevBooks) => {
        setCurrentBookIndex((prevIndex) => {
          if (event.deltaY > 0 && prevIndex < prevBooks.length - 1) {
            setCurrentSentenceIndex(0);
  
            return prevIndex + 1;
          } else if (event.deltaY < 0 && prevIndex > 0) {
            setCurrentSentenceIndex(0);
  
            return prevIndex - 1;
          } else return prevIndex;
        });
  
        return prevBooks;
      });

      debounceTimeout.current = setTimeout(() => {
        debounceTimeout.current = null;
      }, timeoutTime);
    };
    
    window.addEventListener('wheel', wheelHandler);
    
    return () => {
      window.removeEventListener('wheel', wheelHandler);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    };
  }, []);

  const currentBook = shortBooks[currentBookIndex];

  const handleLinkShare = async () => {
    try {
      const shareURL = `https://bookcard.site/meta/book/${currentBook.id}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareURL);
        alert("URL has been copied.");
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = shareURL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("URL has been copied.");
      }
    } catch (err) {
      console.error("Share URL copy failed: ", err);
    }
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorReportSubmit = async (selectedError) => {
    try {
      await axios.post("/api/error-report", {
        book_info_id: currentBook.id,
        error_type: selectedError,
        report_time: new Date().toISOString(),
      });
  
      alert("Error report completed.");
      setShowErrorModal(false);
    } catch (error) {
      console.error("Error report failed: ", error);
      alert("An error has occurred during the error reporting.");
    }
  };

  const handleErrorReport = () => {
    setShowErrorModal(true);
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden">
      {showErrorModal && (
        <ErrorReportModal
          onClose={() => setShowErrorModal(false)}
          onSubmit={handleErrorReportSubmit}
        />
      )}
      <Sidebar />
      <div 
        ref={contentRef}
        className="transition-all duration-300 h-screen overflow-y-auto"
        style={{ 
          marginLeft: sidebarVisible ? '270px' : '0',
          width: sidebarVisible ? 'calc(100% - 270px)' : '100%'
        }}
      >
        <div className={`flex flex-col max-w-4xl mx-auto px-4 py-8 transition-all duration-300 ${
          !sidebarVisible ? 'ml-auto mr-auto' : ''
        }`}>
          <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4 mb-6">Short Books</p>
          <div className="flex flex-row items-center justify-center space-x-3 p-3 rounded-xl border-[2px] border-gray-600 bg-[#C4D0B3]">
            <button onClick={handlePrePage} className="bg-[#424141] px-3 py-4 rounded-2xl">
              <img src="/images/card_left.png" alt="card_left" className="w-6 h-10" />
            </button>
            <div className="flex justify-center items-center w-full h-[65vh] bg-[#424141] rounded-2xl">
              {currentBook && (
                <div className="relative w-full h-full max-w-[700px] max-h-[600px] mx-auto">
                  {currentSentenceIndex === 0 ? (
                    <img src={currentBook.image_url} alt="card_book" className="w-full h-full object-cover" />
                  ) : currentSentenceIndex <= currentBook.summary.length ? (
                    <>
                      <img src={currentBook.image_url} alt="card_book" className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-white opacity-70 z-10" />
                      <div className="text-black text-xl md:text-4xl lg:text-4xl font-bold break-words flex flex-col justify-center items-center w-[90%] h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="inline whitespace-normal break-keep text-center">
                          {currentBook.summary[currentSentenceIndex - 1]?.split("*").map((part, index) => (
                            <span key={index} className={index % 2 === 1 ? "text-orange-500" : ""}>
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full flex">
                      <img src={currentBook.image_url} alt="background_book" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-white opacity-70 z-10" />
                      <div className="w-1/2 h-full flex items-center justify-center z-20">
                        <img src={currentBook.book_cover} alt="cover_image" className="w-auto h-auto max-w-[90%] max-h-[90%] object-contain" />
                      </div>
                      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 z-20">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">{currentBook.title || "No Title"}</h1>
                        <p className="text-lg md:text-2xl lg:text-3xl text-center">{currentBook.author || "Writer Unknown"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={handleNextPage} className="bg-[#424141] px-3 py-4 rounded-2xl">
              <img src="/images/card_right.png" alt="card_right" className="w-6 h-10" />
            </button>
          </div>
        </div>
        
        {/* 고정 액션 버튼 영역 */}
        <div className="fixed bottom-24 right-6 flex flex-col space-y-4">
          <div onClick={handleLinkShare} className="p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
            <button className="bg-[#424141] rounded-xl p-4">
              <img src="/images/share.png" alt="share" className="w-4 h-4" />
            </button>
          </div>
          <div onClick={handleErrorReport} className="p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
            <button className="bg-[#424141] rounded-xl p-4">
              <img src="/images/report.png" alt="report" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortBooksPage;
