import React from "react";
import { Link } from "react-router-dom";
import { FileText } from 'lucide-react';
import './landingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1><FileText className="inline-icon" /> AI-Powered Legal Contract Analyzer</h1>
        <p>Analyze your legal contracts with the power of AI. Extract key clauses, identify potential risks, and get a summary in simple terms.</p>
      </div>
      <div className="landing-buttons">
        <Link to="/login" className="landing-button">Login</Link>
        <Link to="/signup" className="landing-button">Signup</Link>
      </div>
    </div>
  );
};

export default LandingPage;