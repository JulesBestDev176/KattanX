"""
Service pour intégrer Google Gemini AI
"""
import os
import google.generativeai as genai
from django.conf import settings
from typing import Optional, Dict, Any


class GeminiService:
    """Service pour interagir avec Google Gemini AI"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY n'est pas configuré dans les variables d'environnement")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_text(self, prompt: str, **kwargs) -> str:
        """
        Génère du texte à partir d'un prompt
        
        Args:
            prompt: Le prompt à envoyer à Gemini
            **kwargs: Paramètres additionnels (temperature, max_tokens, etc.)
        
        Returns:
            Le texte généré par Gemini
        """
        try:
            generation_config = {
                'temperature': kwargs.get('temperature', 0.7),
                'top_p': kwargs.get('top_p', 0.8),
                'top_k': kwargs.get('top_k', 40),
                'max_output_tokens': kwargs.get('max_output_tokens', 2048),
            }
            
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            return response.text
        except Exception as e:
            raise Exception(f"Erreur lors de la génération avec Gemini: {str(e)}")
    
    def analyze_prestation(self, prestation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyse une prestation médicale avec Gemini AI
        
        Args:
            prestation_data: Données de la prestation à analyser
        
        Returns:
            Analyse de la prestation
        """
        prompt = f"""
        Analyse cette prestation médicale et fournis:
        1. Un résumé de la prestation
        2. Les points importants à noter
        3. Des recommandations si nécessaire
        
        Données de la prestation:
        {prestation_data}
        
        Réponds en format JSON avec les clés: summary, important_points, recommendations
        """
        
        try:
            analysis_text = self.generate_text(prompt, temperature=0.3)
            return {
                'analysis': analysis_text,
                'prestation_id': prestation_data.get('data', {}).get('identifier'),
                'status': 'success'
            }
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error'
            }
    
    def chat(self, messages: list, context: Optional[str] = None) -> str:
        """
        Chat conversationnel avec Gemini
        
        Args:
            messages: Liste de messages (format: [{"role": "user", "content": "..."}])
            context: Contexte additionnel pour la conversation
        
        Returns:
            Réponse de Gemini
        """
        try:
            # Construire le prompt avec le contexte
            full_prompt = ""
            if context:
                full_prompt += f"Contexte: {context}\n\n"
            
            # Ajouter l'historique de conversation
            for msg in messages:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                full_prompt += f"{role.capitalize()}: {content}\n"
            
            response = self.generate_text(full_prompt)
            return response
        except Exception as e:
            raise Exception(f"Erreur lors du chat avec Gemini: {str(e)}")


def get_gemini_service() -> Optional[GeminiService]:
    """
    Factory function pour obtenir une instance de GeminiService
    
    Returns:
        Instance de GeminiService ou None si la clé API n'est pas configurée
    """
    try:
        return GeminiService()
    except ValueError:
        return None

