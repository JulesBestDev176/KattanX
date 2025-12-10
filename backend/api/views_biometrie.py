"""
Vues API pour la gestion biométrique
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from api.services.biometrie import ServiceBiometrie
from api.services.verification import ServiceVerification
from api.models import Citoyen, EmpreinteDigitale
from api.models.enums import Doigt


@method_decorator(csrf_exempt, name='dispatch')
class VerifierEmpreinteView(APIView):
    """
    API endpoint pour vérifier une empreinte digitale (1:1)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            citoyen_id = request.data.get('citoyen_id')
            doigt = request.data.get('doigt')
            template = request.data.get('template')
            
            if not all([citoyen_id, doigt, template]):
                return Response(
                    {'error': 'Les champs citoyen_id, doigt et template sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Créer un objet EmpreinteDigitale temporaire pour la validation
            empreinte_capturee = EmpreinteDigitale(
                doigt=doigt,
                template=template,
                format=request.data.get('format', 'ISO_19794_2'),
                qualite=request.data.get('qualite', 90),
                resolution=request.data.get('resolution', 500)
            )
            
            resultat = ServiceBiometrie.verifier_empreinte_1_1(
                citoyen_id,
                empreinte_capturee,
                doigt
            )
            
            return Response(resultat, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class IdentifierPersonneView(APIView):
    """
    API endpoint pour identifier une personne par empreinte (1:N)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            doigt = request.data.get('doigt')
            template = request.data.get('template')
            
            if not all([doigt, template]):
                return Response(
                    {'error': 'Les champs doigt et template sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            empreinte_capturee = EmpreinteDigitale(
                doigt=doigt,
                template=template,
                format=request.data.get('format', 'ISO_19794_2'),
                qualite=request.data.get('qualite', 90),
                resolution=request.data.get('resolution', 500)
            )
            
            resultats = ServiceBiometrie.identifier_personne_1_n(
                empreinte_capturee,
                doigt
            )
            
            return Response(
                {
                    'resultats': resultats,
                    'nombre_trouve': len(resultats)
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class VerifierReconnaissanceFacialeView(APIView):
    """
    API endpoint pour vérifier une reconnaissance faciale (1:1)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            citoyen_id = request.data.get('citoyen_id')
            encodage_facial = request.data.get('encodage_facial')
            
            if not all([citoyen_id, encodage_facial]):
                return Response(
                    {'error': 'Les champs citoyen_id et encodage_facial sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            resultat = ServiceBiometrie.verifier_reconnaissance_faciale(
                citoyen_id,
                encodage_facial
            )
            
            return Response(resultat, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class ValiderFormatCNIView(APIView):
    """
    API endpoint pour valider le format d'un numéro CNI
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            numero_cni = request.data.get('numero_cni')
            
            if not numero_cni:
                return Response(
                    {'error': 'Le champ numero_cni est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            is_valid, error = ServiceVerification.valider_format_cni(numero_cni)
            
            if is_valid:
                date_naissance = ServiceVerification.extraire_date_naissance_cni(numero_cni)
                return Response(
                    {
                        'valide': True,
                        'numero_cni': numero_cni,
                        'date_naissance': date_naissance.isoformat() if date_naissance else None
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        'valide': False,
                        'error': error
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class ValiderMatriculeView(APIView):
    """
    API endpoint pour valider le format d'un matricule
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            matricule = request.data.get('matricule')
            type_force = request.data.get('type_force')  # POLICE_NATIONALE, GENDARMERIE_NATIONALE, SAPEURS_POMPIERS
            
            if not all([matricule, type_force]):
                return Response(
                    {'error': 'Les champs matricule et type_force sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if type_force == 'POLICE_NATIONALE':
                is_valid, error = ServiceVerification.valider_format_matricule_police(matricule)
            elif type_force == 'GENDARMERIE_NATIONALE':
                is_valid, error = ServiceVerification.valider_format_matricule_gendarmerie(matricule)
            elif type_force == 'SAPEURS_POMPIERS':
                is_valid, error = ServiceVerification.valider_format_matricule_pompiers(matricule)
            else:
                return Response(
                    {'error': 'Type de force invalide'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if is_valid:
                return Response(
                    {
                        'valide': True,
                        'matricule': matricule
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        'valide': False,
                        'error': error
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

