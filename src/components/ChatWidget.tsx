import { useState } from "react";

const NLP_API_URL = "http://localhost:5001/chat";

interface Message {
  from: "user" | "bot";
  text: string;
}

const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot", 
      text: "Hello! I'm your waste management assistant. Ask me anything about recycling, composting, reducing waste, or environmental practices. I can provide quick tips or detailed explanations!"
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [lang, setLang] = useState<string>("en");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Function to analyze user input and determine response type
  const analyzeInput = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Keywords that suggest user wants detailed information
    const detailKeywords = ['how to', 'explain', 'what is', 'why', 'process', 'steps', 'guide', 'tutorial', 'detailed', 'comprehensive', 'complete'];
    
    // Keywords that suggest user wants quick/short responses
    const quickKeywords = ['yes', 'no', 'quick', 'briefly', 'short', 'simple', 'can i', 'is it', 'does it', 'will it'];
    
    // Question types that typically need detailed responses
    const complexQuestions = ['how do i', 'what are the steps', 'how can i', 'what should i do'];
    
    // Simple questions that need short answers
    const simpleQuestions = ['is', 'can', 'does', 'will', 'are'];
    
    const wantsDetail = detailKeywords.some(keyword => input.includes(keyword)) ||
                      complexQuestions.some(phrase => input.includes(phrase)) ||
                      input.length > 50; // Longer questions usually want detailed answers
    
    const wantsQuick = quickKeywords.some(keyword => input.includes(keyword)) ||
                      simpleQuestions.some(word => input.startsWith(word + ' ')) ||
                      (input.length < 20 && input.includes('?'));
    
    return { wantsDetail, wantsQuick };
  };

  // Enhanced prompt generation
  const generatePrompt = (userInput: string) => {
    const { wantsDetail, wantsQuick } = analyzeInput(userInput);
    
    let basePrompt = `You are an expert in waste management, recycling, composting, and environmental sustainability. Always stay focused on these topics.`;
    
    if (wantsQuick) {
      basePrompt += ` The user wants a brief, concise answer. Provide a direct response in 1-2 sentences maximum. Be helpful but keep it short.`;
    } else if (wantsDetail) {
      basePrompt += ` The user wants detailed information. Provide a comprehensive response with practical steps, examples, and actionable advice. Use bullet points or numbered lists when helpful.`;
    } else {
      // Default: moderate response
      basePrompt += ` Provide a balanced response - informative but not overwhelming. Include key points and practical tips.`;
    }
    
    // Add conversation context awareness
    if (messages.length > 2) {
      basePrompt += ` This is part of an ongoing conversation about waste management. Be consistent with previous advice.`;
    }
    
    return `${basePrompt}\n\nUser question: ${userInput}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, {from: "user", text: userMessage}]);
    setLoading(true);
    setInput("");
    
    try {
      const enhancedPrompt = generatePrompt(userMessage);
      
      const res = await fetch(NLP_API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: enhancedPrompt,
          lang
        }),
      });
      
      const data = await res.json();
      let response = data.response;
      
      // Post-process response if needed
      if (response && response.length > 500 && analyzeInput(userMessage).wantsQuick) {
        // If response is too long for a quick question, truncate intelligently
        const sentences = response.split('. ');
        response = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
      }
      
      setMessages(prev => [...prev, {from: "bot", text: response || "I'm sorry, I couldn't process that request."}]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {from: "bot", text: "Sorry, there was an error connecting to the service. Please try again."}]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 border-none cursor-pointer text-2xl shadow-lg transition-all duration-200 z-50"
        title="Open Waste Management Assistant"
      >
        {isOpen ? '✕' : '♻️'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-xl z-40">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">🌱 Eco Assistant</h3>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-green-700 text-white text-sm rounded px-2 py-1 border-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-80 overflow-y-auto p-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.from === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  msg.from === "user" 
                    ? "bg-green-600 text-white rounded-br-none" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}>
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {msg.from === "user" ? "You" : "Bot"}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="text-left mb-3">
                <div className="inline-block bg-white border border-gray-200 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">Bot is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about recycling, composting, waste reduction..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
                disabled={loading}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 self-end"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              💡 Try: "How to compost?" (detailed) or "Can I recycle glass?" (quick)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;