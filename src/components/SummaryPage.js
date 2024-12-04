import React from "react";
import Sidebar from "./Sidebar";

const SummaryPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col p-20">
        <p className="text-[50px] font-bold border-b-black border-b-[1px] ml-80 whitespace-nowrap w-fit">
          [책이름]
        </p>

        <div className="w-[1200px] h-[700px] border-black border-[1px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 bg-gray-200 rounded-2xl p-10 flex">
          {/* 사진 */}
          <div className="w-1/2 h-full border-black border-[1px] flex justify-center items-center overflow-hidden">
            [사진]
          </div>
          {/* 글 */}
          <div className="w-1/2 h-full border-black border-[1px] flex justify-center items-center overflow-hidden">
            [글]
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
