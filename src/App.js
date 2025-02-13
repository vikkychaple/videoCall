import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VideoCall from "./components/VideoCall";
import Home from "./components/Home";
import CustomNavbar from "./components/Navbar";
import "./App.css";
function App() {
    return (
        <Router>
        <CustomNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<VideoCall />} />
                {/* Redirect unknown routes to Home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;

