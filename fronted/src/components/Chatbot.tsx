import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const predefinedQuestions = [
  "How do I use the app?",
  "I am unable to upload a file.",
  "How is my data handled?",
  "I forgot my password.",
  "Can you analyze contracts for me?",
];

const staticResponses: { [key: string]: string } = {
  "How do I use the app?": "To analyze a legal contract, upload a PDF document using the ‘Upload PDF’ button. Once uploaded, you can ask any question about the contract, and I will provide insights, key clauses, and potential risks.",
  "I am unable to upload a file.": "If you're unable to upload a file, please check the following: Ensure the file is in PDF format. Make sure the file size does not exceed the limit. Try reloading the page and uploading again. If the issue persists, let me know the exact error message.",
  "How is my data handled?": "Your uploaded documents are processed securely and are not stored permanently. The system only uses them for analysis and deletes them after processing. We prioritize user privacy and data security.",
  "I forgot my password.": "If you’re facing login issues, try the following: Ensure you’re entering the correct email and password. If you forgot your password, click ‘Forgot Password’ to reset it. If you’re seeing an error, please share the details with me so I can assist further.",
  "Can you analyze contracts for me?": "I do not provide legal advice, but I can help you analyze the contract’s clauses, risks, and key points. If you need professional legal guidance, please consult a lawyer.",
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botResponse = staticResponses[message] || "Sorry, I don't have a response for that.";
    const botMessage = { role: "bot", text: botResponse };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="predefined-questions">
        {predefinedQuestions.map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => sendMessage(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;