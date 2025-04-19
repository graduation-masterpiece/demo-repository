import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const MyLibraryCard = ({ id, title, likes, image }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(likes);

  const handleClick = () => {
    navigate(`/book/${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`${title}을(를) 정말 삭제하시겠습니까?`)) {
      try {
        const response = await fetch(`http://localhost:5001/api/book/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('책이 성공적으로 삭제되었습니다.');
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`삭제 실패: ${errorData.error}`);
        }
      } catch (error) {
        console.error('삭제 요청 중 오류 발생:', error);
        alert('서버 오류로 인해 삭제할 수 없습니다.');
      }
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5001/api/book/${id}/like`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || '이미 좋아요를 눌렀습니다');
        return;
      }
      setLikeCount(data.likes);
    } catch (error) {
      console.error('좋아요 요청 실패:', error);
      alert('서버 연결 실패');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content="My Library Card" />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={`http://15.164.227.43/book/${id}`} />
        <meta property="og:site_name" content="My Library Card" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div
        className="bg-[#C4D0B3] border-4 border-gray-500 rounded-2xl flex flex-col items-center justify-between p-3 cursor-pointer w-full max-w-xs"
        onClick={handleClick}
        style={{ boxSizing: "border-box", minWidth: 0 }}
      >
        {/* 이미지 영역: 세로 비율 살짝 줄임 */}
        <div className="w-full aspect-[4/3] bg-gray-700 border-2 border-gray-500 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        {/* 제목 영역 (2줄, 왼쪽정렬, 말줄임, 줄간격 넓힘) */}
        <div className="w-full min-h-[48px] flex items-start">
          <h2
            className="text-xl font-semibold text-left leading-[1.4] break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-all",
            }}
          >
            {title}
          </h2>
        </div>
        {/* 버튼 영역 */}
        <div className="w-full flex justify-end mt-2">
          <div className="flex gap-1">
            {/* 삭제 버튼 */}
            <button
              className="flex items-center bg-red-200 hover:bg-red-300 rounded-xl px-3 py-1 text-black text-sm font-medium border border-red-300"
              onClick={handleDelete}
              style={{ minWidth: "60px" }}
            >
              <img src="/images/trash.png" alt="trash" className="w-4 h-4 mr-1" />
              삭제
            </button>
            {/* 좋아요 버튼 (손 이미지) */}
            <button
              className="flex items-center bg-blue-200 hover:bg-blue-300 rounded-xl px-3 py-1 text-black text-sm font-medium border border-blue-300"
              onClick={handleLike}
              style={{ minWidth: "60px" }}
            >
              <img src="/images/like.png" alt="like" className="w-4 h-4 mr-1" />
              {likeCount}
            </button>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default MyLibraryCard;
