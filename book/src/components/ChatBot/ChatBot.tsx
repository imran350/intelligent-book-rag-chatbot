import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

interface ChatBotProps {
  apiUrl?: string;
  userId?: string;
  onPersonalize?: () => void;
  onTranslate?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  apiUrl = 'http://localhost:8000',
  userId,
  onPersonalize,
  onTranslate,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showPersonalizeBtn, setShowPersonalizeBtn] = useState(!!userId);
  const [showTranslateBtn, setShowTranslateBtn] = useState(!!userId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Detect selected text
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText.length > 0) {
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    return () => document.removeEventListener('mouseup', handleSelectionChange);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: input,
        user_id: userId,
        selected_text: selectedText || undefined,
        conversation_history: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        sources: response.data.sources,
        timestamp: response.data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedText('');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalize = () => {
    if (onPersonalize) {
      onPersonalize();
    }
  };

  const handleTranslate = async () => {
    if (!selectedText) {
      alert('Please select text to translate');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/translate`, {
        text: selectedText,
        target_language: 'urdu',
      });

      const translationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Translation to Urdu:\n\n${response.data.translated}`,
        timestamp: response.data.timestamp,
      };

      setMessages((prev) => [...prev, translationMessage]);
    } catch (error) {
      console.error('Error translating:', error);
      alert('Error translating text');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Book Assistant</h3>
        <div className="header-buttons">
          {showPersonalizeBtn && (
            <button className="header-btn" onClick={handlePersonalize} title="Personalize Content">
              🎯
            </button>
          )}
          {showTranslateBtn && (
            <button className="header-btn" onClick={handleTranslate} title="Translate to Urdu">
              🌐
            </button>
          )}
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Hi! I'm your book assistant. Ask me anything about the content, or select text to get more information.</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-content">
              {message.content}
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  <small>Sources: {message.sources.join(', ')}</small>
                </div>
              )}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedText && (
        <div className="selected-text-indicator">
          Selected: {selectedText.substring(0, 50)}
          {selectedText.length > 50 ? '...' : ''}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chatbot-form">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about the book..."
          disabled={isLoading}
          rows={2}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
