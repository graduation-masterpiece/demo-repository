import React, { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [currentIsbn, setCurrentIsbn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!results || results.length === 0) {
        return <p className="text-gray-500">검색 결과가 없습니다.</p>;
    }

    const handleBookButtonClick = async (book) => {
        console.log("선택한 책:", book);
    
        if (!book.isbn) {
            console.error("ISBN이 없습니다:", book);
            alert("ISBN 정보가 없는 책입니다.");
            return;
        }
    
        setIsLoading(true);
        setCurrentIsbn(book.isbn);
        setModalContent("카드뉴스를 생성중입니다...");
        setIsModalOpen(true);
    
        try {
            const response = await fetch("/api/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isbn: book.isbn,
                    title: book.title,
                    author: book.author,
                    publisher: book.publisher,
                    pubdate: book.pubdate,
                    description: book.description,
                    book_cover: book.image
                })
            });
    
            // 응답이 JSON인지 확인
            const contentType = response.headers.get("content-type");
            let data;
            
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || "서버에서 잘못된 형식의 응답을 반환했습니다.");
            }
            
            if (!response.ok) {
                throw new Error(data.message || data.error || "서버 전송 실패");
            }
    
            setModalContent("카드뉴스가 생성되었습니다!");
        } catch (error) {
            console.error("서버 전송 오류:", error);
            setModalContent(error.message || "서버에 책 정보를 전송하는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (!isLoading && currentIsbn) {
            navigate(`/book/${encodeURIComponent(currentIsbn)}`);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {isModalOpen && (
                <Modal 
                    message={modalContent} 
                    onClose={handleCloseModal}
                    showSpinner={isLoading}
                />
            )}
            
            {results.map((item, index) => (
                <div
                    key={index}
                    className="bg-white p-4 shadow rounded flex flex-col items-center"
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-32 h-48 object-cover mb-4"
                    />
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.author}</p>

                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        onClick={() => handleBookButtonClick(item)}
                        disabled={isLoading}
                    >
                        {isLoading ? "처리 중..." : "요약하기"}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;