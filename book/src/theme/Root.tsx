import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import AuthModal from '@site/src/components/AuthModal';

// Floating chatbot button and widget
function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Use runtime API URL detection
  const API_URL = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://your-backend-url.com')
    : 'http://localhost:8000';

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selected = window.getSelection()?.toString() || '';
      if (selected.length > 0) {
        setSelectedText(selected);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && !selectedText) return;

    const messageContent = input || selectedText;
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input;
    const currentSelected = selectedText;
    setInput('');
    setSelectedText('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: messageContent,
          conversation_history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          selected_text: currentSelected || undefined,
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'Sorry, I could not process your request.',
        sources: data.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_profile');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          const email = localStorage.getItem('user_email');
          if (email) {
            setIsAuthenticated(true);
            setUserEmail(email);
          }
        }}
      />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            width: '380px',
            maxHeight: '600px',
            backgroundColor: 'var(--ifm-background-surface-color)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--ifm-color-emphasis-300)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--ifm-color-emphasis-300)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>💬 Book Assistant</h3>
              <button
                onClick={toggleChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                ✕
              </button>
            </div>
            {isAuthenticated ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span>👤 {userEmail}</span>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                🔓 Sign In for Personalization
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              maxHeight: '400px',
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', padding: '20px' }}>
                <p>👋 Hi! I'm your book assistant.</p>
                <p style={{ fontSize: '14px' }}>Ask me anything about the content, or select text and ask questions about it!</p>
              </div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: msg.role === 'user'
                    ? 'var(--ifm-color-primary)'
                    : 'var(--ifm-color-emphasis-200)',
                  color: msg.role === 'user' ? 'white' : 'var(--ifm-font-color-base)',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                    📚 Sources: {msg.sources.join(', ')}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
                <span>⏳ Thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--ifm-color-emphasis-300)' }}>
            {selectedText && (
              <div
                style={{
                  fontSize: '12px',
                  padding: '8px',
                  backgroundColor: 'var(--ifm-color-emphasis-100)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  maxHeight: '60px',
                  overflow: 'auto',
                }}
              >
                <strong>Selected:</strong> {selectedText.substring(0, 100)}...
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder={selectedText ? 'Ask about selected text...' : 'Ask a question...'}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--ifm-background-color)',
                  color: 'var(--ifm-font-color-base)',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !selectedText)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--ifm-color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: isLoading || (!input.trim() && !selectedText) ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--ifm-color-primary)',
          color: 'white',
          border: 'none',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        💬
      </button>
    </div>
  );
}

export default function Root({ children }): JSX.Element {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => <FloatingChatBot />}
      </BrowserOnly>
    </>
  );
}
