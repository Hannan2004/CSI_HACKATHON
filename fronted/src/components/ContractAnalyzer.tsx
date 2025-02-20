import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ContractAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<{ key_clauses: any[], risks_detected: any[], summary: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
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
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-bold mb-4">Contract Analyzer</h2>
            
            <input type="file" onChange={handleFileChange} className="border p-2 w-full mb-4" />
            <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? "Uploading..." : "Upload & Analyze"}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {response && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Key Clauses</h3>
                    <div className="border p-3 bg-gray-100 rounded">
                        <ReactMarkdown>
                            {response.key_clauses.map((clause) => `**${clause.title}**: ${clause.description}`).join("\n\n")}
                        </ReactMarkdown>
                    </div>

                    <h3 className="text-xl font-semibold mt-4">Risks Detected</h3>
                    <div className="border p-3 bg-gray-100 rounded">
                        <ReactMarkdown>
                            {response.risks_detected.map((risk) => `**${risk.risk}**: ${risk.explanation}`).join("\n\n")}
                        </ReactMarkdown>
                    </div>

                    <h3 className="text-xl font-semibold mt-4">Summary</h3>
                    <div className="border p-3 bg-gray-100 rounded">
                        <ReactMarkdown>
                            {response.summary}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractAnalyzer;