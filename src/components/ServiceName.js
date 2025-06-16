import React, { useState, useEffect } from "react";

const FONT_FAMILY = "'Lora', cursive";
const TEXT = "Books In Shortform";

export const ServiceName = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < TEXT.length) {
      const timer = setTimeout(() => {
        setVisibleCount(visibleCount + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div className="w-full flex flex-col items-center">
      <h1
        className={`
          text-[28px] sm:text-[36px] md:text-[48px] lg:text-[72px] font-thin text-[#1B1B1B]
          tracking-tight text-center transition-all duration-300 select-none
        `}
        style={{
          fontFamily: FONT_FAMILY,
          letterSpacing: "0.01em",
          fontWeight: 400, 
        }}
      >
        {TEXT.split("").map((char, idx) => (
          <span
            key={idx}
            className={`
              inline-block transition-all duration-200
              ${visibleCount > idx
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"}
            `}
            style={{ transitionDelay: `${idx * 0.03}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <div
        className={`
          border-b-4 border-[#1B1B1B] mt-2 transition-all duration-700
          ${visibleCount === TEXT.length ? "w-[320px]" : "w-0"}
        `}
      ></div>
    </div>
  );
};