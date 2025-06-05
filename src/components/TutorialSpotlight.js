// src/components/TutorialSpotlight.js

import React, { useEffect, useState } from "react";

export default function TutorialSpotlight({
  onFinish,              // 튜토리얼 종료 콜백
  toggleSidebar,         // 사이드바 열고 닫기 함수 (부모에서 넘어옴)
  sidebarWrapperRef,     // <Sidebar> 전체 DOM 참조
  searchBarWrapperRef,   // 검색창 DOM 참조
  toggleButtonRef,       // 사이드바 토글 버튼 DOM 참조
  shortBooksItemRef,     // ShortBooks 메뉴 아이템 DOM 참조
  libraryItemRef,        // Library 메뉴 아이템 DOM 참조
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isUpdatingStep, setIsUpdatingStep] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // ───────────────────────────────────────────────────────────────
  // 단계별(type), message, 이미지, 강조할 ref를 미리 정의
  // ───────────────────────────────────────────────────────────────
  const steps = [
    {
      type: "intro",
      message: "Welcome! Let’s create your first book summary card",
      imageSrc: null,
      targetRef: null,
    },
    {
      type: "highlight",
      message: "Search by typing a book title here.",
      imageSrc: null,
      targetRef: searchBarWrapperRef,
    },
    {
      type: "highlight",
      message: "Open or close the sidebar here.",
      imageSrc: null,
      targetRef: toggleButtonRef,
    },
    {
      type: "highlight",
      message: "Click “ShortBooks” to view summarized books.",
      imageSrc: null,
      targetRef: shortBooksItemRef,
    },
    {
      type: "image",
      message: "On the ShortBooks page, scroll up/down to switch between summaries.",
      imageSrc: "/images/shortbooks-example.png",
      targetRef: null,
    },
    {
      type: "highlight",
      message: "Click “Library” to see all your saved summaries.",
      imageSrc: null,
      targetRef: libraryItemRef,
    },
    {
      type: "image",
      message: "On the Library page, all your ShortBooks appear here.",
      imageSrc: "/images/library-example.png",
      targetRef: null,
    },
  ];

  const isIntroStep     = currentStepIdx === 0;
  const isImageStep     = steps[currentStepIdx]?.type === "image";
  const isHighlightStep = steps[currentStepIdx]?.type === "highlight";

  // ───────────────────────────────────────────────────────────────
  // 이미지 단계 진입 시 페이드 인 효과를 위해 showImage 토글
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isImageStep) {
      setShowImage(false);
      requestAnimationFrame(() => setShowImage(true));
    } else {
      setShowImage(false);
    }
  }, [currentStepIdx, isImageStep]);

  // ───────────────────────────────────────────────────────────────
  // currentStepIdx 가 바뀔 때:  
  // - Highlight 단계라면 targetRect 를 업데이트  
  // - “사이드바 자동 토글 + ref 설정” 단계라면 toggleSidebar() 호출  
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isUpdatingStep || isIntroStep || isImageStep) {
      // 소개문구(0)거나, 이미지 단계(4,6)거나, 이미 업데이트 중이라면 강조영역 비우기
      setTargetRect(null);
      return;
    }

    const step = steps[currentStepIdx];
    if (!step) return;

    // 2단계(인덱스 2): 토글 버튼 강조만
    if (currentStepIdx === 2) {
      updateTargetRect();
    }
    // 3단계(인덱스 3): 사이드바 자동 열기 + ShortBooks 메뉴 ref 설정
    else if (currentStepIdx === 3) {
      setIsUpdatingStep(true);
      // ❗ 여기에 클릭 이벤트 없이 프로그램적으로 사이드바를 연다
      toggleSidebar();
      setTimeout(() => {
        // sidebarWrapperRef 안의 .sliding-sidebar 요소가 렌더링 된 후
        const slidingDiv = sidebarWrapperRef.current?.querySelector(".sliding-sidebar");
        if (slidingDiv) {
          const nav = slidingDiv.querySelector("nav");
          if (nav) {
            const links = Array.from(nav.querySelectorAll("a.menu-item"));
            const sb = links.find((el) =>
              el.textContent.trim().toLowerCase().includes("short books")
            );
            if (sb) shortBooksItemRef.current = sb;
          }
        }
        setIsUpdatingStep(false);
        updateTargetRect();
      }, 300);
    }
    // 5단계(인덱스 5): Library 메뉴 ref 설정 (사이드바가 이미 열린 상태)
    else if (currentStepIdx === 5) {
      setIsUpdatingStep(true);
      setTimeout(() => {
        const slidingDiv = sidebarWrapperRef.current?.querySelector(".sliding-sidebar");
        if (slidingDiv) {
          const nav = slidingDiv.querySelector("nav");
          if (nav) {
            const links = Array.from(nav.querySelectorAll("a.menu-item"));
            const lib = links.find((el) =>
              el.textContent.trim().toLowerCase().includes("library")
            );
            if (lib) libraryItemRef.current = lib;
          }
        }
        setIsUpdatingStep(false);
        updateTargetRect();
      }, 300);
    }
    // 그 외 Highlight 단계: 강조영역만 업데이트
    else {
      updateTargetRect();
    }
  }, [currentStepIdx]);

  // ───────────────────────────────────────────────────────────────
  // targetRef 에서 강조 대상 위치(사각형) 계산
  // ───────────────────────────────────────────────────────────────
  const updateTargetRect = () => {
    const step = steps[currentStepIdx];
    if (!step?.targetRef?.current) {
      setTargetRect(null);
      return;
    }
    const rect = step.targetRef.current.getBoundingClientRect();
    setTargetRect({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  };

  // ───────────────────────────────────────────────────────────────
  // 창 크기가 바뀔 때도 강조영역 다시 계산
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (!isUpdatingStep && isHighlightStep) {
        updateTargetRect();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStepIdx, isUpdatingStep]);

  // ───────────────────────────────────────────────────────────────
  // ESC 키 누르면 onFinish() 호출 (툴팁 내 Finish 혹은 Skip 버튼 이외의 방법으로 종료)
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFinish]);

  const stopPropagation = (e) => e.stopPropagation();
  const isLastStep = currentStepIdx === steps.length - 1;

  const goToNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  // ───────────────────────────────────────────────────────────────
  // 강조 박스 스타일 계산 (검은 레이어 바로 윗부분에 흰 테두리)
  // ───────────────────────────────────────────────────────────────
  const getHighlightStyle = () => {
    if (!targetRect) return {};
    return {
      top:    targetRect.y - 4,
      left:   targetRect.x - 4,
      width:  targetRect.width + 8,
      height: targetRect.height + 8,
      boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
    };
  };

  // ───────────────────────────────────────────────────────────────
  // 툴팁 위치 계산: 강조 대상 오른쪽 끝에 붙여서 띄우되 화면을 벗어나지 않도록
  // ───────────────────────────────────────────────────────────────
  const getTooltipStyle = () => {
    if (!targetRect) return {};
    const tooltipWidth  = 300;
    const tooltipHeight = 120;
    const margin        = 8;

    let top  = targetRect.y + targetRect.height + margin;
    let left = targetRect.x + targetRect.width - tooltipWidth;

    if (top + tooltipHeight > window.innerHeight) {
      top = targetRect.y - tooltipHeight - margin;
    }
    if (left < margin) {
      left = margin;
    }
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - margin;
    }
    return { top, left };
  };

  return (
    <div
      className="fixed inset-0 bg-transparent z-[110] flex items-center justify-center"
      style={{ pointerEvents: "none" }} 
    >
      {/* ─────────────────────────────────────────────────────────
          0단계: 소개 텍스트 (백드롭 위 중앙)
         ───────────────────────────────────────────────────────── */}
      {currentStepIdx === 0 && (
        <div
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center border-2 border-[#D4C19C]"
          onClick={stopPropagation}    
          style={{ pointerEvents: "auto" }}
        >
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-3 text-[#4A453D]">
            Welcome to Books in Shortform!
          </h2>
          <p className="text-[#7A6F5A] mb-6 text-lg">
            Search any book title and get your ShortBooks.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextStep();
            }}
            className="px-8 py-3 bg-[#B08B4F] text-white rounded-full hover:bg-[#A7763A] transition-colors text-lg font-medium shadow-md"
          >
            Let's Start
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          4단계: ShortBooks 이미지 + 설명 + Next 버튼 (페이드 인/아웃)
         ───────────────────────────────────────────────────────── */}
      {currentStepIdx === 4 && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            showImage ? "opacity-100" : "opacity-0"
          }`}
          onClick={stopPropagation}    
          style={{ pointerEvents: "auto" }}
        >
          <div
            style={{
              position: "relative",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              borderRadius: "8px",
            }}
          >
            <div className="bg-white rounded-lg overflow-hidden max-w-2xl">
              <img
                src={steps[4].imageSrc}
                alt="ShortBooks Example"
                className="w-full h-auto rounded-t-lg"
              />
              <div className="p-4">
                <p className="text-gray-900 text-center mb-4">
                  {steps[4].message}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextStep();
                  }}
                  className="mx-auto block px-6 py-2 bg-[#B08B4F] text-white rounded-full hover:bg-[#A7763A] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          6단계: Library 이미지 + 설명 + Finish 버튼 (페이드 인/아웃)
         ───────────────────────────────────────────────────────── */}
      {currentStepIdx === 6 && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            showImage ? "opacity-100" : "opacity-0"
          }`}
          onClick={stopPropagation}      
          style={{ pointerEvents: "auto" }}
        >
          <div
            style={{
              position: "relative",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              borderRadius: "8px",
            }}
          >
            <div className="bg-white rounded-lg overflow-hidden max-w-2xl">
              <img
                src={steps[6].imageSrc}
                alt="Library Example"
                className="w-full h-auto rounded-t-lg"
              />
              <div className="p-4">
                <p className="text-gray-900 text-center mb-4">
                  {steps[6].message}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFinish();
                  }}
                  className="mx-auto block px-6 py-2 bg-[#B08B4F] text-white rounded-full hover:bg-[#A7763A] transition-colors"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          강조 단계 (1, 2, 3, 5): 하이라이트 박스 + 툴팁
         ───────────────────────────────────────────────────────── */}
      {isHighlightStep && targetRect && (
        <>
          {/* 강조 박스 */}
          <div
            className="absolute border-white border-4 rounded-lg pointer-events-none"
            style={{
              ...getHighlightStyle(),
              transition: "all 0.3s ease-in-out",
              zIndex: 115,
            }}
          />

          {/* 툴팁 */}
          <div
            className="absolute bg-[#F7F1E6] p-4 rounded-lg shadow-md max-w-xs transition-opacity duration-200"
            style={{
              ...getTooltipStyle(),
              zIndex: 120,
              pointerEvents: "auto", /* 여기에만 클릭 이벤트 허용 */
            }}
            onClick={stopPropagation}
          >
            <p className="text-[#4A453D] mb-3">
              {steps[currentStepIdx]?.message}
            </p>
            <div className="text-xs text-[#7A6F5A] mb-3 text-center">
              {currentStepIdx} / {steps.length - 1}
            </div>
            <div className="flex justify-between items-center">
              {/* Skip 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFinish();
                }}
                className="px-3 py-1 rounded-md text-sm bg-[#C0A080] text-white hover:bg-[#AF9470] focus:outline-none transition-colors"
              >
                Skip
              </button>

              {/* Next 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextStep();
                }}
                className="p-2 bg-[#B08B4F] text-white rounded-full hover:bg-[#A7763A] focus:outline-none transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}