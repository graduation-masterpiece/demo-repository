import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import LibraryPage from "./components/LibraryPage";
import FavoritePage from "./components/FavoritePage";
import SettingsPage from "./components/SettingsPage";
import SummaryPage from "./components/SummaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define the paths for MainPage and LibraryPage */}
        <Route path="/" element={<MainPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/Favorite" element={<FavoritePage/>} />
        <Route path="/Settings" element={<SettingsPage/>}/>
        <Route path="/Summary" element={<SummaryPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
