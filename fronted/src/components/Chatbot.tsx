import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import './chatbot.css';

// Extended predefined questions and responses
const predefinedQuestions = [
  "How do I use the app?",
  "I am unable to upload a file.",
  "How is my data handled?",
  "I forgot my password.",
  "Can you analyze contracts for me?",
  "What file formats are supported?",
  "Is there a file size limit?",
  "How secure is the platform?",
  "Do you offer bulk analysis?",
  "What languages are supported?"
];

const staticResponses: { [key: string]: string } = {
  "How do I use the app?": "To analyze a legal contract, upload a PDF document using the 'Upload PDF' button. Once uploaded, you can ask any question about the contract, and I will provide insights, key clauses, and potential risks.",
  "I am unable to upload a file.": "If you're unable to upload a file, please check the following: Ensure the file is in PDF format. Make sure the file size does not exceed the limit. Try reloading the page and uploading again. If the issue persists, let me know the exact error message.",
  "How is my data handled?": "Your uploaded documents are processed securely and are not stored permanently. The system only uses them for analysis and deletes them after processing. We prioritize user privacy and data security.",
  "I forgot my password.": "If you're facing login issues, try the following: Ensure you're entering the correct email and password. If you forgot your password, click 'Forgot Password' to reset it. If you're seeing an error, please share the details with me so I can assist further.",
  "Can you analyze contracts for me?": "I do not provide legal advice, but I can help you analyze the contract's clauses, risks, and key points. If you need professional legal guidance, please consult a lawyer.",
  "What file formats are supported?": "Currently, we support PDF files for contract analysis. We're working on adding support for DOC, DOCX, and other formats in future updates.",
  "Is there a file size limit?": "Yes, the maximum file size limit is 10MB per document. If your file is larger, please try compressing it or contact our support team for assistance.",
  "How secure is the platform?": "We employ industry-standard encryption protocols and security measures. All data transmission is encrypted, and we regularly perform security audits to ensure your data remains protected.",
  "Do you offer bulk analysis?": "Yes, enterprise users can analyze multiple contracts simultaneously. Contact our sales team for more information about bulk analysis features.",
  "What languages are supported?": "We currently support English, Spanish, French, and German. More languages will be added based on user demand."
};

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        text: staticResponses[inputText] || "I'm not sure about that. Could you please rephrase your question or choose from the suggested questions below?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputText('');
  };

  const handleQuestionClick = (question: string) => {
    setInputText(question);
    const userMessage: Message = {
      text: question,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        text: staticResponses[question],
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Bot size={24} />
        <h1>AI Support Assistant</h1>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isBot ? 'bot' : 'user'}`}
          >
            <div className="message-icon">
              {message.isBot ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="suggested-questions">
        <h3>Suggested Questions</h3>
        <div className="questions-grid">
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="question-button"
            >
              <MessageCircle size={16} />
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend} className="send-button">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;