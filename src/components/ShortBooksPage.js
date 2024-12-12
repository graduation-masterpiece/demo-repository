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
        console.log('받아온 책 데이터:', response.data);
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
      setCurrentSentenceIndex(0);
    }
  };

  const handleNextPage = () => {
    const currentBook = shortBooks[currentBookIndex];
    if (!currentBook) return;

    if (currentSentenceIndex < currentBook.summary.length) {
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
                {currentSentenceIndex === 0 ? (
                  // 첫 장에 이미지만 표시
                  <img
                    src={`http://localhost:5001/generated_images/${currentBook.image_url.split('/').pop()}`}
                    alt="card_book"
                    className="w-full h-full object-cover"
                  />
                ) : currentSentenceIndex < currentBook.summary.length ? (
                  // 첫 문장부터 표시
                  <>
                    <img
                      src={`http://localhost:5001/generated_images/${currentBook.image_url.split('/').pop()}`}
                      alt="card_book"
                      className={`w-full h-full object-cover ${currentSentenceIndex === 0 ? '' : 'opacity-50'}`}
                    />
                    <div className="absolute inset-0 bg-white opacity-70 z-10" />
                    <div className="text-black text-[52px] font-bold break-words flex flex-col justify-center items-center w-[600px] h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="inline whitespace-normal break-keep text-center">
                        {currentBook.summary && currentBook.summary[currentSentenceIndex] ? (
                          currentBook.summary[currentSentenceIndex - 1].split('*').map((part, index) => (
                            <span key={index} className={index % 2 === 1 ? 'text-orange-500' : ''}>
                              {part}
                            </span>
                          ))
                        ) : (
                          <span>내용이 없습니다.</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // 마지막 장에 책 표지 이미지
                  <div className="relative w-full h-full">
                    {/* 배경 이미지 (생성된 이미지) */}
                    <img
                      src={`http://localhost:5001/generated_images/${currentBook.image_url.split('/').pop()}`}
                      alt="background_book"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />

                    <div className="absolute inset-0 bg-white opacity-70">
                      {/* 왼쪽 절반에 책 표지 이미지 */}
                      <div className="w-1/2 h-full flex items-center justify-center">
                        <img
                          src={currentBook.book_cover}
                          alt="cover_image"
                          className="w-auto h-auto max-w-[90%] max-h-[90%] object-contain"
                        />
                      </div>

                      {/* 오른쪽 절반: 책 정보 */}
                      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
                          {currentBook.title || "제목 없음"}
                        </h1>
                        <p className="text-2xl text-gray-600 text-center">
                          {currentBook.author || "작가 미상"}
                        </p>
                      </div>
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