import React, { useState } from "react";
import Modal from "./Modal"; // 알림 창

const SearchResults = ({ results }) => {

    const [loadingMessage, setLoadingMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(""); 


    if (!results || results.length === 0) {
        return <p className="text-gray-500">검색 결과가 없습니다.</p>;
    }

    const handleBookButtonClick = async (book) => {
        console.log("선택한 책:", book);

        // isbn이 없는 경우를 체크
        if (!book.isbn) {
        console.error("ISBN이 없습니다:", book);
        alert("ISBN 정보가 없는 책입니다.");
        return;
        }

        // 대기 중 알림 표시
        setLoadingMessage("카드뉴스를 생성중입니다.");
        setModalContent("카드뉴스를 생성중입니다.");
        setIsModalOpen(true); // 모달 열기

        
        try {
            const response = await fetch("/api/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isbn: book.isbn, // ISBN
                    title: book.title, // 책 제목
                    author: book.author, // 저자
                    publisher: book.publisher, // 출판사
                    pubdate: book.pubdate, // 출판일
                    description: book.description, // 설명
                    book_cover: book.image // 책 표지 URL
                })
            });
    
            if (response.ok) {
                setModalContent("카드뉴스가 생성되었습니다!");
            } else {
                throw new Error("서버 전송 실패");
            }
        } catch (error) {
            console.error("서버 전송 오류:", error);
            setIsModalOpen("서버에 책 정보를 전송하는 데 실패했습니다.");
        } finally{
            setTimeout(() => {
                setIsModalOpen(true); // 모달 열기
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {isModalOpen && <Modal message={modalContent} onClose={handleCloseModal} />}
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
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => handleBookButtonClick(item)}
                    >
                        요약하기
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
