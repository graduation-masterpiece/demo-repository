// components/MainContainer.js
import React from "react";
import { ServiceName } from "./ServiceName";
import { SearchBar } from "./SearchBar";
// import { ImageSection } from "./ImageSection";
import Sidebar from "./Sidebar";

const MainPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar/>
      <div className="flex flex-col mx-[33.7em] mt-[7em] h-[700px]">
        <ServiceName />
        <SearchBar />
        <div className="border-[2.5px] border-black mt-[0.5em]"></div>
      </div>
    </div>
  );
};

export default MainPage;
