import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";


function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
    </div>
  );
}

export default App;
