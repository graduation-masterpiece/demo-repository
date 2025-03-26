import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const MyLibraryCard = ({ id, title, likes, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${id}`);
  };
  // TODO URL 추가하기
  return (
    <HelmetProvider>
      <Helmet>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content="My Library Card"/>
        <meta property="og:image" content={image}/>
        <meta property="og:url" content="http://127.0.0.1:3000/book/" />
        <meta property="og:site_name" content="My Library Card"/>
        <meta property="og:locale" content="ko_KR"/>
        <meta property="og:type" content="website"/>
      </Helmet>
      <div
        className="border-[4px] border-gray-500 rounded-2xl px-3 pt-3 pb-2 bg-[#C4D0B3] space-y-3 cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative border-[2px] border-gray-500 rounded-[25px] bg-gray-700 px-3 py-3">
          <img src={image} alt={title} className="rounded-lg w-full h-[210px]" />
        </div>
        <div className="flex space-x-4 justify-between">
          <h2 className="text-center text-xl font-semibold ml-2 overflow-hidden">{title}</h2>
          <div className="flex items-center justify-center rounded-xl bg-gray-700 px-1 py-1 space-x-1">
            <div className="flex items-center justify-center bg-red-300 rounded-xl px-2 py-1 whitespace-nowrap">
              <img src="/images/trash.png" alt="trash" className="w-3 h-3 mr-1" />
              <p className="text-black text-sm">삭제</p>
            </div>
            <div className="flex items-center justify-center bg-blue-300 rounded-xl px-2 py-1 space-x-2">
              <img src="/images/like.png" alt="like" className="w-3 h-3" />
              <p className="text-black text-sm">{likes}</p>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default MyLibraryCard;