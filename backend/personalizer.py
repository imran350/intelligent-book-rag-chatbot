from openai import OpenAI
from typing import Dict, List, Any
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4.1-mini")

class ContentPersonalizer:
    """Personalizes book content based on user background"""
    
    def __init__(self):
        self.experience_levels = {
            "beginner": "Beginner (just starting out or learning)",
            "intermediate": "Intermediate (have practical experience)",
            "advanced": "Expert level (deep knowledge)",
        }
    
    def get_personalization_prompt(self, background: Dict[str, Any]) -> str:
        """Generate a personalization prompt based on user background"""
        
        software_level = self.experience_levels.get(
            background.get("softwareExperience", "beginner"),
            "Beginner"
        )
        hardware_level = self.experience_levels.get(
            background.get("hardwareKnowledge", "beginner"),
            "Beginner"
        )
        languages = ", ".join(background.get("programmingLanguages", [])) or "multiple languages"
        interests = ", ".join(background.get("interests", [])) or "general software"
        
        return f"""You are helping a developer with the following background:
- Software Development Experience: {software_level}
- Hardware/Systems Knowledge: {hardware_level}
- Programming Languages Known: {languages}
- Interest Areas: {interests}

Tailor the following content to match their level and interests. 
- For beginners: provide more explanations and real-world analogies
- For intermediate: focus on practical applications
- For advanced: include optimization and advanced patterns
- Focus on examples in languages they know
"""
    
    def personalize_content(
        self, 
        content: str, 
        background: Dict[str, Any],
        include_examples: bool = True
    ) -> str:
        """
        Personalize content based on user background
        
        Args:
            content: The original content to personalize
            background: User's background dictionary
            include_examples: Whether to include code examples
        
        Returns:
            Personalized content
        """
        
        personalization_prompt = self.get_personalization_prompt(background)
        
        if include_examples:
            example_request = f"""
Also provide a practical example using one of these programming languages they know:
{', '.join(background.get('programmingLanguages', ['Python']))}
"""
        else:
            example_request = ""
        
        try:
            response = client.chat.completions.create(
                model=OPENAI_CHAT_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": personalization_prompt
                    },
                    {
                        "role": "user",
                        "content": f"Please personalize this content:\n\n{content}{example_request}"
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            print(f"Error personalizing content: {e}")
            return content
    
    def generate_difficulty_hint(self, background: Dict[str, Any]) -> str:
        """Generate a hint about expected difficulty level"""
        
        experience = background.get("softwareExperience", "beginner")
        
        hints = {
            "beginner": "📚 This section is explained for beginners. Don't worry if some concepts are new!",
            "intermediate": "⚙️ This section assumes some development experience. Try to connect with your existing knowledge.",
            "advanced": "🚀 This section covers advanced concepts and optimizations. Feel free to dive deep!",
        }
        
        return hints.get(experience, hints["beginner"])
    
    def get_relevant_examples(
        self, 
        background: Dict[str, Any],
        topic: str
    ) -> List[str]:
        """Get relevant code examples based on user's known languages"""
        
        known_languages = background.get("programmingLanguages", ["Python"])
        
        # Build a prompt to get examples
        languages_str = ", ".join(known_languages[:3])  # Limit to 3 languages
        
        try:
            response = client.chat.completions.create(
                model=OPENAI_CHAT_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": f"You are a programming expert. Provide brief, practical examples in {languages_str}."
                    },
                    {
                        "role": "user",
                        "content": f"Give me {len(known_languages)} code examples for '{topic}' - one in each of: {languages_str}"
                    }
                ],
                temperature=0.5,
                max_tokens=1000
            )
            
            # Parse the response into individual examples
            return [response.choices[0].message.content]
        
        except Exception as e:
            print(f"Error generating examples: {e}")
            return []
    
    def create_personalized_chapter(
        self,
        chapter_content: str,
        background: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a fully personalized chapter with content and examples
        
        Args:
            chapter_content: Original chapter content
            background: User's background
        
        Returns:
            Dictionary with personalized chapter content
        """
        
        personalized_text = self.personalize_content(chapter_content, background)
        difficulty_hint = self.generate_difficulty_hint(background)
        
        return {
            "original_content": chapter_content,
            "personalized_content": personalized_text,
            "difficulty_hint": difficulty_hint,
            "user_background": background,
        }
