import React from "react";

export const ImageSection = ({ results, isSearching }) => {
  if (isSearching) {
    return <div>검색 중입니다...</div>;
  }

  if (results.length > 0) {
    return (
      <div className="results-grid grid grid-cols-2 gap-4 mt-4">
        {results.map((book, index) => (
          <div key={index} className="book-card border p-2 rounded shadow">
            <img
              src={book.image} // 책 이미지 URL
              alt={book.title}
              className="w-full h-40 object-cover"
            />
            <h3 className="text-lg mt-2">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        ))}
      </div>
    );
  }

  return <div>검색 결과가 없습니다. 기본 이미지를 표시합니다.</div>;
};

