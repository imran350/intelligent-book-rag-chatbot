# Book Chatbot UI

A React-based chatbot component for book interaction with RAG capabilities.

## Features

- Real-time chat with RAG-powered responses
- Selected text context awareness
- Translation to Urdu
- Personalization settings
- Source attribution
- Responsive design

## Installation

### As a React Component

```bash
npm install
npm run build
```

### Integration in Docusaurus

1. Copy this component to your Docusaurus `src/components/` directory
2. Import in your layout:

```tsx
import ChatBot from '@site/src/components/ChatBot';

export default function Layout(props) {
  return (
    <>
      {/* Your layout */}
      <ChatBot apiUrl="http://localhost:8000" />
    </>
  );
}
```

## Props

```typescript
interface ChatBotProps {
  apiUrl?: string;        // Backend API URL (default: http://localhost:8000)
  userId?: string;        // Current user ID for personalization
  onPersonalize?: () => void;  // Callback for personalization
  onTranslate?: () => void;    // Callback for translation
}
```

## Environment Setup

Create `.env` file in book directory:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Usage Example

```tsx
import ChatBot from './ChatBot';

function MyPage() {
  const userId = getCurrentUserId();
  
  const handlePersonalize = () => {
    // Show personalization modal
  };

  const handleTranslate = () => {
    // Handle translation
  };

  return (
    <ChatBot
      apiUrl="http://localhost:8000"
      userId={userId}
      onPersonalize={handlePersonalize}
      onTranslate={handleTranslate}
    />
  );
}
```

## Styling

The chatbot comes with built-in CSS. You can customize the appearance by overriding CSS variables or modifying `ChatBot.css`.

## API Integration

The chatbot communicates with the FastAPI backend:

- `POST /api/chat` - Send message
- `POST /api/translate` - Translate text
- `POST /api/personalize` - Save preferences

See the backend README for full API documentation.
