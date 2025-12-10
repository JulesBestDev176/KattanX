"""
Vues API pour l'authentification et l'inscription
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.db import transaction
import uuid
import re

from .models import Utilisateur
from .models.enums import RoleUtilisateur, StatutInscription
from .serializers import (
    InscriptionEtape1Serializer, InscriptionEtape2Serializer, InscriptionEtape3Serializer,
    LoginSerializer, UtilisateurSerializer, UtilisateurCreateSerializer
)
from .services.verification_inscription import (
    ServiceVerificationANCEC, ServiceVerificationAgent, ServiceOTP
)


@method_decorator(csrf_exempt, name='dispatch')
class InscriptionCitoyenEtape1View(APIView):
    """Étape 1 d'inscription citoyen : Informations de base + vérification ANCEC"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Log pour debug
        print(f"[DEBUG] InscriptionEtape1 - Données reçues: {request.data}")
        
        serializer = InscriptionEtape1Serializer(data=request.data)
        if not serializer.is_valid():
            print(f"[DEBUG] InscriptionEtape1 - Erreurs de validation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        donnees = serializer.validated_data
        print(f"[DEBUG] InscriptionEtape1 - Données validées: {donnees}")
        
        # Vérification ANCEC
        print("[DEBUG] InscriptionEtape1 - Début vérification ANCEC")
        verification_ancec = ServiceVerificationANCEC.verifier_cni(donnees)
        print(f"[DEBUG] InscriptionEtape1 - Résultat vérification ANCEC: {verification_ancec.get('succes', False)}")
        
        if not verification_ancec.get('succes', False):
            return Response({
                'success': False,
                'message': 'Vérification ANCEC échouée',
                'verification_ancec': verification_ancec
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer session temporaire (en production, utiliser Redis ou base de données)
        session_id = f"SESSION-{uuid.uuid4().hex[:12].upper()}"
        
        # Stocker les données de l'étape 1 (en production, utiliser Redis)
        # Pour l'instant, on retourne juste le résultat
        
        return Response({
            'success': True,
            'session_id': session_id,
            'message': 'Étape 1 validée',
            'verification_ancec': verification_ancec,
            'prochaine_etape': 'etape2'
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class InscriptionAgentEtape1View(APIView):
    """Étape 1 d'inscription agent : Informations de base + matricule + vérifications"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = InscriptionEtape1Serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        donnees = serializer.validated_data
        matricule = donnees.get('matricule')
        
        if not matricule:
            return Response({
                'success': False,
                'message': 'Le matricule est requis pour l\'inscription agent'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérification ANCEC
        verification_ancec = ServiceVerificationANCEC.verifier_cni(donnees)
        
        if not verification_ancec.get('succes', False):
            return Response({
                'success': False,
                'message': 'Vérification ANCEC échouée',
                'verification_ancec': verification_ancec
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérification Agent
        verification_agent = ServiceVerificationAgent.verifier_matricule(
            matricule, donnees['numero_cni']
        )
        
        if not verification_agent.get('succes', False):
            return Response({
                'success': False,
                'message': 'Vérification agent échouée',
                'verification_ancec': verification_ancec,
                'verification_agent': verification_agent
            }, status=status.HTTP_400_BAD_REQUEST)
        
        session_id = f"SESSION-{uuid.uuid4().hex[:12].upper()}"
        
        return Response({
            'success': True,
            'session_id': session_id,
            'message': 'Étape 1 validée',
            'verification_ancec': verification_ancec,
            'verification_agent': verification_agent,
            'prochaine_etape': 'etape2'
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class EnvoyerOTPView(APIView):
    """Envoie un code OTP par WhatsApp"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        telephone = request.data.get('telephone')
        
        if not telephone:
            return Response({
                'success': False,
                'message': 'Le numéro de téléphone est requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Valider format téléphone
        if not re.match(r'^\+221[0-9]{9}$', telephone):
            return Response({
                'success': False,
                'message': 'Format de téléphone invalide. Attendu: +221XXXXXXXXX'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer et envoyer OTP
        code_otp, config = ServiceOTP.generer_otp(telephone)
        
        # TODO: Envoyer réellement via WhatsApp Business API
        # Pour l'instant, on retourne le code (en développement uniquement)
        
        return Response({
            'success': True,
            'message': 'Code OTP envoyé par WhatsApp',
            'code_otp': code_otp,  # À retirer en production
            'date_expiration': config['dateExpiration'],
            'max_tentatives': config['maxTentatives']
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class InscriptionEtape2View(APIView):
    """Étape 2 d'inscription : Authentification (OTP + mot de passe)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = InscriptionEtape2Serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        donnees = serializer.validated_data
        telephone = donnees['telephone']
        code_otp = donnees['code_otp']
        
        # Vérifier OTP et le supprimer après vérification (étape 2 d'inscription)
        verification_otp = ServiceOTP.verifier_otp(telephone, code_otp, supprimer_apres_verification=True)
        
        if not verification_otp['valide']:
            return Response({
                'success': False,
                'message': verification_otp['message'],
                'erreur': verification_otp.get('erreur')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer numéro unique
        type_inscription = request.data.get('type_inscription', 'CITOYEN')
        numero_unique = ServiceOTP.generer_numero_unique(type_inscription)
        
        # Vérifier unicité (en production, vérifier dans la base)
        while Utilisateur.objects.filter(numero_identification_unique=numero_unique).exists():
            numero_unique = ServiceOTP.generer_numero_unique(type_inscription)
        
        return Response({
            'success': True,
            'message': 'Étape 2 validée',
            'numero_unique': numero_unique,
            'prochaine_etape': 'etape3'
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class InscriptionEtape3View(APIView):
    """Étape 3 d'inscription : Biométrie (Photo + Empreinte)"""
    permission_classes = [AllowAny]
    
    @transaction.atomic
    def post(self, request):
        print(f"[DEBUG] InscriptionEtape3 - Données reçues: {request.data}")
        
        serializer = InscriptionEtape3Serializer(data=request.data)
        if not serializer.is_valid():
            print(f"[DEBUG] InscriptionEtape3 - Erreurs de validation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        donnees = serializer.validated_data
        
        # Récupérer les données des étapes précédentes
        donnees_etape1 = donnees.get('donnees_etape1', {})
        donnees_etape2 = donnees.get('donnees_etape2', {})
        
        if not donnees_etape1 or not donnees_etape2:
            return Response({
                'success': False,
                'message': 'Les données des étapes précédentes sont requises'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"[DEBUG] InscriptionEtape3 - Données validées: photo_id={donnees.get('photo_id')}, empreinte_id={donnees.get('empreinte_id')}")
        
        # Créer l'utilisateur
        type_inscription = donnees_etape2.get('type_inscription', 'CITOYEN')
        
        # Normaliser les clés (camelCase -> snake_case)
        numero_cni = donnees_etape1.get('numero_cni') or donnees_etape1.get('numeroCNI')
        date_naissance = donnees_etape1.get('date_naissance') or donnees_etape1.get('dateNaissance')
        lieu_naissance = donnees_etape1.get('lieu_naissance') or donnees_etape1.get('lieuNaissance')
        
        # Convertir date_naissance si c'est une string
        if isinstance(date_naissance, str):
            from datetime import datetime
            try:
                date_naissance = datetime.fromisoformat(date_naissance.replace('Z', '+00:00')).date()
            except:
                date_naissance = datetime.strptime(date_naissance, '%Y-%m-%d').date()
        
        utilisateur_data = {
            'numero_identification_unique': donnees_etape2.get('numero_unique'),
            'numero_cni': numero_cni,
            'nom': donnees_etape1.get('nom', ''),
            'prenom': donnees_etape1.get('prenom', ''),
            'date_naissance': date_naissance,
            'lieu_naissance': lieu_naissance,
            'genre': donnees_etape1.get('genre', 'MASCULIN'),
            'telephone': donnees_etape2.get('telephone', ''),
            'telephone_verifie': True,
            'email': donnees_etape2.get('email'),
            'email_verifie': bool(donnees_etape2.get('email')),
            'statut_inscription': StatutInscription.INSCRIPTION_COMPLETE,
            'date_activation': timezone.now(),
            'etapes_inscription': {
                'etape1': {'completee': True, 'dateCompletion': timezone.now().isoformat()},
                'etape2': {'completee': True, 'dateCompletion': timezone.now().isoformat()},
                'etape3': {'completee': True, 'dateCompletion': timezone.now().isoformat()}
            }
        }
        
        # Rôles par défaut
        if type_inscription == 'AGENT':
            utilisateur_data['roles'] = [RoleUtilisateur.CITOYEN, RoleUtilisateur.AGENT_TERRAIN]
        else:
            utilisateur_data['roles'] = [RoleUtilisateur.CITOYEN]
        
        # Créer utilisateur
        utilisateur = Utilisateur.objects.create(**utilisateur_data)
        utilisateur.set_password(donnees_etape2['mot_de_passe'])
        
        # Stocker biométrie
        photo_url = donnees.get('photo_url') or request.data.get('photo_url')
        empreinte_id = donnees.get('empreinte_id') or request.data.get('empreinte_id')
        photo_id = donnees.get('photo_id') or request.data.get('photo_id')
        
        biometrie_data = {
            'photoProfilURL': photo_url,
            'photoId': photo_id,
            'empreinteDigitaleIds': [empreinte_id] if empreinte_id else [],
            'biometrieValidee': True,
            'dateValidation': timezone.now().isoformat()
        }
        utilisateur.biometrie = biometrie_data
        utilisateur.save()
        
        print(f"[DEBUG] InscriptionEtape3 - Utilisateur créé: {utilisateur.numero_identification_unique}")
        
        # Générer tokens JWT
        refresh = RefreshToken.for_user(utilisateur)
        
        return Response({
            'success': True,
            'message': 'Inscription complète',
            'utilisateur': UtilisateurSerializer(utilisateur).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'expires_in': 3600
            }
        }, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """Connexion utilisateur"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        identifiant = serializer.validated_data['identifiant']
        mot_de_passe = serializer.validated_data['mot_de_passe']
        
        # Chercher l'utilisateur par email, téléphone ou numéro unique
        utilisateur = None
        
        if '@' in identifiant:
            # Email
            try:
                utilisateur = Utilisateur.objects.get(email=identifiant)
            except Utilisateur.DoesNotExist:
                pass
        elif identifiant.startswith('+221'):
            # Téléphone
            try:
                utilisateur = Utilisateur.objects.get(telephone=identifiant)
            except Utilisateur.DoesNotExist:
                pass
        elif identifiant.startswith(('CIT-', 'AGT-', 'CTRL-')):
            # Numéro unique
            try:
                utilisateur = Utilisateur.objects.get(numero_identification_unique=identifiant)
            except Utilisateur.DoesNotExist:
                pass
        
        if not utilisateur:
            return Response({
                'success': False,
                'message': 'Identifiant ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Vérifier mot de passe
        if not utilisateur.check_password(mot_de_passe):
            utilisateur.incrementer_tentatives_echouees()
            return Response({
                'success': False,
                'message': 'Identifiant ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Vérifier compte verrouillé
        if utilisateur.compte_verrouille:
            return Response({
                'success': False,
                'message': 'Compte verrouillé. Veuillez contacter l\'administrateur.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier statut inscription
        if utilisateur.statut_inscription not in [
            StatutInscription.INSCRIPTION_COMPLETE,
            StatutInscription.COMPTE_ACTIF
        ]:
            return Response({
                'success': False,
                'message': 'Inscription non complète. Veuillez terminer votre inscription.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Réinitialiser tentatives
        utilisateur.reinitialiser_tentatives()
        utilisateur.derniere_connexion = timezone.now()
        utilisateur.save(update_fields=['derniere_connexion', 'tentatives_connexion_echouees', 'compte_verrouille', 'date_verrouillage'])
        
        # Générer tokens JWT
        refresh = RefreshToken.for_user(utilisateur)
        
        return Response({
            'success': True,
            'utilisateur': UtilisateurSerializer(utilisateur).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'expires_in': 3600
            }
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class VerifierOTPView(APIView):
    """Vérifie un code OTP"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        telephone = request.data.get('telephone')
        code_otp = request.data.get('code_otp')
        
        if not telephone or not code_otp:
            return Response({
                'success': False,
                'message': 'Téléphone et code OTP sont requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        verification = ServiceOTP.verifier_otp(telephone, code_otp)
        
        if verification['valide']:
            return Response({
                'success': True,
                'message': verification['message']
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': verification['message'],
                'erreur': verification.get('erreur')
            }, status=status.HTTP_400_BAD_REQUEST)

