"""
Services de vérification pour l'inscription
- Vérification ANCEC (CNI)
- Vérification Agent (matricule)
- Gestion OTP
"""
from django.utils import timezone
from datetime import timedelta
import random
import re
from typing import Dict, Optional, Tuple
from api.models import Citoyen, Agent
from api.models.enums import TypeForceOrdre


class ServiceVerificationANCEC:
    """Service de vérification avec ANCEC"""
    
    @staticmethod
    def verifier_cni(donnees: Dict) -> Dict:
        """
        Vérifie les informations CNI avec ANCEC
        
        Args:
            donnees: {
                'numero_cni': str,
                'nom': str,
                'prenom': str,
                'date_naissance': date,
                'lieu_naissance': str
            }
        
        Returns:
            {
                'succes': bool,  # Note: gardé "succes" pour correspondre au format ANCEC
                'verifications': {
                    'cniExiste': bool,
                    'informationsCoherentes': bool,
                    'dateNaissanceCorrecte': bool,
                    'cniValide': bool,
                    'ageMinimum': bool
                },
                'donneesANCEC': {...},
                'erreurs': [...],
                'dateVerification': datetime,
                'sourceVerification': str
            }
        """
        numero_cni = donnees.get('numero_cni', '')
        nom = donnees.get('nom', '').upper().strip()
        prenom = donnees.get('prenom', '').upper().strip()
        date_naissance = donnees.get('date_naissance')
        lieu_naissance = donnees.get('lieu_naissance', '').upper().strip()
        
        # Validation format CNI (13 chiffres)
        if not re.match(r'^\d{13}$', numero_cni):
            return {
                'succes': False,
                'verifications': {
                    'cniExiste': False,
                    'informationsCoherentes': False,
                    'dateNaissanceCorrecte': False,
                    'cniValide': False,
                    'ageMinimum': False
                },
                'erreurs': ['Format CNI invalide. Attendu: 13 chiffres'],
                'dateVerification': timezone.now(),
                'sourceVerification': 'VALIDATION_FORMAT'
            }
        
        # Vérifier si CNI existe dans la base locale (Citoyen)
        try:
            citoyen = Citoyen.objects.get(numero_cni=numero_cni)
            
            # Vérifier la cohérence des informations
            informations_coherentes = (
                citoyen.nom.upper().strip() == nom and
                citoyen.prenom.upper().strip() == prenom and
                str(citoyen.date_naissance) == str(date_naissance) and
                citoyen.lieu_naissance.upper().strip() == lieu_naissance
            )
            
            # Vérifier l'âge minimum (18 ans)
            age = (timezone.now().date() - citoyen.date_naissance).days // 365
            age_minimum = age >= 18
            
            # Vérifier si CNI valide (non expirée, non suspendue)
            # Pour l'instant, on considère que si elle existe, elle est valide
            cni_valide = citoyen.statut == 'ACTIF'
            
            # Date de naissance correcte
            date_naissance_correcte = str(citoyen.date_naissance) == str(date_naissance)
            
            succes = (
                informations_coherentes and
                date_naissance_correcte and
                cni_valide and
                age_minimum
            )
            
            return {
                'succes': succes,
                'verifications': {
                    'cniExiste': True,
                    'informationsCoherentes': informations_coherentes,
                    'dateNaissanceCorrecte': date_naissance_correcte,
                    'cniValide': cni_valide,
                    'ageMinimum': age_minimum
                },
                'donneesANCEC': {
                    'numeroCNI': citoyen.numero_cni,
                    'nom': citoyen.nom,
                    'prenom': citoyen.prenom,
                    'dateNaissance': citoyen.date_naissance.isoformat(),
                    'lieuNaissance': citoyen.lieu_naissance,
                    'genre': citoyen.genre,
                    'empreintesEnregistrees': bool(citoyen.biometrie and citoyen.biometrie.empreintes.exists())
                },
                'erreurs': [] if succes else ['Les informations ne correspondent pas aux données ANCEC'],
                'dateVerification': timezone.now(),
                'sourceVerification': 'BASE_LOCALE'
            }
            
        except Citoyen.DoesNotExist:
            # CNI non trouvée dans la base locale
            # En production, on appellerait l'API ANCEC ici
            # Pour l'instant, on simule une vérification
            
            # TODO: Appel API ANCEC réelle
            # response = requests.post('https://api.ancec.sn/verifier', data=donnees)
            
            # Simulation: On accepte si le format est correct
            age = (timezone.now().date() - date_naissance).days // 365 if date_naissance else 0
            
            return {
                'succes': age >= 18,  # Accepte si âge >= 18
                'verifications': {
                    'cniExiste': False,  # Pas dans la base locale
                    'informationsCoherentes': True,  # On fait confiance pour l'instant
                    'dateNaissanceCorrecte': True,
                    'cniValide': True,
                    'ageMinimum': age >= 18
                },
                'donneesANCEC': None,
                'erreurs': [] if age >= 18 else ['Vous devez avoir au moins 18 ans'],
                'avertissements': ['CNI non trouvée dans la base locale. Vérification ANCEC requise.'],
                'dateVerification': timezone.now(),
                'sourceVerification': 'SIMULATION'  # En production: 'ANCEC_API'
            }


class ServiceVerificationAgent:
    """Service de vérification des agents"""
    
    @staticmethod
    def verifier_matricule(matricule: str, numero_cni: str) -> Dict:
        """
        Vérifie un matricule d'agent
        
        Args:
            matricule: Format POL/GEN/POM-AAAA-NNNNNN
            numero_cni: Numéro CNI de l'agent
        
        Returns:
            {
                'succes': bool,  # Note: gardé "succes" pour correspondre au format ANCEC
                'verifications': {
                    'matriculeExiste': bool,
                    'matriculeFormatValide': bool,
                    'agentActif': bool,
                    'correspondanceCNI': bool
                },
                'donneesAgent': {...},
                'erreurs': [...],
                'dateVerification': datetime,
                'sourceVerification': str
            }
        """
        # Validation format matricule
        format_valide = re.match(r'^(POL|GEN|POM)-\d{4}-\d{6}$', matricule)
        
        if not format_valide:
            return {
                'succes': False,
                'verifications': {
                    'matriculeExiste': False,
                    'matriculeFormatValide': False,
                    'agentActif': False,
                    'correspondanceCNI': False
                },
                'erreurs': ['Format de matricule invalide. Attendu: POL/GEN/POM-AAAA-NNNNNN'],
                'dateVerification': timezone.now(),
                'sourceVerification': 'VALIDATION_FORMAT'
            }
        
        # Chercher l'agent dans la base
        try:
            agent = Agent.objects.get(matricule=matricule)
            
            # Vérifier si agent actif
            agent_actif = agent.statut_professionnel == 'ACTIF'
            
            # Vérifier correspondance CNI (si l'agent a un citoyen lié)
            correspondance_cni = False
            if agent.citoyen:
                correspondance_cni = agent.citoyen.numero_cni == numero_cni
            
            succes = agent_actif and correspondance_cni
            
            return {
                'succes': succes,
                'verifications': {
                    'matriculeExiste': True,
                    'matriculeFormatValide': True,
                    'agentActif': agent_actif,
                    'correspondanceCNI': correspondance_cni
                },
                'donneesAgent': {
                    'matricule': agent.matricule,
                    'typeForce': agent.type_force,
                    'grade': agent.grade or '',
                    'brigadeId': str(agent.brigade.id) if agent.brigade else None,
                    'brigadeNom': agent.brigade.nom if agent.brigade else None,
                    'dateRecrutement': agent.date_recrutement.isoformat() if agent.date_recrutement else None,
                    'statut': agent.statut_professionnel
                },
                'erreurs': [] if succes else [
                    'Agent inactif' if not agent_actif else '',
                    'CNI ne correspond pas au matricule' if not correspondance_cni else ''
                ],
                'dateVerification': timezone.now(),
                'sourceVerification': 'BASE_LOCALE'
            }
            
        except Agent.DoesNotExist:
            # Matricule non trouvé
            # En production, on appellerait l'API DGPN/HCGN/DNPC
            
            return {
                'succes': False,
                'verifications': {
                    'matriculeExiste': False,
                    'matriculeFormatValide': True,
                    'agentActif': False,
                    'correspondanceCNI': False
                },
                'erreurs': ['Matricule non trouvé dans la base. Vérification DGPN/HCGN/DNPC requise.'],
                'dateVerification': timezone.now(),
                'sourceVerification': 'SIMULATION'  # En production: 'DGPN_API' ou 'HCGN_API' ou 'DNPC_API'
            }


class ServiceOTP:
    """Service de gestion des OTP (One-Time Password)"""
    
    # Stockage temporaire des OTP (en production, utiliser Redis ou base de données)
    _otp_storage: Dict[str, Dict] = {}
    
    @classmethod
    def generer_otp(cls, telephone: str) -> Tuple[str, Dict]:
        """
        Génère et stocke un code OTP
        
        Args:
            telephone: Numéro de téléphone
        
        Returns:
            (code_otp, configuration)
        """
        # Générer code 6 chiffres
        code_otp = str(random.randint(100000, 999999))
        
        # Configuration OTP
        date_envoi = timezone.now()
        date_expiration = date_envoi + timedelta(minutes=10)
        
        config = {
            'methode': 'WHATSAPP',  # ou 'SMS'
            'telephone': telephone,
            'code': code_otp,
            'dateEnvoi': date_envoi.isoformat(),
            'dateExpiration': date_expiration.isoformat(),
            'nombreTentatives': 0,
            'maxTentatives': 3
        }
        
        # Stocker (clé: téléphone)
        cls._otp_storage[telephone] = config
        
        # TODO: Envoyer OTP via WhatsApp Business API
        # service_whatsapp.envoyer_otp(telephone, code_otp)
        
        return code_otp, config
    
    @classmethod
    def verifier_otp(cls, telephone: str, code_otp: str, supprimer_apres_verification: bool = False) -> Dict:
        """
        Vérifie un code OTP
        
        Args:
            telephone: Numéro de téléphone
            code_otp: Code à vérifier
            supprimer_apres_verification: Si True, supprime l'OTP après vérification réussie
        
        Returns:
            {
                'valide': bool,
                'message': str,
                'erreur': str (optionnel)
            }
        """
        if telephone not in cls._otp_storage:
            return {
                'valide': False,
                'message': 'Aucun code OTP trouvé pour ce numéro',
                'erreur': 'OTP_NOT_FOUND'
            }
        
        config = cls._otp_storage[telephone]
        
        # Vérifier expiration
        date_expiration = timezone.datetime.fromisoformat(config['dateExpiration'].replace('Z', '+00:00'))
        if timezone.now() > date_expiration:
            del cls._otp_storage[telephone]
            return {
                'valide': False,
                'message': 'Code OTP expiré. Veuillez en demander un nouveau.',
                'erreur': 'OTP_EXPIRED'
            }
        
        # Vérifier nombre de tentatives
        if config['nombreTentatives'] >= config['maxTentatives']:
            del cls._otp_storage[telephone]
            return {
                'valide': False,
                'message': 'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.',
                'erreur': 'MAX_ATTEMPTS_REACHED'
            }
        
        # Vérifier le code
        config['nombreTentatives'] += 1
        
        if config['code'] == code_otp:
            # Code valide
            config['verifie'] = True
            config['dateVerification'] = timezone.now().isoformat()
            
            # Supprimer seulement si demandé explicitement (pour l'étape 2 d'inscription)
            if supprimer_apres_verification:
                del cls._otp_storage[telephone]
            
            return {
                'valide': True,
                'message': 'Code OTP validé avec succès'
            }
        else:
            # Code invalide
            if config['nombreTentatives'] >= config['maxTentatives']:
                del cls._otp_storage[telephone]
                return {
                    'valide': False,
                    'message': 'Code incorrect. Nombre maximum de tentatives atteint.',
                    'erreur': 'INVALID_CODE_MAX_ATTEMPTS'
                }
            else:
                tentatives_restantes = config['maxTentatives'] - config['nombreTentatives']
                return {
                    'valide': False,
                    'message': f'Code incorrect. {tentatives_restantes} tentative(s) restante(s).',
                    'erreur': 'INVALID_CODE'
                }
    
    @classmethod
    def generer_numero_unique(cls, type_inscription: str = 'CITOYEN') -> str:
        """
        Génère un numéro unique d'identification
        
        Args:
            type_inscription: 'CITOYEN' ou 'AGENT'
        
        Returns:
            Format: CIT-2024-001234 ou AGT-2024-001234
        """
        annee = timezone.now().year
        prefix = 'CIT' if type_inscription == 'CITOYEN' else 'AGT'
        
        # Générer séquence (6 chiffres)
        # En production, utiliser une séquence auto-incrémentée dans la base
        sequence = random.randint(100000, 999999)
        
        # Vérifier unicité (en production, vérifier dans la base)
        numero = f"{prefix}-{annee}-{sequence:06d}"
        
        return numero

