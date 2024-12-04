import React from "react";
import Sidebar from "./Sidebar";

const SettingsPage = () => {
  return (
    <div className="w-screen h-screen bg-[#ECE6CC] overflow-hidden mx-auto my-auto">
      <Sidebar />
      <div className="flex flex-col p-20">
        <p className="text-[50px] font-bold border-b-black border-b-[1px] ml-80 whitespace-nowrap w-fit">
          Settings
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
