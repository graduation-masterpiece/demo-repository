import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [currentIsbn, setCurrentIsbn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [renderedItems, setRenderedItems] = useState([]);

  // 결과가 변경될 때마다 애니메이션 효과를 위한 지연 렌더링
  useEffect(() => {
    if (!results || results.length === 0) {
      setRenderedItems([]);
      return;
    }
    setRenderedItems(results);
  }, [results]);

  if (!results || results.length === 0) {
    return <p className="text-gray-500">No Search Results.</p>;
  }

  const handleBookButtonClick = async (book) => {
    console.log("Selected Book: ", book);

    if (!book.isbn) {
      alert("This book has no ISBN info.");
      return;
    }

    setIsLoading(true);
    setIsCompleted(false);
    setCurrentIsbn(book.isbn);
    setModalContent("Processing your request...");
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

      const contentType = response.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Server returned an invalid response format.");
      }

      if (data && data.alreadyExists) {
        setModalContent("📚 This book already exists!");
      } else if (response.ok) {
        setModalContent("✅ Book Card has been created successfully!");
      } else {
        throw new Error(data?.message || data?.error || "Server error");
      }

      setIsCompleted(true);

    } catch (error) {
      setModalContent(error.message || "Failed to send book information to the server.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(true); // 모달은 항상 열리도록 보장
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-3">
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

      {renderedItems.map((item, index) => (
        <div
          key={index}
          className="bg-white p-2 shadow rounded flex flex-col items-center transform transition-all duration-300 opacity-0 translate-y-8 animate-fadeIn"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-24 h-36 object-cover mb-4"
          />
          <h3 className="font-bold text-base mb-2">{item.title}</h3>
          <p className="text-xs text-gray-600 mb-4">{item.author}</p>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={() => handleBookButtonClick(item)}
            disabled={isLoading}
          >
            {isLoading ? "In progress..." : "Summarize"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
