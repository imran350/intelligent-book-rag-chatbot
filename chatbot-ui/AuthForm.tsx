import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

interface AuthFormProps {
  apiUrl?: string;
  onSuccess: (userData: any) => void;
  isSignup?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  apiUrl = 'http://localhost:8000',
  onSuccess,
  isSignup = true,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(isSignup ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // For signup with background questionnaire

  // Background questionnaire fields
  const [background, setBackground] = useState({
    softwareExperience: 'beginner', // beginner, intermediate, advanced
    hardwareKnowledge: 'beginner',
    programmingLanguages: [],
    interests: [],
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/signup`, {
        email,
        name,
        password,
        background,
        preferences: {},
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onSuccess(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/signin`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onSuccess(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signin failed');
    } finally {
      setLoading(false);
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
      const languages = prev.programmingLanguages as string[];
      const index = languages.indexOf(language);
      if (index > -1) {
        return {
          ...prev,
          programmingLanguages: languages.filter((_, i) => i !== index),
        };
      } else {
        return {
          ...prev,
          programmingLanguages: [...languages, language],
        };
      }
    });
  };

  const handleInterestChange = (interest: string) => {
    setBackground((prev) => {
      const interests = prev.interests as string[];
      const index = interests.indexOf(interest);
      if (index > -1) {
        return {
          ...prev,
          interests: interests.filter((_, i) => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest],
        };
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>

        {mode === 'signup' && step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Choose a strong password"
              />
            </div>

            <button type="submit" disabled={loading}>
              Next: Background Questions
            </button>
          </form>
        )}

        {mode === 'signup' && step === 2 && (
          <form onSubmit={handleSignup}>
            <h3>Tell us about your background</h3>

            <div className="form-group">
              <label>Software Development Experience</label>
              <select
                value={background.softwareExperience as string}
                onChange={(e) => handleBackgroundChange('softwareExperience', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hardware Knowledge</label>
              <select
                value={background.hardwareKnowledge as string}
                onChange={(e) => handleBackgroundChange('hardwareKnowledge', e.target.value)}
              >
                <option value="beginner">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Programming Languages (select all you know)</label>
              <div className="checkbox-grid">
                {['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'].map((lang) => (
                  <label key={lang} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(background.programmingLanguages as string[]).includes(lang)}
                      onChange={() => handleLanguageChange(lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Interests (select all that apply)</label>
              <div className="checkbox-grid">
                {['Web Development', 'AI/ML', 'Cloud', 'DevOps', 'Mobile', 'Data Science'].map((interest) => (
                  <label key={interest} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(background.interests as string[]).includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="secondary"
              >
                Back
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {mode === 'signin' && (
          <form onSubmit={handleSignin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          {mode === 'signup' && step === 1 ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setStep(1);
                  setError('');
                }}
                className="link-button"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setStep(1);
                  setError('');
                }}
                className="link-button"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
