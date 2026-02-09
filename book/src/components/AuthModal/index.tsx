import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps): JSX.Element | null {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Questionnaire fields for signup
  const [experience, setExperience] = useState('beginner');
  const [languages, setLanguages] = useState<string[]>(['python']);
  const [interests, setInterests] = useState('');

  const API_URL = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://your-backend-url.com')
    : 'http://localhost:8000';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signin' ? '/api/signin' : '/api/signup';
      const payload = mode === 'signin'
        ? { email, password }
        : {
            email,
            password,
            name,
            background: {
              experience_level: experience,
              programming_languages: languages,
              interests: interests.split(',').map(i => i.trim()),
            },
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token and user info
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_profile', JSON.stringify({
        experience_level: experience,
        preferred_languages: languages,
        interests: interests.split(',').map(i => i.trim()),
      }));

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        
        <h2 className={styles.title}>
          {mode === 'signin' ? '🔐 Sign In' : '🚀 Create Account'}
        </h2>

        <div className={styles.modeTabs}>
          <button
            className={mode === 'signin' ? styles.activeTab : styles.tab}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={mode === 'signup' ? styles.activeTab : styles.tab}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className={styles.formGroup}>
                <label>Programming Experience</label>
                <select value={experience} onChange={e => setExperience(e.target.value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Languages You Know (or want to learn)</label>
                <div className={styles.languageButtons}>
                  {['python', 'javascript', 'java', 'cpp', 'csharp', 'go'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      className={languages.includes(lang) ? styles.langSelected : styles.langButton}
                      onClick={() => toggleLanguage(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'csharp' ? 'C#' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Interests (comma-separated)</label>
                <input
                  type="text"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  placeholder="web dev, AI, data science"
                />
              </div>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? '⏳ Processing...' : mode === 'signin' ? '🔓 Sign In' : '✨ Create Account'}
          </button>
        </form>

        <p className={styles.hint}>
          {mode === 'signin'
            ? "Don't have an account? Click Sign Up above."
            : 'Already have an account? Click Sign In above.'}
        </p>
      </div>
    </div>
  );
}
