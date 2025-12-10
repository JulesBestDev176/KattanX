"""
Vues API pour l'upload d'images
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from api.models import PhotoIdentite, Signature, Citoyen
from api.models.enums import FormatPhoto, FormatSignature
from api.utils.images import (
    process_photo_identite,
    process_signature,
    validate_photo_quality,
    get_image_info
)


@method_decorator(csrf_exempt, name='dispatch')
class UploadPhotoIdentiteView(APIView):
    """
    API endpoint pour uploader une photo d'identité
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            citoyen_id = request.data.get('citoyen_id')
            image_file = request.FILES.get('image')
            
            if not image_file:
                return Response(
                    {'error': 'Le fichier image est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Valider la qualité
            is_valid, quality_score, error = validate_photo_quality(image_file)
            if not is_valid:
                return Response(
                    {
                        'error': error,
                        'quality_score': quality_score
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Traiter l'image
            processed_file, size, file_size = process_photo_identite(image_file, citoyen_id)
            
            # Obtenir les infos de l'image originale
            image_info = get_image_info(image_file)
            
            # Créer l'objet PhotoIdentite
            photo = PhotoIdentite.objects.create(
                format=FormatPhoto.JPEG,
                resolution=f'{size[0]}x{size[1]}',
                taille_octets=file_size,
                date_capture=timezone.now(),
                conforme_iso=True,
                background_couleur='blanc',
                qualite_score=quality_score,
                fichier=processed_file  # Upload vers MinIO ou local
            )
            
            # Si un citoyen_id est fourni, lier la photo
            if citoyen_id:
                try:
                    citoyen = Citoyen.objects.get(id=citoyen_id)
                    if citoyen.biometrie:
                        citoyen.biometrie.photo_identite = photo
                        citoyen.biometrie.save()
                except Citoyen.DoesNotExist:
                    pass
            
            return Response(
                {
                    'id': str(photo.id),
                    'url': photo.image_url,
                    'resolution': photo.resolution,
                    'taille_octets': photo.taille_octets,
                    'qualite_score': photo.qualite_score,
                    'conforme_iso': photo.conforme_iso,
                    'message': 'Photo uploadée avec succès'
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class UploadSignatureView(APIView):
    """
    API endpoint pour uploader une signature
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            citoyen_id = request.data.get('citoyen_id')
            image_file = request.FILES.get('image')
            type_capture = request.data.get('type_capture', 'TABLETTE')
            
            if not image_file:
                return Response(
                    {'error': 'Le fichier image est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Traiter l'image
            processed_file, size, file_size = process_signature(image_file, citoyen_id)
            
            # Créer l'objet Signature
            signature = Signature.objects.create(
                format=FormatSignature.PNG,
                taille_octets=file_size,
                date_capture=timezone.now(),
                type_capture=type_capture,
                fichier=processed_file  # Upload vers MinIO ou local
            )
            
            # Si un citoyen_id est fourni, lier la signature
            if citoyen_id:
                try:
                    citoyen = Citoyen.objects.get(id=citoyen_id)
                    if citoyen.biometrie:
                        citoyen.biometrie.signature = signature
                        citoyen.biometrie.save()
                except Citoyen.DoesNotExist:
                    pass
            
            return Response(
                {
                    'id': str(signature.id),
                    'url': signature.image_url,
                    'taille_octets': signature.taille_octets,
                    'type_capture': signature.type_capture,
                    'message': 'Signature uploadée avec succès'
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class ValidateImageView(APIView):
    """
    API endpoint pour valider une image avant upload
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            image_file = request.FILES.get('image')
            
            if not image_file:
                return Response(
                    {'error': 'Le fichier image est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtenir les infos
            image_info = get_image_info(image_file)
            
            # Valider la qualité
            is_valid, quality_score, error = validate_photo_quality(image_file)
            
            return Response(
                {
                    'valid': is_valid,
                    'quality_score': quality_score,
                    'error': error,
                    'image_info': image_info
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

