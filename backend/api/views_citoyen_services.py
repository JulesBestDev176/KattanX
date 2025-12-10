"""
Vues API pour les services citoyens : documents, dénonciations, plaintes, revenus
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q, Sum
from django.db import models
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    Document, Denonciation, Plainte, Transaction, Revenu,
    Citoyen, Utilisateur
)
from .serializers import (
    DocumentSerializer, DenonciationSerializer, PlainteSerializer,
    TransactionSerializer, RevenuSerializer
)


@method_decorator(csrf_exempt, name='dispatch')
class DocumentListView(APIView):
    """Liste des documents d'un citoyen"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Récupérer le citoyen depuis l'utilisateur connecté
            utilisateur = request.user
            if not hasattr(utilisateur, 'numero_cni'):
                return Response(
                    {'error': 'Utilisateur non associé à un citoyen'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            documents = Document.objects.filter(citoyen=citoyen)
            
            serializer = DocumentSerializer(documents, many=True)
            return Response({
                'documents': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class DenonciationListView(APIView):
    """Liste des dénonciations d'un citoyen"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            utilisateur = request.user
            if not hasattr(utilisateur, 'numero_cni'):
                return Response(
                    {'error': 'Utilisateur non associé à un citoyen'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            # Filtres optionnels
            status_filter = request.query_params.get('status')
            queryset = Denonciation.objects.filter(citoyen=citoyen)
            
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            denonciations = queryset.order_by('-date_creation')
            serializer = DenonciationSerializer(denonciations, many=True)
            
            # Statistiques
            total = denonciations.count()
            pending = denonciations.filter(status='pending').count()
            verified = denonciations.filter(status='verified').count()
            rejected = denonciations.filter(status='rejected').count()
            
            return Response({
                'denonciations': serializer.data,
                'total': total,
                'pending': pending,
                'verified': verified,
                'rejected': rejected
            }, status=status.HTTP_200_OK)
            
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class DenonciationCreateView(APIView):
    """Créer une dénonciation"""
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        try:
            utilisateur = request.user
            if not hasattr(utilisateur, 'numero_cni'):
                return Response(
                    {'error': 'Utilisateur non associé à un citoyen'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            data = request.data.copy()
            data['citoyen'] = citoyen.id
            
            serializer = DenonciationSerializer(data=data)
            if serializer.is_valid():
                denonciation = serializer.save()
                return Response({
                    'success': True,
                    'denonciation': DenonciationSerializer(denonciation).data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class DenonciationDetailView(APIView):
    """Détails d'une dénonciation"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, denonciation_id):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            denonciation = Denonciation.objects.get(
                id=denonciation_id,
                citoyen=citoyen
            )
            
            serializer = DenonciationSerializer(denonciation)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Denonciation.DoesNotExist:
            return Response(
                {'error': 'Dénonciation non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class PlainteListView(APIView):
    """Liste des plaintes d'un citoyen"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            # Filtres optionnels
            type_filter = request.query_params.get('type')
            status_filter = request.query_params.get('status')
            
            queryset = Plainte.objects.filter(citoyen=citoyen)
            
            if type_filter:
                queryset = queryset.filter(type=type_filter)
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            plaintes = queryset.order_by('-date_creation')
            serializer = PlainteSerializer(plaintes, many=True)
            
            # Statistiques
            total = plaintes.count()
            recues = plaintes.filter(type='reçue').count()
            deposees = plaintes.filter(type='déposée').count()
            
            return Response({
                'plaintes': serializer.data,
                'total': total,
                'reçues': recues,
                'déposées': deposees
            }, status=status.HTTP_200_OK)
            
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class PlainteCreateView(APIView):
    """Déposer une plainte"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            data = request.data.copy()
            data['citoyen'] = citoyen.id
            data['type'] = 'déposée'  # Par défaut, c'est une plainte déposée
            
            serializer = PlainteSerializer(data=data)
            if serializer.is_valid():
                plainte = serializer.save()
                return Response({
                    'success': True,
                    'plainte': PlainteSerializer(plainte).data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class PlainteDetailView(APIView):
    """Détails d'une plainte"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, plainte_id):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            plainte = Plainte.objects.get(
                id=plainte_id,
                citoyen=citoyen
            )
            
            serializer = PlainteSerializer(plainte)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Plainte.DoesNotExist:
            return Response(
                {'error': 'Plainte non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class RevenuView(APIView):
    """Consulter le solde et les transactions"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            # Créer le revenu s'il n'existe pas
            revenu, created = Revenu.objects.get_or_create(citoyen=citoyen)
            
            # Récupérer les transactions
            transactions = Transaction.objects.filter(citoyen=citoyen).order_by('-date')[:50]
            
            serializer = RevenuSerializer(revenu)
            transactions_serializer = TransactionSerializer(transactions, many=True)
            
            # Statistiques
            gains_totaux = Transaction.objects.filter(
                citoyen=citoyen,
                type='gain',
                statut='complete'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
            transferts = Transaction.objects.filter(
                citoyen=citoyen,
                type='transfert',
                statut='complete'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
            retraits = Transaction.objects.filter(
                citoyen=citoyen,
                type='retrait',
                statut='complete'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
            return Response({
                'solde': float(revenu.solde),
                'transactions': transactions_serializer.data,
                'statistiques': {
                    'gainsTotaux': float(gains_totaux),
                    'transferts': float(transferts),
                    'retraits': float(retraits)
                }
            }, status=status.HTTP_200_OK)
            
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class TransferView(APIView):
    """Effectuer un transfert"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            revenu, created = Revenu.objects.get_or_create(citoyen=citoyen)
            
            montant = float(request.data.get('montant', 0))
            type_transfert = request.data.get('type', 'mobile_money')
            destinataire = request.data.get('destinataire', '')
            
            if montant <= 0:
                return Response(
                    {'error': 'Le montant doit être supérieur à 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if montant > float(revenu.solde):
                return Response(
                    {'error': 'Solde insuffisant'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Créer la transaction
            transaction = Transaction.objects.create(
                citoyen=citoyen,
                type='transfert',
                montant=montant,
                description=f'Transfert {type_transfert} vers {destinataire}',
                destinataire=destinataire,
                statut='en_attente',
                details={'type': type_transfert}
            )
            
            # Débiter le solde (en production, faire cela après confirmation du transfert)
            revenu.solde -= montant
            revenu.save()
            
            # Marquer la transaction comme complète (en production, attendre confirmation)
            transaction.statut = 'complete'
            transaction.date_completion = timezone.now()
            transaction.save()
            
            return Response({
                'success': True,
                'transaction': TransactionSerializer(transaction).data,
                'nouveauSolde': float(revenu.solde)
            }, status=status.HTTP_201_CREATED)
            
        except Citoyen.DoesNotExist:
            return Response(
                {'error': 'Citoyen non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

