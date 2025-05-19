// React 훅(useEffect, useState 등)과 라우터(useParams) 불러오기
// 사이드바 컨텍스트(useSidebar)와 Axios HTTP 클라이언트 불러오기
import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "./Sidebar"
import ErrorReportModal from "./ErrorReportModal"
import axios from "axios"
import { useSidebar } from "../SidebarContext"

const ShortBooksPage = () => {
  // ShortBooks 페이지 컴포넌트
  // 책 요약(Short Books) 뷰어 역할
  const { id } = useParams()
  const [shortBooks, setShortBooks] = useState([])
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [pageTransition, setPageTransition] = useState(false)
  const { isVisible: sidebarVisible } = useSidebar()
  const contentRef = useRef(null)

  // 사이드바 노출 여부에 따라 메인 콘텐츠 마진 조정
  useEffect(() => {
    if (!contentRef.current) return

    if (sidebarVisible) {
      contentRef.current.style.marginLeft = "270px"
      contentRef.current.style.width = "calc(100% - 270px)"
    } else {
      contentRef.current.style.marginLeft = "0"
      contentRef.current.style.width = "100%"
    }
  }, [sidebarVisible])

  // 페이지 전환 시 텍스트 페이드 효과를 위한 상태 및 함수
  const animateAndChange = (updateFn) => {
    setPageTransition(true)
    setTimeout(() => {
      updateFn()
      setPageTransition(false)
    }, 300)
  }

  // 이전 페이지(또는 이전 문장/책)로 이동
  const handlePrePage = useCallback(() => {
    animateAndChange(() => {
      const currentBook = shortBooks[currentBookIndex]
      if (!currentBook?.summary) return

      if (currentSentenceIndex > 0) {
        setCurrentSentenceIndex((prev) => prev - 1)
      } else if (currentBookIndex > 0) {
        setCurrentBookIndex((prev) => prev - 1)
        setCurrentSentenceIndex(0)
      }
    })
  }, [shortBooks, currentBookIndex, currentSentenceIndex])

  // 다음 페이지(또는 다음 문장/책)로 이동
  const handleNextPage = useCallback(() => {
    animateAndChange(() => {
      const currentBook = shortBooks[currentBookIndex]
      if (!currentBook?.summary) return

      if (currentSentenceIndex < currentBook.summary.length + 1) {
        setCurrentSentenceIndex((prev) => prev + 1)
      } else if (currentBookIndex < shortBooks.length - 1) {
        setCurrentBookIndex((prev) => prev + 1)
        setCurrentSentenceIndex(0)
      }
    })
  }, [shortBooks, currentBookIndex, currentSentenceIndex])

  // 서버에서 책 카드 데이터(fetch) 로드
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = id ? `/api/book/${id}` : "/api/book-cards";
        const response = await axios.get(url);
        setShortBooks(Array.isArray(response.data) ? response.data : [response.data]);
        setCurrentBookIndex(0);
        setCurrentSentenceIndex(0);
      } catch (error) {
        console.error("An error has occurred during loading the book data: ", error);
      }
    };

    fetchBooks();
  }, [id]);


  // 마우스 휠로 페이지(책) 이동 기능(디바운스 적용)
  const debounceTimeout = useRef(null)
  const timeoutTime = 300

  useEffect(() => {
    const wheelHandler = (event) => {
      if (debounceTimeout.current) {
        return
      }

      setShortBooks((prevBooks) => {
        setCurrentBookIndex((prevIndex) => {
          if (event.deltaY > 0 && prevIndex < prevBooks.length - 1) {
            setCurrentSentenceIndex(0)
            return prevIndex + 1
          } else if (event.deltaY < 0 && prevIndex > 0) {
            setCurrentSentenceIndex(0)
            return prevIndex - 1
          } else return prevIndex
        })
        return prevBooks
      })

      debounceTimeout.current = setTimeout(() => {
        debounceTimeout.current = null
      }, timeoutTime)
    }

    window.addEventListener("wheel", wheelHandler)

    return () => {
      window.removeEventListener("wheel", wheelHandler)
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = null
      }
    }
  }, [])

  const currentBook = shortBooks[currentBookIndex]

  // 현재 책 공유 URL을 클립보드에 복사
  const handleLinkShare = async () => {
    try {
      const url = new URL(`https://bookcard.site/meta/book/${currentBook.id}`)
     
      url.searchParams.set('utm_source', 'internal_share')
      url.searchParams.set('utm_medium', 'share')
      url.searchParams.set('utm_campaign', 'share_button')

      const shareURL = url.toString()
      
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareURL)
        alert("URL has been copied.")
      } else {
        const tempInput = document.createElement("input")
        tempInput.value = shareURL
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand("copy")
        document.body.removeChild(tempInput)
        alert("URL has been copied.")
      }
    } catch (err) {
      console.error("Share URL copy failed: ", err)
    }
  }

  // 에러 신고 모달 표시 및 데이터 전송 처리
  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleErrorReportSubmit = async (selectedError) => {
    try {
      await axios.post("/api/error-report", {
        book_info_id: currentBook.id,
        error_type: selectedError,
        report_time: new Date().toISOString(),
      })
      alert("Error report completed.")
      setShowErrorModal(false)
    } catch (error) {
      console.error("Error report failed: ", error)
      alert("An error has occurred during the error reporting.")
    }
  }

  const handleErrorReport = () => {
    setShowErrorModal(true)
  }

  return (
    // 전체 페이지 레이아웃(wrapper) 및 폰트 설정
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden font-['Montserrat']">
      {/* 에러 신고 모달 컴포넌트 */}
      {showErrorModal && (
        <ErrorReportModal onClose={() => setShowErrorModal(false)} onSubmit={handleErrorReportSubmit} />
      )}

      {/* 사이드바 컴포넌트 렌더링 */}
      <Sidebar />

      {/* 사이드바 노출에 따른 메인 콘텐츠 영역 */}
      <div
        ref={contentRef}
        className="transition-all duration-300 h-screen overflow-y-auto"
        style={{
          marginLeft: sidebarVisible ? "270px" : "0",
          width: sidebarVisible ? "calc(100% - 270px)" : "100%",
        }}
      >
        <div
          className={`flex flex-col items-start h-full max-w-7xl mx-auto px-8 py-12 transition-all duration-300 ${
            !sidebarVisible ? "ml-auto mr-auto" : ""
          }`}
        >
          {/* 페이지 제목 영역 */}
          <h1 className="text-[48px] font-normal text-[#1B1B1B] text-left mb-10 relative">
            Short Books
            <div className="w-[500px] h-[2px] bg-[#1B1B1B] absolute bottom-[-10px] left-0"></div>
          </h1>

          {/* 카드 뷰어 중앙 정렬 영역 */}
          <div className="flex-1 flex items-center justify-center w-full">
            {/* Content viewer with minimalist styling */}
            <div className="relative mx-auto w-full max-w-4xl">
              {/* Content area */}
              <div className="w-full aspect-[4/3] bg-[#D9D9D9] rounded-lg overflow-hidden shadow-sm">
                {currentBook && (
                  <div className="relative w-full h-full">
                    {/* First page: book image */}
                    {currentSentenceIndex === 0 ? (
                      <img
                        src={currentBook.image_url || "/placeholder.svg"}
                        alt="Book"
                        className="w-full h-full object-cover"
                      />
                    ) : currentSentenceIndex <= currentBook.summary.length ? (
                      <>
                        {/* 요약 문장 페이지: 배경 이미지 위에 반투명 오버레이와 텍스트 */}
                        <div className="absolute inset-0">
                          <img
                            src={currentBook.image_url || "/placeholder.svg"}
                            alt="Book background"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center p-10">
                            <div
                              className={`
                                max-w-[80%] text-center text-black text-3xl md:text-4xl font-semibold drop-shadow-md
                                transition-opacity duration-500 ease-in-out
                                ${pageTransition ? "opacity-0" : "opacity-100"}
                              `}
                              style={{
                                wordBreak: "keep-all",    // 단어 줄바꿈 방지 (한글)
                                overflowWrap: "break-word", // 단어가 너무 길면 줄바꿈
                                lineHeight: "1.8",        // 줄 간격 늘리기
                                whiteSpace: "pre-line"    // 줄바꿈 문자 유지
                              }}
                            >
                              {currentBook.summary[currentSentenceIndex - 1]?.split("*").map((part, index) => (
                                <span key={index} className={index % 2 === 1 ? "text-orange-500 font-medium" : ""}>
                                  {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // 마지막 페이지: 요약 페이지와 동일한 배경 및 오버레이 처리
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0">
                          {/* 배경 이미지 */}
                          <img
                            src={currentBook.image_url || "/placeholder.svg"}
                            alt="Book background"
                            className="w-full h-full object-cover"
                          />
                          {/* 반투명 오버레이 + 콘텐츠 */}
                          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center p-10">
                            {/* 커버와 메타 정보 레이아웃 */}
                            <div className="flex w-full h-full">
                              <div className="w-1/2 h-full flex items-center justify-center">
                                <img
                                  src={currentBook.book_cover || "/placeholder.svg"}
                                  alt="Book cover"
                                  className="w-auto h-auto max-w-[90%] max-h-[90%] object-contain shadow-sm"
                                />
                              </div>
                              <div className="w-1/2 h-full flex flex-col items-center justify-center">
                                <h1 className="text-2xl md:text-3xl font-medium mb-6 text-center text-black">
                                  {currentBook.title || "No Title"}
                                </h1>
                                <p className="text-xl md:text-2xl text-center text-[#333333]">
                                  {currentBook.author || "Writer Unknown"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 책 카드 내비게이션 버튼(이전, 다음) */}
              <button
                onClick={handlePrePage}
                className="absolute left-[-80px] top-1/2 transform -translate-y-1/2 p-2 flex items-center justify-center bg-transparent hover:bg-transparent transition duration-200 text-[#333333] hover:scale-110 transition-transform duration-200 ease-in-out"
                aria-label="Previous page"
              >
                <span className="text-7xl font-light">«</span>
              </button>

              <button
                onClick={handleNextPage}
                className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 p-2 flex items-center justify-center bg-transparent hover:bg-transparent transition duration-200 text-[#333333] hover:scale-110 transition-transform duration-200 ease-in-out"
                aria-label="Next page"
              >
                <span className="text-7xl font-light">»</span>
              </button>

              {/* 카드 액션 버튼(공유, 오류 신고) */}
              <div className="absolute right-[-70px] bottom-0 flex flex-col space-y-4">
                <button
                  onClick={handleLinkShare}
                  className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-transparent transition-transform duration-200 text-[#333333] hover:scale-110"
                  aria-label="Share"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>

                <button
                  onClick={handleErrorReport}
                  className="w-10 h-10 flex items-center justify-center bg-transparent hover:bg-transparent transition-transform duration-200 text-[#333333] hover:scale-110"
                  aria-label="Report error"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShortBooksPage
