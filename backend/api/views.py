from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from .gemini_service import get_gemini_service
from .models import Citoyen
from .serializers import (
    CitoyenSerializer, CitoyenCreateSerializer,
    PrestationSerializer
)
import json


class MessageType:
    """Enum for message types"""
    MIGRATE_ORGANISM = "MIGRATE_ORGANISM"
    UPDATE_ORGANISM = "UPDATE_ORGANISM"
    CONSULTATION = "CONSULTATION"
    HOSPITALIZATION = "HOSPITALIZATION"
    MIGRATE_PRESCRIPTION = "MIGRATE_PRESCRIPTION"
    MIGRATE_DOCUMENT = "MIGRATE_DOCUMENT"
    UPDATE_PRESCRIPTION = "UPDATE_PRESCRIPTION"
    UPDATE_DOCUMENT = "UPDATE_DOCUMENT"
    PHARMACY_AS_PRESTATION = "PHARMACY_AS_PRESTATION"
    SAVE_ORGANISM = "SAVE_ORGANISM"
    QUOTE = "QUOTE"
    SAVE_DOCUMENT = "SAVE_DOCUMENT"
    SAVE_PATIENT = "SAVE_PATIENT"
    MIGRATE_PRESTATION = "MIGRATE_PRESTATION"
    CREATE_PASSPORT_MEDICAL = "CREATE_PASSPORT_MEDICAL"
    VISIT = "VISIT"
    SAVE_MEDECIN = "SAVE_MEDECIN"
    UPDATE_PATIENT = "UPDATE_PATIENT"
    CUSTOM = "CUSTOM"
    PHARMACY = "PHARMACY"
    AMBULATORY = "AMBULATORY"
    UPDATE_MEDECIN = "UPDATE_MEDECIN"
    MIGRATE_MEDECIN = "MIGRATE_MEDECIN"
    RADIOLOGY = "RADIOLOGY"
    ANALYSIS = "ANALYSIS"
    UPDATE_PRESTATION = "UPDATE_PRESTATION"
    MIGRATE_PATIENT = "MIGRATE_PATIENT"
    SAVE_PRESTATION = "SAVE_PRESTATION"
    EVACUATION = "EVACUATION"
    SAVE_PRESCRIPTION = "SAVE_PRESCRIPTION"
    SAVE_PRESCRIPTION_FINANCIERE = "SAVE_PRESCRIPTION_FINANCIERE"  # Added


@method_decorator(csrf_exempt, name='dispatch')
class PrestationView(APIView):
    """
    API endpoint to handle prestation messages from the medical billing system.
    """
    permission_classes = [AllowAny]  # Adjust based on your authentication needs
    
    def post(self, request):
        try:
            data = request.data
            
            # Validate messageType
            message_type = data.get('messageType')
            valid_message_types = [
                MessageType.MIGRATE_ORGANISM,
                MessageType.UPDATE_ORGANISM,
                MessageType.CONSULTATION,
                MessageType.HOSPITALIZATION,
                MessageType.MIGRATE_PRESCRIPTION,
                MessageType.MIGRATE_DOCUMENT,
                MessageType.UPDATE_PRESCRIPTION,
                MessageType.UPDATE_DOCUMENT,
                MessageType.PHARMACY_AS_PRESTATION,
                MessageType.SAVE_ORGANISM,
                MessageType.QUOTE,
                MessageType.SAVE_DOCUMENT,
                MessageType.SAVE_PATIENT,
                MessageType.MIGRATE_PRESTATION,
                MessageType.CREATE_PASSPORT_MEDICAL,
                MessageType.VISIT,
                MessageType.SAVE_MEDECIN,
                MessageType.UPDATE_PATIENT,
                MessageType.CUSTOM,
                MessageType.PHARMACY,
                MessageType.AMBULATORY,
                MessageType.UPDATE_MEDECIN,
                MessageType.MIGRATE_MEDECIN,
                MessageType.RADIOLOGY,
                MessageType.ANALYSIS,
                MessageType.UPDATE_PRESTATION,
                MessageType.MIGRATE_PATIENT,
                MessageType.SAVE_PRESTATION,
                MessageType.EVACUATION,
                MessageType.SAVE_PRESCRIPTION,
                MessageType.SAVE_PRESCRIPTION_FINANCIERE,  # Now supported
            ]
            
            if message_type not in valid_message_types:
                return Response(
                    {
                        'error': f'Invalid messageType: {message_type}',
                        'valid_types': valid_message_types
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Process the message based on type
            if message_type == MessageType.SAVE_PRESCRIPTION_FINANCIERE:
                return self.handle_save_prescription_financiere(data)
            elif message_type == MessageType.CONSULTATION:
                return self.handle_consultation(data)
            # Add other handlers as needed
            
            return Response(
                {'message': f'Message type {message_type} received successfully'},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def handle_save_prescription_financiere(self, data):
        """Handle SAVE_PRESCRIPTION_FINANCIERE messages"""
        # Extract relevant data
        organism_id = data.get('organismId')
        organism_name = data.get('organismName')
        action = data.get('action')
        prestation_data = data.get('data', {})
        
        # TODO: Implement your business logic here
        # - Save to database
        # - Process the prescription
        # - Send notifications, etc.
        
        return Response(
            {
                'message': 'Prescription financière sauvegardée avec succès',
                'organismId': organism_id,
                'organismName': organism_name,
                'action': action,
                'prestationId': prestation_data.get('identifier'),
            },
            status=status.HTTP_201_CREATED
        )
    
    def handle_consultation(self, data):
        """Handle CONSULTATION messages"""
        # TODO: Implement consultation handling
        return Response(
            {'message': 'Consultation reçue avec succès'},
            status=status.HTTP_200_OK
        )


@method_decorator(csrf_exempt, name='dispatch')
class GeminiChatView(APIView):
    """
    API endpoint pour chat avec Gemini AI
    """
    permission_classes = [AllowAny]  # Peut être changé en IsAuthenticated
    
    def post(self, request):
        try:
            prompt = request.data.get('prompt')
            if not prompt:
                return Response(
                    {'error': 'Le champ "prompt" est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            gemini_service = get_gemini_service()
            if not gemini_service:
                return Response(
                    {'error': 'Gemini AI n\'est pas configuré. Vérifiez GEMINI_API_KEY'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Paramètres optionnels
            temperature = request.data.get('temperature', 0.7)
            max_tokens = request.data.get('max_tokens', 2048)
            
            response_text = gemini_service.generate_text(
                prompt,
                temperature=temperature,
                max_output_tokens=max_tokens
            )
            
            return Response(
                {
                    'response': response_text,
                    'status': 'success'
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class GeminiAnalyzePrestationView(APIView):
    """
    API endpoint pour analyser une prestation avec Gemini AI
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            prestation_data = request.data.get('prestation')
            if not prestation_data:
                return Response(
                    {'error': 'Le champ "prestation" est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            gemini_service = get_gemini_service()
            if not gemini_service:
                return Response(
                    {'error': 'Gemini AI n\'est pas configuré. Vérifiez GEMINI_API_KEY'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            analysis = gemini_service.analyze_prestation(prestation_data)
            
            return Response(
                analysis,
                status=status.HTTP_200_OK if analysis.get('status') == 'success' else status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CitoyenViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les citoyens
    """
    queryset = Citoyen.objects.all()
    serializer_class = CitoyenSerializer
    permission_classes = [AllowAny]  # Peut être changé en IsAuthenticated
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'prenom', 'numero_cni', 'numero_securite_sociale']
    filterset_fields = ['statut', 'genre', 'situation_matrimoniale', 'nationalite', 'region_naissance']
    ordering_fields = ['date_creation', 'nom', 'prenom']
    ordering = ['-date_creation']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CitoyenCreateSerializer
        return CitoyenSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Recherche avancée de citoyens
        """
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {'error': 'Le paramètre "q" est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        citoyens = Citoyen.objects.filter(
            models.Q(nom__icontains=query) |
            models.Q(prenom__icontains=query) |
            models.Q(numero_cni__icontains=query)
        )
        
        serializer = self.get_serializer(citoyens, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def biometrie(self, request, pk=None):
        """
        Récupérer les informations biométriques d'un citoyen
        """
        citoyen = self.get_object()
        if not citoyen.biometrie:
            return Response(
                {'message': 'Aucune information biométrique disponible'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        from .serializers import BiometrieSerializer
        serializer = BiometrieSerializer(citoyen.biometrie)
        return Response(serializer.data)

