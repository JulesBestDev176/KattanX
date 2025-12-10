"""
Vues API pour l'upload d'empreintes digitales
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from api.models import EmpreinteDigitale
from api.models.enums import Doigt, FormatEmpreinte
import base64
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


@method_decorator(csrf_exempt, name='dispatch')
class UploadEmpreinteView(APIView):
    """
    API endpoint pour uploader une empreinte digitale
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            doigt = request.data.get('doigt', 'POUCE_DROIT')
            qualite = request.data.get('qualite', 95)
            dispositif = request.data.get('dispositif', 'Capteur téléphone')
            template_data = request.data.get('template')  # Données biométriques encodées
            fichier_empreinte = request.FILES.get('fichier')  # Fichier binaire optionnel
            
            if not template_data and not fichier_empreinte:
                return Response(
                    {'error': 'Template ou fichier empreinte requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Créer le fichier à partir du template ou utiliser le fichier uploadé
            if fichier_empreinte:
                # Utiliser le fichier uploadé directement
                empreinte_file = fichier_empreinte
                file_size = fichier_empreinte.size
            elif template_data:
                # Créer un fichier à partir du template (base64 ou binaire)
                try:
                    # Décoder si base64
                    if isinstance(template_data, str):
                        # Essayer de décoder en base64
                        try:
                            template_bytes = base64.b64decode(template_data)
                        except:
                            # Si ce n'est pas du base64, utiliser directement
                            template_bytes = template_data.encode('utf-8')
                    else:
                        template_bytes = template_data
                    
                    # Créer un fichier en mémoire
                    file_io = io.BytesIO(template_bytes)
                    filename = f'empreinte_{doigt}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.dat'
                    empreinte_file = InMemoryUploadedFile(
                        file_io,
                        None,
                        filename,
                        'application/octet-stream',
                        len(template_bytes),
                        None
                    )
                    file_size = len(template_bytes)
                except Exception as e:
                    return Response(
                        {'error': f'Erreur lors du traitement du template: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {'error': 'Template ou fichier empreinte requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Créer l'objet EmpreinteDigitale
            empreinte = EmpreinteDigitale.objects.create(
                doigt=doigt,
                template=template_data if isinstance(template_data, str) else None,
                format=FormatEmpreinte.ISO_19794_2,  # Format standard
                qualite=qualite,
                date_capture=timezone.now(),
                dispositif_capture=dispositif,
                taille_octets=file_size,
                resolution=500,  # DPI standard
                fichier=empreinte_file  # Upload vers MinIO ou local
            )
            
            return Response(
                {
                    'success': True,
                    'empreinte_id': str(empreinte.id),
                    'url': empreinte.file_url,
                    'doigt': empreinte.get_doigt_display(),
                    'qualite': empreinte.qualite,
                    'taille_octets': empreinte.taille_octets,
                    'message': 'Empreinte enregistrée avec succès'
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

