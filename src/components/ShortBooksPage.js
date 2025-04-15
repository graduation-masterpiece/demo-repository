import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const ShortBooksPage = () => {
  const { id } = useParams();
  const [shortBooks, setShortBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const throttleTimeout = useRef(null);
  const throttleTime = 800;  // 밀리초 단위. 1000ms = 1s

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

  const handleWheel = useCallback ((event) => {
    console.log("Wheel Event Detected");

    if (throttleTimeout.current) {
      console.log("Throttle is active, ignoring scroll");
      
      return;
    }

    throttleTimeout.current = setTimeout(() => {
      throttleTimeout.current = null;
      
      console.log("Throttle cleared");
    }, throttleTime);

    if (event.deltaY > 0) {
      if (currentBookIndex < shortBooks.length - 1) {
        setCurrentBookIndex((prevIndex) => prevIndex + 1);
        setCurrentSentenceIndex(0);
        
        console.log("Moving to the next book");
      } else {
        console.log("Reached to the last book");
      }
    } else if (event.deltaY < 0) {
      if (currentBookIndex > 0) {
        setCurrentBookIndex((prevIndex) => prevIndex - 1);
        setCurrentSentenceIndex(0);

        console.log("Moving to the previous book");
      } else {
        console.log("Reached to the first book");
      }
    }
  }, [currentBookIndex, shortBooks.length]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = id ? `/api/book/${id}` : "/api/book-cards";
        const response = await axios.get(url);
        setShortBooks(Array.isArray(response.data) ? response.data : [response.data]);
        setCurrentBookIndex(0);
        setCurrentSentenceIndex(0);
      } catch (error) {
        console.error("Error Occurred During Loading Book Info:", error);
      }
    };

    fetchBooks();
  }, [id]);
  
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    console.log("Wheel event listener attached");
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      
      console.log("Wheel event listener removed");

      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [handleWheel]);

  const currentBook = shortBooks[currentBookIndex];

  const handleLinkShare = async () => {
    try {
      const shareURL = `https://bookcard.site/meta/book/${currentBook.id}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareURL);
        alert("URL Has Been Copied.");
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = shareURL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("URL Has Been Copied.");
      }
    } catch (err) {
      console.error("Share URL Copy Failed: ", err);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[64vw] h-[90vh] mx-[18em] mt-[3em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">Short Books</p>
        <div className="flex flex-row items-center justify-center space-x-3 mt-3 p-3 rounded-xl h-[75vh] border-[2px] border-gray-600 bg-[#C4D0B3]">
          <button onClick={handlePrePage} className="bg-[#424141] px-3 py-4 rounded-2xl">
            <img src="/images/card_left.png" alt="card_left" className="w-6 h-10" />
          </button>
          <div className="flex justify-center items-center w-[52vw] h-[70vh] bg-[#424141] rounded-2xl">
            {currentBook && (
              <div className="relative w-[45vw] h-[65vh]">
                {currentSentenceIndex === 0 ? (
                  <img src={currentBook.image_url} alt="card_book" className="w-full h-full object-cover" />
                ) : currentSentenceIndex <= currentBook.summary.length ? (
                  <>
                    <img src={currentBook.image_url} alt="card_book" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-white opacity-70 z-10" />
                    <div className="text-black text-[3vw] font-bold break-words flex flex-col justify-center items-center w-[38vw] h-[65vh] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
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
                      <img src={currentBook.book_cover} alt="cover_image" className="max-w-[90%] max-h-[90%] object-contain" />
                    </div>
                    <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 z-20">
                      <h1 className="text-4xl font-bold mb-4 text-center">{currentBook.title || "No Title"}</h1>
                      <p className="text-2xl text-center">{currentBook.author || "Writer Unknown"}</p>
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
        <div onClick={handleLinkShare} className="fixed top-[74vh] right-[11vw] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="/images/share.png" alt="share" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortBooksPage;
