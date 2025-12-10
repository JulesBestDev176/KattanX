"""
Service de gestion biométrique conforme aux standards ANCEC
"""
from typing import Optional, Dict, List, Tuple
from django.db import models
from api.models import Citoyen, Biometrie, EmpreinteDigitale, PhotoIdentite
from api.models.enums import Doigt


class ServiceBiometrie:
    """Service pour la gestion biométrique conforme ANCEC"""
    
    # Seuils de qualité
    QUALITE_MINIMALE_EMPREINTE = 80
    QUALITE_MINIMALE_PHOTO = 80
    SEUIL_MATCH_EMPREINTE = 0.85  # 85% pour vérification 1:1
    SEUIL_IDENTIFICATION = 0.90   # 90% pour identification 1:N
    SEUIL_FACIAL = 0.6            # 60% pour reconnaissance faciale
    
    # Standards ANCEC
    RESOLUTION_EMPREINTE_DPI = 500
    RESOLUTION_PHOTO_MIN = (300, 400)  # Largeur x Hauteur
    TAILLE_PHOTO_MAX_KB = 100
    
    @staticmethod
    def valider_empreinte(empreinte: EmpreinteDigitale) -> Tuple[bool, Optional[str]]:
        """
        Valide une empreinte digitale selon les standards ANCEC
        
        Returns:
            (is_valid, error_message)
        """
        if empreinte.qualite < ServiceBiometrie.QUALITE_MINIMALE_EMPREINTE:
            return False, f"Qualité insuffisante ({empreinte.qualite}/100). Minimum requis: {ServiceBiometrie.QUALITE_MINIMALE_EMPREINTE}"
        
        if empreinte.resolution and empreinte.resolution < ServiceBiometrie.RESOLUTION_EMPREINTE_DPI:
            return False, f"Résolution insuffisante ({empreinte.resolution} DPI). Minimum requis: {ServiceBiometrie.RESOLUTION_EMPREINTE_DPI} DPI"
        
        if not empreinte.template or len(empreinte.template) < 100:
            return False, "Template biométrique invalide ou trop court"
        
        return True, None
    
    @staticmethod
    def valider_photo(photo: PhotoIdentite) -> Tuple[bool, Optional[str]]:
        """
        Valide une photo d'identité selon les standards ISO/IEC 19794-5
        
        Returns:
            (is_valid, error_message)
        """
        # Vérifier la résolution
        try:
            width, height = map(int, photo.resolution.split('x'))
            if width < ServiceBiometrie.RESOLUTION_PHOTO_MIN[0] or height < ServiceBiometrie.RESOLUTION_PHOTO_MIN[1]:
                return False, f"Résolution insuffisante ({photo.resolution}). Minimum requis: {ServiceBiometrie.RESOLUTION_PHOTO_MIN[0]}x{ServiceBiometrie.RESOLUTION_PHOTO_MIN[1]}"
        except:
            return False, "Format de résolution invalide (attendu: 'WIDTHxHEIGHT')"
        
        # Vérifier la taille
        taille_kb = photo.taille_octets / 1024
        if taille_kb > ServiceBiometrie.TAILLE_PHOTO_MAX_KB:
            return False, f"Taille trop importante ({taille_kb:.1f} KB). Maximum: {ServiceBiometrie.TAILLE_PHOTO_MAX_KB} KB"
        
        # Vérifier la qualité
        if photo.qualite_score and photo.qualite_score < ServiceBiometrie.QUALITE_MINIMALE_PHOTO:
            return False, f"Qualité photo insuffisante ({photo.qualite_score}/100). Minimum requis: {ServiceBiometrie.QUALITE_MINIMALE_PHOTO}"
        
        # Vérifier la conformité ISO
        if not photo.conforme_iso:
            return False, "Photo non conforme aux standards ISO/IEC 19794-5"
        
        return True, None
    
    @staticmethod
    def verifier_empreinte_1_1(
        citoyen_id: str,
        empreinte_capturee: EmpreinteDigitale,
        doigt: Doigt
    ) -> Dict[str, any]:
        """
        Vérification 1:1 - Compare une empreinte capturée avec celle stockée
        
        Args:
            citoyen_id: ID du citoyen
            empreinte_capturee: Empreinte capturée
            doigt: Doigt utilisé pour la vérification
        
        Returns:
            {
                'match': bool,
                'confiance': float (0-100),
                'score': float (0-1)
            }
        """
        try:
            citoyen = Citoyen.objects.get(id=citoyen_id)
            if not citoyen.biometrie:
                return {'match': False, 'confiance': 0, 'score': 0, 'error': 'Aucune biométrie enregistrée'}
            
            # Récupérer l'empreinte stockée pour ce doigt
            empreinte_stockee = EmpreinteDigitale.objects.filter(
                biometrie__citoyen=citoyen,
                doigt=doigt
            ).first()
            
            if not empreinte_stockee:
                return {'match': False, 'confiance': 0, 'score': 0, 'error': f'Aucune empreinte enregistrée pour {doigt}'}
            
            # Valider l'empreinte capturée
            is_valid, error = ServiceBiometrie.valider_empreinte(empreinte_capturee)
            if not is_valid:
                return {'match': False, 'confiance': 0, 'score': 0, 'error': error}
            
            # Comparer les templates (simulation - en production, utiliser un SDK biométrique)
            score = ServiceBiometrie._comparer_templates(
                empreinte_capturee.template,
                empreinte_stockee.template
            )
            
            match = score >= ServiceBiometrie.SEUIL_MATCH_EMPREINTE
            confiance = score * 100
            
            return {
                'match': match,
                'confiance': confiance,
                'score': score,
                'seuil': ServiceBiometrie.SEUIL_MATCH_EMPREINTE
            }
            
        except Citoyen.DoesNotExist:
            return {'match': False, 'confiance': 0, 'score': 0, 'error': 'Citoyen non trouvé'}
        except Exception as e:
            return {'match': False, 'confiance': 0, 'score': 0, 'error': str(e)}
    
    @staticmethod
    def identifier_personne_1_n(empreinte_capturee: EmpreinteDigitale, doigt: Doigt) -> List[Dict]:
        """
        Identification 1:N - Recherche une personne dans toute la base
        
        Args:
            empreinte_capturee: Empreinte capturée
            doigt: Doigt utilisé
        
        Returns:
            Liste de résultats triés par score décroissant
        """
        # Valider l'empreinte
        is_valid, error = ServiceBiometrie.valider_empreinte(empreinte_capturee)
        if not is_valid:
            return [{'error': error}]
        
        # Récupérer toutes les empreintes du même doigt
        empreintes_stockees = EmpreinteDigitale.objects.filter(doigt=doigt)
        
        resultats = []
        for empreinte_stockee in empreintes_stockees:
            score = ServiceBiometrie._comparer_templates(
                empreinte_capturee.template,
                empreinte_stockee.template
            )
            
            if score >= ServiceBiometrie.SEUIL_IDENTIFICATION:
                citoyen = empreinte_stockee.biometrie.citoyen if hasattr(empreinte_stockee, 'biometrie') else None
                resultats.append({
                    'citoyen_id': str(citoyen.id) if citoyen else None,
                    'numero_cni': citoyen.numero_cni if citoyen else None,
                    'nom': citoyen.nom if citoyen else None,
                    'prenom': citoyen.prenom if citoyen else None,
                    'score': score,
                    'confiance': score * 100
                })
        
        # Trier par score décroissant
        resultats.sort(key=lambda x: x.get('score', 0), reverse=True)
        
        return resultats[:10]  # Retourner les 10 meilleurs résultats
    
    @staticmethod
    def _comparer_templates(template1: str, template2: str) -> float:
        """
        Compare deux templates biométriques
        
        NOTE: En production, utiliser un SDK biométrique professionnel
        (ex: Neurotechnology MegaMatcher, Innovatrics, etc.)
        
        Cette méthode est une simulation basique
        """
        # Simulation - En production, utiliser un SDK réel
        # Pour l'instant, on compare la longueur et quelques caractères
        if len(template1) == 0 or len(template2) == 0:
            return 0.0
        
        # Calcul de similarité basique (à remplacer par un vrai algorithme)
        similarity = min(len(template1), len(template2)) / max(len(template1), len(template2))
        
        # Ajouter un peu de variation pour la démo
        import random
        similarity = similarity * 0.7 + random.uniform(0.3, 0.95) * 0.3
        
        return min(similarity, 1.0)
    
    @staticmethod
    def verifier_reconnaissance_faciale(
        citoyen_id: str,
        encodage_facial: str
    ) -> Dict[str, any]:
        """
        Vérifie une reconnaissance faciale (1:1)
        
        Args:
            citoyen_id: ID du citoyen
            encodage_facial: Vecteur facial encodé
        
        Returns:
            {
                'match': bool,
                'confiance': float (0-100),
                'score': float (0-1)
            }
        """
        try:
            citoyen = Citoyen.objects.get(id=citoyen_id)
            if not citoyen.biometrie or not citoyen.biometrie.reconnaissance_faciale:
                return {'match': False, 'confiance': 0, 'score': 0, 'error': 'Aucune reconnaissance faciale enregistrée'}
            
            encodage_stocke = citoyen.biometrie.reconnaissance_faciale.encodage_facial
            
            # Calculer la similarité cosinus (simulation)
            score = ServiceBiometrie._calculer_similarite_cosinus(
                encodage_facial,
                encodage_stocke
            )
            
            match = score >= ServiceBiometrie.SEUIL_FACIAL
            confiance = score * 100
            
            return {
                'match': match,
                'confiance': confiance,
                'score': score,
                'seuil': ServiceBiometrie.SEUIL_FACIAL
            }
            
        except Citoyen.DoesNotExist:
            return {'match': False, 'confiance': 0, 'score': 0, 'error': 'Citoyen non trouvé'}
        except Exception as e:
            return {'match': False, 'confiance': 0, 'score': 0, 'error': str(e)}
    
    @staticmethod
    def _calculer_similarite_cosinus(vec1: str, vec2: str) -> float:
        """
        Calcule la similarité cosinus entre deux vecteurs encodés
        
        NOTE: En production, utiliser un SDK de reconnaissance faciale
        """
        # Simulation - En production, parser les vecteurs et calculer la similarité cosinus
        import random
        return random.uniform(0.5, 0.95)  # Simulation

