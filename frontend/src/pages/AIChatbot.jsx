import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AIChatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [quickOptions] = useState([
    'Refund policy',
    'Room amenities',
    'Booking process',
    'Pricing details',
    'Verification steps'
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickOption = (option) => {
    handleSendMessage(option);
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (input) => {
    if (input.includes('refund') || input.includes('policy')) {
      return 'Our refund policy allows cancellations up to 48 hours before check-in for a full refund. After that, a 50% refund is available up to 24 hours before check-in. No refunds are provided for cancellations made less than 24 hours before check-in.';
    } else if (input.includes('amenities') || input.includes('amenity')) {
      return 'Most of our properties include basic amenities like Wi-Fi, bed, wardrobe, and access to common areas. Premium properties may include AC, TV, attached bathroom, and more. You can filter by amenities when searching for rooms.';
    } else if (input.includes('booking') || input.includes('book')) {
      return 'To book a room: 1) Browse listings and select a property, 2) Click "View Details" to see full information, 3) Contact the owner through our messaging system, 4) Once agreed, make the payment through our secure platform. You\'ll receive a confirmation email immediately.';
    } else if (input.includes('price') || input.includes('pricing') || input.includes('cost')) {
      return 'Prices vary based on location, amenities, and room type. Single rooms typically range from ₹5,000-₹15,000/month, while shared accommodations are more affordable at ₹3,000-₹8,000/month. PG accommodations usually include meals and range from ₹8,000-₹20,000/month.';
    } else if (input.includes('verification') || input.includes('verify')) {
      return 'Verification process: 1) Upload a valid government ID (Aadhar/PAN/Passport), 2) Provide your contact details, 3) Our team reviews your documents within 24 hours, 4) Once verified, you can start booking rooms. This ensures safety for both tenants and owners.';
    } else if (input.includes('payment')) {
      return 'We accept all major credit/debit cards, UPI, and net banking. All payments are processed securely through our encrypted payment gateway. Monthly rent is due on the 1st of each month.';
    } else {
      return 'I\'m here to help! You can ask me about our refund policy, room amenities, booking process, pricing details, or verification steps. Is there something specific you\'d like to know?';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <FaHome className="text-2xl text-slate-900" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">RoomEase AI Assistant</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col bg-white shadow-lg">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <FaRobot className="text-2xl text-teal-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Chatbot</h2>
              <p className="text-sm text-white/80">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.type === 'user'
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                } rounded-2xl px-4 py-3 ${
                  message.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Options */}
        {messages.length <= 2 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick options:</p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickOption(option)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-teal-700 hover:text-white hover:border-teal-700 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-teal-700 text-white p-3 rounded-full hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane className="text-xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
