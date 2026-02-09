import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonalizationPanel.css';

interface UserBackground {
  softwareExperience: 'beginner' | 'intermediate' | 'advanced';
  hardwareKnowledge: 'beginner' | 'intermediate' | 'advanced';
  programmingLanguages: string[];
  interests: string[];
}

interface PersonalizationPanelProps {
  apiUrl?: string;
  userId?: string;
  onClose?: () => void;
}

export const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({
  apiUrl = 'http://localhost:8000',
  userId,
  onClose,
}) => {
  const [background, setBackground] = useState<UserBackground>({
    softwareExperience: 'beginner',
    hardwareKnowledge: 'beginner',
    programmingLanguages: [],
    interests: [],
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load user's current background preferences
    if (userId) {
      loadUserBackground();
    }
  }, [userId]);

  const loadUserBackground = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBackground(response.data.background || background);
    } catch (error) {
      console.error('Error loading user background:', error);
    }
  };

  const handleBackgroundChange = (field: string, value: any) => {
    setBackground((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageChange = (language: string) => {
    setBackground((prev) => {
      const languages = [...prev.programmingLanguages];
      const index = languages.indexOf(language);
      if (index > -1) {
        languages.splice(index, 1);
      } else {
        languages.push(language);
      }
      return { ...prev, programmingLanguages: languages };
    });
  };

  const handleInterestChange = (interest: string) => {
    setBackground((prev) => {
      const interests = [...prev.interests];
      const index = interests.indexOf(interest);
      if (index > -1) {
        interests.splice(index, 1);
      } else {
        interests.push(interest);
      }
      return { ...prev, interests };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please sign in first');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        `${apiUrl}/api/auth/preferences`,
        { background },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Preferences saved successfully!');
      // Also save to backend for content personalization
      await axios.post(`${apiUrl}/api/personalize`, {
        user_id: userId,
        preferences: { background },
        background,
      });

      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const getLevelDescription = (level: string): string => {
    const descriptions: Record<string, string> = {
      beginner: 'Just starting out or learning',
      intermediate: 'Have practical experience',
      advanced: 'Expert level knowledge',
    };
    return descriptions[level] || '';
  };

  return (
    <div className="personalization-overlay">
      <div className="personalization-panel">
        <div className="panel-header">
          <h2>Personalize Your Learning</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="panel-content">
          <p className="intro-text">
            Tell us about your background so we can tailor the content to your level.
          </p>

          <div className="form-group">
            <label>Software Development Experience</label>
            <p className="level-description">{getLevelDescription(background.softwareExperience)}</p>
            <div className="level-selector">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  className={`level-btn ${background.softwareExperience === level ? 'active' : ''}`}
                  onClick={() => handleBackgroundChange('softwareExperience', level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Hardware/Systems Knowledge</label>
            <p className="level-description">{getLevelDescription(background.hardwareKnowledge)}</p>
            <div className="level-selector">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  className={`level-btn ${background.hardwareKnowledge === level ? 'active' : ''}`}
                  onClick={() => handleBackgroundChange('hardwareKnowledge', level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Programming Languages (select all you know)</label>
            <div className="checkbox-grid">
              {['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'].map((lang) => (
                <label key={lang} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={background.programmingLanguages.includes(lang)}
                    onChange={() => handleLanguageChange(lang)}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Areas of Interest</label>
            <div className="checkbox-grid">
              {['Web Development', 'AI/ML', 'Cloud', 'DevOps', 'Mobile', 'Data Science'].map((interest) => (
                <label key={interest} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={background.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="panel-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationPanel;
