import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import MyLibraryPage from "./components/MyLibraryPage";
import ShortBooksPage from "./components/ShortBooksPage";
import SettingsPage from "./components/SettingsPage";
import SummaryPage from "./components/SummaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define the paths for MainPage and LibraryPage */}
        <Route path="/" element={<MainPage />} />
        <Route path="/MyLibrary" element={<MyLibraryPage />} />
        <Route path="/ShortBooks" element={<ShortBooksPage/>} />
        <Route path="/Settings" element={<SettingsPage/>}/>
        <Route path="/Summary" element={<SummaryPage/>}/>
        <Route path="/book/:id" element={<ShortBooksPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
