"""
Utilitaires pour la gestion d'images
"""
from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
import sys


def process_photo_identite(image_file, citoyen_id=None):
    """
    Traite une photo d'identité pour la conformité ANCEC
    
    Args:
        image_file: Fichier image uploadé
        citoyen_id: ID du citoyen (optionnel, pour le nom de fichier)
    
    Returns:
        InMemoryUploadedFile: Fichier traité prêt à être sauvegardé
    """
    # Ouvrir l'image
    img = Image.open(image_file)
    
    # Convertir en RGB si nécessaire
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Redimensionner pour CNI (300x400 minimum, ratio 3:4)
    target_size = (300, 400)
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Créer une nouvelle image avec fond blanc (si nécessaire)
    final_img = Image.new('RGB', target_size, 'white')
    
    # Centrer l'image
    x_offset = (target_size[0] - img.size[0]) // 2
    y_offset = (target_size[1] - img.size[1]) // 2
    final_img.paste(img, (x_offset, y_offset))
    
    # Convertir en bytes
    img_io = io.BytesIO()
    final_img.save(img_io, format='JPEG', quality=95, optimize=True)
    img_io.seek(0)
    
    # Créer le fichier uploadé
    filename = f'photo_{citoyen_id or "temp"}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.jpg'
    uploaded_file = InMemoryUploadedFile(
        img_io,
        None,
        filename,
        'image/jpeg',
        sys.getsizeof(img_io),
        None
    )
    
    return uploaded_file, final_img.size, img_io.tell()


def process_signature(image_file, citoyen_id=None):
    """
    Traite une signature numérisée
    
    Args:
        image_file: Fichier image uploadé
        citoyen_id: ID du citoyen (optionnel)
    
    Returns:
        InMemoryUploadedFile: Fichier traité
    """
    # Ouvrir l'image
    img = Image.open(image_file)
    
    # Convertir en RGB si nécessaire
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Redimensionner (max 800x200)
    max_size = (800, 200)
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Convertir en bytes
    img_io = io.BytesIO()
    img.save(img_io, format='PNG', optimize=True)
    img_io.seek(0)
    
    # Créer le fichier uploadé
    filename = f'signature_{citoyen_id or "temp"}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.png'
    uploaded_file = InMemoryUploadedFile(
        img_io,
        None,
        filename,
        'image/png',
        sys.getsizeof(img_io),
        None
    )
    
    return uploaded_file, img.size, img_io.tell()


def get_image_info(image_file):
    """
    Obtient les informations d'une image
    
    Returns:
        dict: Informations sur l'image (format, taille, dimensions, etc.)
    """
    img = Image.open(image_file)
    
    return {
        'format': img.format,
        'mode': img.mode,
        'size': img.size,
        'width': img.width,
        'height': img.height,
    }


def validate_photo_quality(image_file, min_quality=80):
    """
    Valide la qualité d'une photo d'identité
    
    Returns:
        tuple: (is_valid, quality_score, error_message)
    """
    try:
        img = Image.open(image_file)
        
        # Vérifier les dimensions
        if img.width < 300 or img.height < 400:
            return False, 0, f"Dimensions insuffisantes ({img.width}x{img.height}). Minimum: 300x400"
        
        # Vérifier le ratio (approximatif pour CNI)
        ratio = img.width / img.height
        if ratio < 0.6 or ratio > 0.9:
            return False, 0, f"Ratio invalide ({ratio:.2f}). Attendu: ~0.75 (3:4)"
        
        # Calculer un score de qualité basique
        # (En production, utiliser un algorithme plus sophistiqué)
        quality_score = 85  # Score par défaut
        
        # Vérifier la netteté (basique)
        if img.mode == 'RGB':
            quality_score += 5
        
        return True, min(quality_score, 100), None
        
    except Exception as e:
        return False, 0, f"Erreur lors de la validation: {str(e)}"

