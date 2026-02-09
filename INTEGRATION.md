# Integration Guide

This guide explains how to integrate the RAG chatbot and other components into your Docusaurus book.

## 1. Copy Chatbot Components

Copy the chatbot UI components to your Docusaurus `src/components` directory:

```bash
cp -r ../chatbot-ui/*.tsx ../book/src/components/
cp -r ../chatbot-ui/*.css ../book/src/components/
```

## 2. Update Docusaurus Layout

Create or update `src/theme/Layout/index.tsx`:

```typescript
import React, { useState } from 'react';
import Layout from '@theme-original/Layout';
import ChatBot from '@site/src/components/ChatBot';
import AuthForm from '@site/src/components/AuthForm';
import PersonalizationPanel from '@site/src/components/PersonalizationPanel';

import type {Props} from '@theme/Layout';

export default function LayoutWrapper(props: Props) {
  const [showChat, setShowChat] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [user, setUser] = useState<any>(null);

  return (
    <>
      <Layout {...props}>
        {props.children}
      </Layout>

      {/* Chatbot Widget */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <ChatBot
            apiUrl={process.env.REACT_APP_API_URL || 'http://localhost:8000'}
            userId={user?.id}
            onPersonalize={() => setShowPersonalize(true)}
          />
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <AuthForm
          onSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }}
        />
      )}

      {/* Personalization Modal */}
      {showPersonalize && user && (
        <PersonalizationPanel
          userId={user.id}
          onClose={() => setShowPersonalize(false)}
        />
      )}
    </>
  );
}
```

## 3. Install Dependencies

Add the chatbot UI dependencies to your Docusaurus package.json:

```bash
cd book
npm install axios
```

## 4. Configure API URL

Update your `.env.local` or environment variables:

```
REACT_APP_API_URL=http://localhost:8000
```

For production:

```
REACT_APP_API_URL=https://your-api-domain.com
```

## 5. Create Sample Content

Create a chapter in `docs/` directory to test the chatbot:

```markdown
---
sidebar_position: 1
---

# Chapter 1: Getting Started

This is sample content that the chatbot can search through...

## Section 1.1

More content here that demonstrates RAG capabilities.
```

## 6. Add Content to Vector Store

When deploying to production, you'll want to add your book content to the vector database:

```python
# Python script to index content
import requests

chapter_content = {
    "text": "Your chapter content here...",
    "chapter": "Chapter 1",
    "section": "Getting Started"
}

response = requests.post(
    'http://localhost:8000/api/add-content',
    json=chapter_content
)
```

## 7. Environment Variables

Create `.env` files for development:

### Backend (.env)
```
OPENAI_API_KEY=sk-...
NEON_DATABASE_URL=postgresql://...
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=...
SECRET_KEY=your-secret-key
```

### Frontend
```
REACT_APP_API_URL=http://localhost:8000
```

## 8. Styling Customization

Override chatbot styles in `src/css/custom.css`:

```css
/* Primary color */
:root {
  --ifm-color-primary: #667eea;
  --ifm-color-primary-dark: #5567d8;
  --ifm-color-primary-light: #7b8dff;
}

/* Chatbot specific styles */
.chatbot-container {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}
```

## 9. Building for Production

```bash
# Build Docusaurus
npm run build

# The static site is ready in the build/ directory
```

## 10. Deployment Checklist

- [ ] Update GitHub repository settings
- [ ] Configure GitHub Pages
- [ ] Set up environment variables
- [ ] Deploy backend (Vercel, Railway, etc.)
- [ ] Add book content to vector database
- [ ] Test chatbot in production
- [ ] Enable CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Test user authentication flow

## Troubleshooting

### Chatbot not appearing
- Check if React component is properly imported
- Verify browser console for errors
- Ensure backend is running and accessible

### API calls failing
- Check CORS settings in backend
- Verify API URL is correct
- Check browser network tab

### Personalization not working
- Ensure user is authenticated
- Check token is stored in localStorage
- Verify backend has user data

## Advanced Usage

### Custom Styling

```typescript
<ChatBot
  apiUrl="http://localhost:8000"
  userId={userId}
  // Custom styling via CSS variables
/>
```

### Event Handling

```typescript
const handlePersonalize = () => {
  // Custom personalization logic
  console.log('User wants to personalize');
};

<ChatBot
  onPersonalize={handlePersonalize}
  userId={userId}
/>
```

### Conditional Rendering

```typescript
{user && (
  <ChatBot
    userId={user.id}
    apiUrl={process.env.REACT_APP_API_URL}
  />
)}

{!user && (
  <button onClick={() => setShowAuth(true)}>
    Sign in to use AI Assistant
  </button>
)}
```

## API Integration Examples

### Adding Content Programmatically

```typescript
// Upload chapter content to vector store
const addChapterToVectorStore = async (chapter: any) => {
  const response = await axios.post(
    `${apiUrl}/api/add-content`,
    {
      text: chapter.content,
      chapter: chapter.title,
      section: chapter.section
    }
  );
  return response.data;
};
```

### Translating Content

```typescript
// Translate chapter to Urdu
const translateChapter = async (chapter: any) => {
  const response = await axios.post(
    `${apiUrl}/api/translate-chapter`,
    {
      chapter_title: chapter.title,
      chapter_content: chapter.content,
      target_language: 'urdu'
    }
  );
  return response.data;
};
```

### Personalizing Content

```typescript
// Get personalized chapter based on user background
const getPersonalizedChapter = async (
  chapter: any,
  userBackground: any
) => {
  const response = await axios.post(
    `${apiUrl}/api/personalize-chapter`,
    {
      chapter_title: chapter.title,
      chapter_content: chapter.content,
      background: userBackground
    }
  );
  return response.data;
};
```

For more information, see the main [README.md](../README.md).
