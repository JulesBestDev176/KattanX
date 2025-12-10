"""
Vues API pour les alertes d'urgence "Je suis en danger"
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.db.models import Q
import math

from .models import (
    AlerteUrgence, Citoyen, Brigade, Utilisateur
)
from .serializers import AlerteUrgenceSerializer


def calculer_distance_km(lat1, lon1, lat2, lon2):
    """
    Calcule la distance en kilomètres entre deux points GPS
    Utilise la formule de Haversine
    """
    # Rayon de la Terre en kilomètres
    R = 6371.0
    
    # Conversion en radians
    lat1_rad = math.radians(float(lat1))
    lon1_rad = math.radians(float(lon1))
    lat2_rad = math.radians(float(lat2))
    lon2_rad = math.radians(float(lon2))
    
    # Différences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Formule de Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return round(distance, 2)


def trouver_brigades_proches(latitude, longitude, rayon_km=50, limite=5):
    """
    Trouve les brigades les plus proches d'un point GPS
    """
    brigades_proches = []
    
    # Récupérer toutes les brigades actives
    brigades = Brigade.objects.filter(statut='ACTIF')
    
    for brigade in brigades:
        if brigade.coordonnees_gps and 'latitude' in brigade.coordonnees_gps and 'longitude' in brigade.coordonnees_gps:
            lat_brigade = brigade.coordonnees_gps['latitude']
            lon_brigade = brigade.coordonnees_gps['longitude']
            
            distance = calculer_distance_km(latitude, longitude, lat_brigade, lon_brigade)
            
            if distance <= rayon_km:
                brigades_proches.append({
                    'brigade': brigade,
                    'distance': distance
                })
    
    # Trier par distance et prendre les plus proches
    brigades_proches.sort(key=lambda x: x['distance'])
    return brigades_proches[:limite]


@method_decorator(csrf_exempt, name='dispatch')
class AlerteUrgenceCreateView(APIView):
    """Créer une alerte d'urgence 'Je suis en danger'"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            utilisateur = request.user
            if not hasattr(utilisateur, 'numero_cni'):
                return Response(
                    {'error': 'Utilisateur non associé à un citoyen'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            # Récupérer les données
            type_alerte = request.data.get('type', 'danger_imminent')
            description = request.data.get('description', '')
            localisation = request.data.get('localisation', '')
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            
            if not latitude or not longitude:
                return Response(
                    {'error': 'Les coordonnées GPS sont requises'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Trouver les brigades proches
            brigades_proches = trouver_brigades_proches(
                float(latitude),
                float(longitude),
                rayon_km=50,  # 50 km de rayon
                limite=5  # Maximum 5 brigades
            )
            
            if not brigades_proches:
                return Response(
                    {'error': 'Aucune brigade trouvée à proximité'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Créer l'alerte
            alerte = AlerteUrgence.objects.create(
                citoyen=citoyen,
                type=type_alerte,
                description=description,
                localisation=localisation,
                coordonnees_gps={'latitude': float(latitude), 'longitude': float(longitude)},
                statut='envoyee'
            )
            
            # Notifier les brigades
            brigades_notifiees = []
            for item in brigades_proches:
                brigade = item['brigade']
                distance = item['distance']
                
                brigades_notifiees.append({
                    'brigade_id': str(brigade.id),
                    'brigade_nom': brigade.nom,
                    'brigade_code': brigade.code,
                    'brigade_type': brigade.type_force,
                    'brigade_telephone': brigade.telephone,
                    'distance_km': distance,
                    'date_notification': timezone.now().isoformat()
                })
                
                # TODO: Envoyer notification push/WhatsApp aux agents de la brigade
                # Pour l'instant, on enregistre juste l'alerte
            
            alerte.brigades_notifiees = brigades_notifiees
            alerte.save()
            
            serializer = AlerteUrgenceSerializer(alerte)
            
            return Response({
                'success': True,
                'message': 'Alerte envoyée aux brigades les plus proches',
                'alerte': serializer.data,
                'brigades_notifiees': brigades_notifiees
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


@method_decorator(csrf_exempt, name='dispatch')
class AlerteUrgenceListView(APIView):
    """Liste des alertes d'urgence d'un citoyen"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            alertes = AlerteUrgence.objects.filter(citoyen=citoyen).order_by('-date_creation')
            serializer = AlerteUrgenceSerializer(alertes, many=True)
            
            return Response({
                'alertes': serializer.data
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
class AlerteUrgenceDetailView(APIView):
    """Détails d'une alerte d'urgence"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, alerte_id):
        try:
            utilisateur = request.user
            citoyen = Citoyen.objects.get(numero_cni=utilisateur.numero_cni)
            
            alerte = AlerteUrgence.objects.get(
                id=alerte_id,
                citoyen=citoyen
            )
            
            serializer = AlerteUrgenceSerializer(alerte)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except AlerteUrgence.DoesNotExist:
            return Response(
                {'error': 'Alerte non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

