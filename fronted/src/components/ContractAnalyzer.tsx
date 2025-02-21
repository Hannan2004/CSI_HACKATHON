import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FileText, AlertCircle, Loader } from 'lucide-react';
import './contract.css';

interface AnalysisResponse {
  key_clauses: Array<{ title: string; description: string }>;
  risks_detected: Array<{ risk: string; explanation: string }>;
  summary: string;
}

const ContractAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("contract", file);

    try {
      const { data } = await axios.post("http://localhost:5000/analyse-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResponse(data.review);
    } catch (err) {
      setError("Error analyzing document. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contract-analyzer">
      <div className="contract-header">
        <h2><FileText className="inline-icon" /> Contract Analyzer</h2>
        
        <div className="file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="file-input"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="upload-button"
          >
            {loading ? (
              <>
                <Loader className="inline-icon spin" />
                Analyzing
                <span className="loading-dots">...</span>
              </>
            ) : (
              'Upload & Analyze'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle className="inline-icon" /> {error}
        </div>
      )}

      <div className="content-container">
        <ReactMarkdown>
            {response}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ContractAnalyzer;