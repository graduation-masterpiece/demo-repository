import React, { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [currentIsbn, setCurrentIsbn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    if (!results || results.length === 0) {
        return <p className="text-gray-500">No Search Results.</p>;
    }

    const handleBookButtonClick = async (book) => {
        console.log("Selected Book: ", book);
    
        if (!book.isbn) {
            console.error("There is no ISBN: ", book);
            alert("This book has no ISBN info.");
            return;
        }
    
        setIsLoading(true);
        setIsCompleted(false);
        setCurrentIsbn(book.isbn);
        setModalContent("Creating Book Cards...");
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
                throw new Error(text || "Server returned an invalid response format.");
            }
            
            if (!response.ok) {
                throw new Error(data.message || data.error || "Server error");
            }
    	    setIsCompleted(true);
            setModalContent("Book Card has been created!");

	    if(!isModalOpen){
		setTimeout(() => setIsModalOpen(true), 100);
	    }

        } catch (error) {
            console.error("Server error: ", error);
            setModalContent(error.message || "Failed to send book information to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleNavigateToCard = () => {
        setIsModalOpen(false);
        navigate(`/book/${encodeURIComponent(currentIsbn)}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {isModalOpen && (
                <Modal 
                    message={modalContent} 
                    onClose={handleCloseModal}
                    showSpinner={isLoading}
                >
		    {!isLoading && isCompleted && (
                        <button
                            onClick={handleNavigateToCard}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            See Book Card
                        </button>
                    )}
                </Modal>
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
                        {isLoading ? "In progress..." : "Summerize"}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;