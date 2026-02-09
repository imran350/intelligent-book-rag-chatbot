from openai import OpenAI
from typing import Dict, List, Tuple
import os
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
OPENAI_TRANSLATE_MODEL = os.getenv(
    "OPENAI_TRANSLATE_MODEL",
    os.getenv("OPENAI_CHAT_MODEL", "gpt-4.1-mini")
)

class ContentTranslator:
    """Handles translation of book content to multiple languages"""
    
    SUPPORTED_LANGUAGES = {
        "urdu": "Urdu",
        "spanish": "Spanish",
        "french": "French",
        "chinese": "Chinese (Simplified)",
        "arabic": "Arabic",
    }
    
    def __init__(self):
        self.translation_cache: Dict[str, str] = {}
    
    def translate_text(
        self,
        text: str,
        target_language: str = "urdu",
        preserve_code: bool = True
    ) -> str:
        """
        Translate text to target language
        
        Args:
            text: Text to translate
            target_language: Target language code (e.g., 'urdu')
            preserve_code: Keep code blocks in original language if True
        
        Returns:
            Translated text
        """
        
        # Check cache
        cache_key = f"{target_language}:{text[:100]}"
        if cache_key in self.translation_cache:
            return self.translation_cache[cache_key]
        
        language_name = self.SUPPORTED_LANGUAGES.get(
            target_language.lower(),
            target_language
        )
        
        # Handle code preservation
        if preserve_code:
            system_prompt = f"""You are a professional translator. Translate the following text to {language_name}.
IMPORTANT: Keep any code blocks (inside ``` markers) in their original English form.
Only translate the regular text and comments, not the code itself.
Preserve the structure and formatting."""
        else:
            system_prompt = f"""You are a professional translator. Translate the following text to {language_name}.
Preserve all formatting and structure. Only provide the translation, no explanations."""
        
        try:
            response = client.chat.completions.create(
                model=OPENAI_TRANSLATE_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.3,  # Lower temperature for more consistent translations
                max_tokens=min(2000, len(text) * 2)
            )
            
            translated_text = response.choices[0].message.content
            
            # Cache the result
            self.translation_cache[cache_key] = translated_text
            
            return translated_text
        
        except Exception as e:
            print(f"Error translating text: {e}")
            return text
    
    def translate_chapter(
        self,
        chapter_title: str,
        chapter_content: str,
        target_language: str = "urdu"
    ) -> Dict[str, str]:
        """
        Translate entire chapter
        
        Args:
            chapter_title: Chapter title
            chapter_content: Chapter content
            target_language: Target language
        
        Returns:
            Dictionary with translated title and content
        """
        
        translated_title = self.translate_text(chapter_title, target_language)
        translated_content = self.translate_text(chapter_content, target_language)
        
        return {
            "original_title": chapter_title,
            "translated_title": translated_title,
            "original_content": chapter_content,
            "translated_content": translated_content,
            "target_language": target_language,
        }
    
    def translate_with_context(
        self,
        text: str,
        context: str = "",
        target_language: str = "urdu"
    ) -> str:
        """
        Translate text with contextual awareness
        
        Args:
            text: Text to translate
            context: Additional context for better translation
            target_language: Target language
        
        Returns:
            Translated text
        """
        
        language_name = self.SUPPORTED_LANGUAGES.get(
            target_language.lower(),
            target_language
        )
        
        system_prompt = f"""You are a professional translator specializing in technical and educational content.
Translate to {language_name}. 
Keep technical terms and code consistent.
Preserve formatting and structure."""
        
        user_message = f"Context: {context}\n\nText to translate:\n{text}"
        
        try:
            response = client.chat.completions.create(
                model=OPENAI_TRANSLATE_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            print(f"Error with contextual translation: {e}")
            return text
    
    def get_glossary(
        self,
        key_terms: List[str],
        target_language: str = "urdu"
    ) -> Dict[str, str]:
        """
        Get translations of key technical terms
        
        Args:
            key_terms: List of technical terms
            target_language: Target language
        
        Returns:
            Dictionary mapping terms to translations
        """
        
        language_name = self.SUPPORTED_LANGUAGES.get(
            target_language.lower(),
            target_language
        )
        
        terms_str = "\n".join([f"- {term}" for term in key_terms])
        
        try:
            response = client.chat.completions.create(
                model=OPENAI_TRANSLATE_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are a technical translator. Provide {language_name} translations for technical terms.
Format your response as JSON with term as key and translation as value."""
                    },
                    {
                        "role": "user",
                        "content": f"Translate these technical terms to {language_name}:\n{terms_str}"
                    }
                ],
                temperature=0.2,
                max_tokens=1000
            )
            
            response_text = response.choices[0].message.content
            
            # Try to parse JSON
            try:
                glossary = json.loads(response_text)
                return glossary
            except json.JSONDecodeError:
                # Fallback: return original terms
                return {term: term for term in key_terms}
        
        except Exception as e:
            print(f"Error generating glossary: {e}")
            return {term: term for term in key_terms}
    
    def batch_translate(
        self,
        texts: List[str],
        target_language: str = "urdu"
    ) -> List[str]:
        """
        Translate multiple texts efficiently
        
        Args:
            texts: List of texts to translate
            target_language: Target language
        
        Returns:
            List of translated texts
        """
        
        translated_texts = []
        
        for text in texts:
            translated = self.translate_text(text, target_language)
            translated_texts.append(translated)
        
        return translated_texts
