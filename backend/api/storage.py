"""
Services de stockage personnalisés pour MinIO/S3
"""
from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class MediaStorage(S3Boto3Storage):
    """Stockage personnalisé pour les médias"""
    location = 'media'
    file_overwrite = False
    default_acl = 'public-read'


class PhotoStorage(S3Boto3Storage):
    """Stockage pour les photos d'identité"""
    location = 'media/photos'
    file_overwrite = False
    default_acl = 'public-read'


class SignatureStorage(S3Boto3Storage):
    """Stockage pour les signatures"""
    location = 'media/signatures'
    file_overwrite = False
    default_acl = 'public-read'


class DocumentStorage(S3Boto3Storage):
    """Stockage pour les documents"""
    location = 'media/documents'
    file_overwrite = False
    default_acl = 'public-read'


class EmpreinteStorage(S3Boto3Storage):
    """Stockage pour les empreintes digitales"""
    location = 'media/empreintes'
    file_overwrite = False
    default_acl = 'private'  # Empreintes en privé pour sécurité


class PrivateStorage(S3Boto3Storage):
    """Stockage privé (nécessite URLs signées)"""
    location = 'media/private'
    file_overwrite = False
    default_acl = 'private'

