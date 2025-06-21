
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your SmartBin Assistant. Need help using the dashboard?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedResponses = [
    "You can track bin fill levels on the dashboard in real-time!",
    "Use the camera page to classify your waste as biodegradable or non-biodegradable.",
    "Check the analytics page to see waste trends and predictions.",
    "The dashboard shows battery levels and estimated time until bins are full.",
    "You can toggle auto-refresh on the dashboard for live updates.",
    "History page shows all past bin fill events with timestamps.",
    "Green means safe (<60%), yellow is warning (60-90%), red means alert (>90%).",
    "The system sends alerts when bins exceed 90% capacity.",
    "You can export analytics data as CSV or PDF files.",
    "AI predictions help estimate when bins will be full next."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('dashboard')) {
      return "You can track bin fill levels on the dashboard in real-time! The dashboard shows current fill percentages, battery levels, and estimated time until full.";
    }
    if (lowerMessage.includes('camera') || lowerMessage.includes('classify')) {
      return "Use the camera page to classify your waste as biodegradable or non-biodegradable. Just point your camera at the waste item and get instant AI classification!";
    }
    if (lowerMessage.includes('analytics') || lowerMessage.includes('chart')) {
      return "Check the analytics page to see waste trends, predictions, and detailed charts. You can also export data as CSV or PDF files.";
    }
    if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
      return "The system sends alerts when bins exceed 90% capacity. You can toggle alerts on/off from the dashboard controls.";
    }
    if (lowerMessage.includes('battery')) {
      return "Battery levels are displayed on each bin card. Low battery alerts are sent when levels drop below 20%.";
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I can help you navigate SmartBin! Ask me about the dashboard, camera classifier, analytics, or any specific features.";
    }
    
    // Return random response if no specific match
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getRandomResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg p-4">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Bot size={16} />
                <span>SmartBin Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
                aria-label="Close chat"
              >
                <X size={14} />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!message.isUser && (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[200px] p-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.isUser && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-green-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t p-3 bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm"
                  aria-label="Chat message input"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-3"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg z-50 ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
        }`}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </Button>
    </>
  );
};

export default ChatWidget;
