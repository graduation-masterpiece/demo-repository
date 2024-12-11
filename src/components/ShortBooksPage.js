import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const ShortBooksPage = () => {
  const { id } = useParams();
  const [shortBooks, setShortBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = id 
          ? `http://localhost:5001/book/${id}`
          : 'http://localhost:5001/book-cards';
        const response = await axios.get(url);
        setShortBooks(response.data);
        setCurrentBookIndex(0);
        setCurrentSentenceIndex(0);
      } catch (error) {
        console.error('책 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchBooks();
  }, [id]);

  const handlePrePage = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    } else if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1);
      setCurrentSentenceIndex(shortBooks[currentBookIndex - 1].summary.length - 1);
    }
  };

  const handleNextPage = () => {
    const currentBook = shortBooks[currentBookIndex];
    if (!currentBook) return;

    if (currentSentenceIndex < currentBook.summary.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else if (currentBookIndex < shortBooks.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
      setCurrentSentenceIndex(0);
    }
  };

  const currentBook = shortBooks[currentBookIndex];

  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[1200px] mx-[18em] mt-[4.5em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
          Short Books
        </p>
        <div className="flex flex-row items-center justify-center space-x-3 mt-3 p-3 rounded-xl h-[700px] border-[2px] border-gray-600 bg-[#C4D0B3]">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrePage}
            className="bg-[#424141] px-3 py-4 rounded-2xl"
          >
            <img
              src="/images/card_left.png"
              alt="card_left"
              className="w-6 h-10"
            />
          </button>

          {/* 카드 영역 */}
          <div className="flex justify-center items-center w-[1000px] h-[650px] bg-[#424141] rounded-2xl">
            {currentBook && (
              <div className="relative w-[800px] h-[600px]">
                <img
                  src={`http://localhost:5001/generated_images/${currentBook.image_url.split('/').pop()}`}
                  alt="card_book"
                  className={`w-full h-full object-cover ${currentSentenceIndex === 0 ? '' : 'opacity-50'}`}
                />
                {currentSentenceIndex > 0 && (
                  <div className="absolute inset-0 bg-white opacity-70 z-10" />
                )}
                {currentSentenceIndex > 0 && (
                  <div className="text-black text-[52px] font-bold break-words flex flex-col justify-center items-center w-[600px] h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="inline whitespace-normal break-keep text-center">
                      {currentBook.summary[currentSentenceIndex - 1].split('*').map((part, index) => (
                        <span key={index} className={index % 2 === 1 ? 'text-orange-500' : ''} style={{ display: 'inline' }}>
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={handleNextPage}
            className="bg-[#424141] px-3 py-4 rounded-2xl"
          >
            <img
              src="/images/card_right.png"
              alt="card_right"
              className="w-6 h-10"
            />
          </button>
        </div>
        <div className="fixed top-[10.3em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="/images/search.png" alt="search" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[37em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="/images/white_like.png" alt="like" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[43em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="/images/share.png" alt="share" className="w-8 h-8" />
          </button>
        </div>
        <div className="fixed top-[49em] right-[8em] p-2 bg-[#C4D0B3] rounded-xl border-[2px] border-gray-600">
          <button className="bg-[#424141] rounded-xl p-4">
            <img src="/images/white_trash.png" alt="trash" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortBooksPage;