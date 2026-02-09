import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import AuthModal from '@site/src/components/AuthModal';

interface ChapterActionsProps {
  chapterId: string;
  chapterTitle: string;
  content: string;
}

export default function ChapterActions({ chapterId, chapterTitle, content }: ChapterActionsProps): JSX.Element {
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'original' | 'personalized' | 'translated'>('original');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));

  // Use runtime API URL detection
  const API_URL = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://your-backend-url.com')
    : 'http://localhost:8000';

  const handlePersonalize = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsPersonalizing(true);
    try {
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(
        `${API_URL}/api/personalize-chapter`,
        {
          chapter_content: content,
          user_preferences: {
            experience_level: userProfile.experience_level || 'beginner',
            preferred_languages: userProfile.preferred_languages || ['python'],
            interests: userProfile.interests || []
          },
          user_background: {
            programming_experience: userProfile.programming_experience || 'beginner',
            topics_of_interest: userProfile.topics_of_interest || []
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPersonalizedContent(response.data.personalized_content);
      setCurrentView('personalized');
    } catch (error) {
      console.error('Personalization error:', error);
      alert('Failed to personalize content. Please try again.');
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleTranslate = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsTranslating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        `${API_URL}/api/translate`,
        {
          text: content,
          target_language: 'urdu',
          preserve_code: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTranslatedContent(response.data.translated_text);
      setCurrentView('translated');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate content. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleViewChange = (view: 'original' | 'personalized' | 'translated') => {
    setCurrentView(view);
  };

  return (
    <div className={styles.chapterActions}>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowAuthModal(false);
        }}
      />
      
      <div className={styles.actionButtons}>
        <button
          onClick={() => handleViewChange('original')}
          className={`${styles.actionButton} ${currentView === 'original' ? styles.active : ''}`}
          disabled={currentView === 'original'}
        >
          📖 Original
        </button>
        
        <button
          onClick={handlePersonalize}
          className={`${styles.actionButton} ${currentView === 'personalized' ? styles.active : ''}`}
          disabled={isPersonalizing || currentView === 'personalized'}
        >
          {isPersonalizing ? '⏳ Personalizing...' : '✨ Personalize for Me'}
        </button>

        <button
          onClick={handleTranslate}
          className={`${styles.actionButton} ${currentView === 'translated' ? styles.active : ''}`}
          disabled={isTranslating || currentView === 'translated'}
        >
          {isTranslating ? '⏳ Translating...' : '🌐 Translate to Urdu'}
        </button>
      </div>

      {currentView === 'personalized' && personalizedContent && (
        <div className={styles.contentView}>
          <div className={styles.contentHeader}>
            <h3>🎯 Personalized Content</h3>
            <p>This content has been adapted to your experience level and interests</p>
          </div>
          <div 
            className={styles.contentBody}
            dangerouslySetInnerHTML={{ __html: personalizedContent }}
          />
        </div>
      )}

      {currentView === 'translated' && translatedContent && (
        <div className={styles.contentView}>
          <div className={styles.contentHeader}>
            <h3>🌐 Urdu Translation</h3>
            <p>اردو ترجمہ - Technical glossary preserved</p>
          </div>
          <div 
            className={styles.contentBody}
            dangerouslySetInnerHTML={{ __html: translatedContent }}
          />
        </div>
      )}
    </div>
  );
}
