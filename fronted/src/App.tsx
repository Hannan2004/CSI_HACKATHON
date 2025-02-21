import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContractAnalyzer from "./components/ContractAnalyzer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/analyze" element={<ContractAnalyzer />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
