// MyLibraryCard 컴포넌트: 내 라이브러리의 개별 도서 카드 표시

// React 훅(useState)과 라우터 훅(useNavigate) 불러오기
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const MyLibraryCard = ({ id, title, likes, image }) => {
  // 카드 클릭 시 상세 페이지로 이동 처리
  const navigate = useNavigate()
  const [likeCount, setLikeCount] = useState(likes)
  const [isHovered, setIsHovered] = useState(false)

  // 함수: 카드 클릭 핸들러 (도서 상세로 이동)
  const handleClick = () => {
    gtag('event', 'select_content', {
      content_type: 'book_card',
      item_id: id,
      item_name: title
    })
    
    navigate(`/book/${id}`)
  }

  // 함수: 삭제 버튼 클릭 시 도서 삭제 요청 및 UI 갱신
  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        const response = await fetch(`/api/book/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          alert("The book has been successfully deleted.")
          window.location.reload()
        } else {
          const errorData = await response.json()
          alert(`Deletion Failed: ${errorData.error}`)
        }
      } catch (error) {
        console.error("An error has occurred during deletion request: ", error)
        alert("Cannot delete due to server error.")
      }
    }
  }

  // 함수: 좋아요 버튼 클릭 시 좋아요 수 서버 업데이트
  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/book/${id}/like`, {
        method: "PATCH",
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error || "You have already liked this book.")
        return
      }
      setLikeCount(data.likes || likeCount + 1)
    } catch (error) {
      console.error("Like request failed: ", error)
      alert("Server connection failed.")
    }
  }

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 책 표지 이미지 영역 (호버 시 확대 효과) */}
      <div className="relative aspect-[5/6] overflow-hidden bg-[#2c3e50]">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* 호버 시 나타나는 오버레이 (아이콘 등 표시 제거함) */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
        </div>
      </div>

      {/* 도서 정보(제목, 액션 버튼) 영역 */}
      <div className="p-4">
        <h3 className="text-[#1B1B1B] text-lg font-medium mb-3 line-clamp-1">{title}</h3>

        {/* 액션 버튼(삭제, 좋아요) */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="flex items-center text-[#E53E3E] text-sm hover:text-[#C53030] transition-colors"
            aria-label="Delete book"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Delete
          </button>

          <button
            onClick={handleLike}
            className="flex items-center text-[#3182CE] text-sm hover:text-[#2B6CB0] transition-colors"
            aria-label="Like book"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {likeCount}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyLibraryCard
