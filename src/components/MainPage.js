// components/MainContainer.js
import React from "react";
import { ServiceName } from "./ServiceName";
import { SearchBar } from "./SearchBar";
import { ImageSection } from "./ImageSection";
import Sidebar from "./Sidebar";

const MainPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar/>
      <div className="flex flex-col justify-center items-center text-center">
        <ServiceName />
        <SearchBar />
        <ImageSection />
      </div>
    </div>
  );
};

export default MainPage;
