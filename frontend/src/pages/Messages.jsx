import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaVideo, FaPhone, FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socketService from '../services/socket';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socketService.connect(user.id);
    loadConversations();

    // Listen for incoming messages
    socketService.onReceiveMessage((message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicator
    socketService.onUserTyping((data) => {
      if (data.sender !== user.id) {
        setTypingUser(data.sender);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    // If coming from listing details with receiver info
    if (location.state?.receiverId) {
      loadConversationWithUser(location.state.receiverId);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationWithUser = async (userId) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      setMessages(response.data.messages || []);
      setSelectedConversation(userId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.post('/messages', {
        receiver: selectedConversation,
        content: newMessage,
        listing: location.state?.listingId
      });

      setMessages([...messages, response.data.message]);
      setNewMessage('');
      scrollToBottom();

      // Emit socket event
      socketService.sendMessage(response.data.message);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (selectedConversation) {
      socketService.emitTyping({
        sender: user.id,
        receiver: selectedConversation
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherUser = (conversation) => {
    const message = conversation.lastMessage;
    return message.sender._id === user.id ? message.receiver : message.sender;
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <FaHome className="text-3xl text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">RoomEase</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <h3 className="px-4 py-3 font-bold text-gray-900">Conversations</h3>
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                return (
                  <div
                    key={conv._id}
                    onClick={() => loadConversationWithUser(otherUser._id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b ${
                      selectedConversation === otherUser._id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {otherUser.profilePicture ? (
                          <img
                            src={otherUser.profilePicture}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-600">
                            {otherUser.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{otherUser.name}</h4>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="px-4 py-8 text-center text-gray-500">No conversations yet</p>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        {selectedConversation ? (
          <main className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-bold text-gray-600">
                    {messages[0]?.receiver?.name?.charAt(0) || messages[0]?.sender?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {messages[0]?.receiver?._id === user.id 
                      ? messages[0]?.sender?.name 
                      : messages[0]?.receiver?.name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {location.state?.listingId ? 'Room In Bellandur' : 'Active'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <FaVideo className="text-gray-600" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <FaPhone className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender._id === user.id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-teal-700 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {typingUser && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-none">
                    <p className="text-sm text-gray-500 italic">Gourav is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <FaSmile className="text-gray-600" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaPhone className="text-xl" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-teal-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-2">Socket connected</p>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
