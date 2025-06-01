import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import MyLibraryPage from "./components/MyLibraryPage";
import ShortBooksPage from "./components/ShortBooksPage";
import SettingsPage from "./components/SettingsPage";
import { SidebarProvider } from "./SidebarContext";
import useUTMLogger from "./components/UTMLogger.js";

function App() {
  useEffect(() => {
    console.log('Before redirection: ', window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const content = parseInt(params.get('utm_content'), 10);
    
    if (source || medium || campaign || content) {
      sessionStorage.setItem('utm_source', source || '');
      sessionStorage.setItem('utm_medium', medium || '');
      sessionStorage.setItem('utm_campaign', campaign || '');
      sessionStorage.setItem('utm_content', content || '');
      sessionStorage.setItem('utm_access_time', new Date());
    }
    
    console.log("Stored utm_source in sessionStorage: ", sessionStorage.getItem('utm_source'));

    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-5KXQCF3KEJ', {
        page_path: window.location.pathname + window.location.search,
        ...utm,
      });
      console.log('Passed UTM to GA4: ', utm);
    }
  }, []);
  
  useUTMLogger();
  
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          {/* Define the paths for MainPage and LibraryPage */}
          <Route path="/" element={<MainPage />} />
          <Route path="/MyLibrary" element={<MyLibraryPage />} />
          <Route path="/ShortBooks" element={<ShortBooksPage/>} />
          <Route path="/Settings" element={<SettingsPage/>}/>
          <Route path="/book/:id" element={<ShortBooksPage/>} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
