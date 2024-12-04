import React from "react";

const SearchResults = ({ results }) => {
    if (!results || results.length === 0) {
        return <p className="text-gray-500">검색 결과가 없습니다.</p>;
    }

    const handleBookButtonClick = async (book) => {
        console.log("선택한 책:", book);
        
        try {
            const response = await fetch("http://localhost:5000/book", {  // 경로 수정
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
                    description: book.description // 설명
                })
            });
    
            if (response.ok) {
                alert("책 정보가 서버로 전송되었습니다!");
            } else {
                throw new Error("서버 전송 실패");
            }
        } catch (error) {
            console.error("서버 전송 오류:", error);
            alert("서버에 책 정보를 전송하는 데 실패했습니다.");
        }
    };
    

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
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
