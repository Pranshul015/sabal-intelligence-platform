import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatbotModalProps {
  onClose: () => void;
  darkMode?: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatbotModal({ onClose, darkMode }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Sabal, your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("scheme") || input.includes("eligible")) {
      return "Based on your profile, you're eligible for 12 schemes including PM Awas Yojana, Ayushman Bharat, and PM-KISAN. Would you like me to show you the complete list?";
    } else if (input.includes("document") || input.includes("upload")) {
      return "You can upload documents in the 'My Documents' section. We accept Aadhaar, PAN, income certificates, and more. All uploads are secured with bank-grade encryption.";
    } else if (input.includes("apply") || input.includes("application")) {
      return "To apply for a scheme, first ensure your profile is complete and all required documents are uploaded. Then navigate to the scheme page and click 'Apply Now'. I can guide you through the process!";
    } else if (input.includes("status") || input.includes("track")) {
      return "You currently have 2 pending applications. PM-KISAN application is under review, and Ayushman Bharat application is awaiting document verification. Would you like more details?";
    } else {
      return "I can help you with scheme eligibility, document upload, application tracking, and general queries. What would you like to know more about?";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white">Sabal AI Assistant</h3>
              <p className="text-green-600 dark:text-green-400 text-xs">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={message.sender === "bot" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" : "bg-blue-600 text-white"}>
                  {message.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} max-w-[70%]`}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setInputMessage("Which schemes am I eligible for?")}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Check eligibility
            </button>
            <button
              onClick={() => setInputMessage("How do I upload documents?")}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Upload documents
            </button>
            <button
              onClick={() => setInputMessage("Track my application status")}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Track status
            </button>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}