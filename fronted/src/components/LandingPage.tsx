import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import Chatbot from "./Chatbot";
import "./landing-page.css";

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Ensure proper height on mobile devices
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1>
          <FileText className="inline-icon" />
          AI-Powered Legal Contract Analyzer
        </h1>
        <p>
          Transform complex legal documents into clear insights. Our AI-powered platform helps you analyze contracts,
          extract key clauses, identify potential risks, and get summaries in simple terms - all in seconds.
        </p>
      </div>
      <div className="landing-buttons">
        <Link to="/login" className="landing-button">
          Get Started
        </Link>
        <Link to="/signup" className="landing-button">
          Try Demo
        </Link>
      </div>

      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
};

export default LandingPage;