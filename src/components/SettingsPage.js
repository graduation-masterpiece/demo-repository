import React from "react";
import Sidebar from "./Sidebar";



const SettingsPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col w-[1200px] h-[770px] mx-[18em] mt-[4.5em]">
        <p className="text-[50px] font-bold border-b-gray-800 border-b-[6px] px-4">
         Settings
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
