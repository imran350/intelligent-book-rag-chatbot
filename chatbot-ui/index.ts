// Main chatbot component
export { ChatBot as default, ChatBot } from './ChatBot';

// Authentication component
export { AuthForm } from './AuthForm';

// Personalization component
export { PersonalizationPanel } from './PersonalizationPanel';

// Types and interfaces
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

export interface ChatBotProps {
  apiUrl?: string;
  userId?: string;
  onPersonalize?: () => void;
  onTranslate?: () => void;
}

export interface UserBackground {
  softwareExperience: 'beginner' | 'intermediate' | 'advanced';
  hardwareKnowledge: 'beginner' | 'intermediate' | 'advanced';
  programmingLanguages: string[];
  interests: string[];
}
