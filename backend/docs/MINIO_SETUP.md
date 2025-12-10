# 📦 Configuration MinIO pour le Stockage d'Images

## Vue d'ensemble

Ce guide explique comment configurer MinIO (compatible S3) pour stocker les images dans votre application Django.

## Qu'est-ce que MinIO ?

MinIO est un serveur de stockage d'objets compatible avec l'API Amazon S3. Il est idéal pour :
- Stocker des photos d'identité
- Stocker des signatures numérisées
- Stocker des documents
- Stocker toute autre ressource binaire

## 📋 Prérequis

- Python 3.8+
- Django 5.0+
- Accès à un serveur MinIO (local ou distant)

## 🚀 Installation

### 1. Installer les dépendances Python

```bash
pip install django-storages boto3
```

Ajoutez à `requirements.txt` :
```
django-storages==1.14.2
boto3==1.34.0
```

### 2. Installation de MinIO (Option 1 : Local avec Docker)

```bash
# Créer un conteneur MinIO
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  -v minio_data:/data \
  minio/minio server /data --console-address ":9001"
```

Accédez à l'interface web : http://localhost:9001

### 3. Installation de MinIO (Option 2 : Serveur dédié)

Téléchargez MinIO depuis : https://min.io/download

```bash
# Linux/Mac
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /data

# Windows
# Télécharger l'exécutable depuis le site officiel
```

## ⚙️ Configuration Django

### 1. Mettre à jour settings.py

```python
# backend/config/settings.py

INSTALLED_APPS = [
    # ... autres apps
    'storages',  # Ajouter django-storages
]

# Configuration MinIO
USE_S3 = os.environ.get('USE_S3', 'False') == 'True'

if USE_S3:
    # MinIO/S3 settings
    AWS_ACCESS_KEY_ID = os.environ.get('MINIO_ACCESS_KEY', 'minioadmin')
    AWS_SECRET_ACCESS_KEY = os.environ.get('MINIO_SECRET_KEY', 'minioadmin123')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('MINIO_BUCKET_NAME', 'citizen-portal')
    AWS_S3_ENDPOINT_URL = os.environ.get('MINIO_ENDPOINT', 'http://localhost:9000')
    AWS_S3_USE_SSL = os.environ.get('MINIO_USE_SSL', 'False') == 'True'
    AWS_S3_VERIFY = False  # Pour MinIO local sans certificat SSL
    
    # Configuration du stockage
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
    
    # URLs publiques
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('MINIO_CUSTOM_DOMAIN', None)
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    
    # Permissions
    AWS_DEFAULT_ACL = 'public-read'  # Pour MinIO, utilisez 'public-read'
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False
else:
    # Stockage local (développement)
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'
```

### 2. Créer un service de stockage personnalisé

Créez `backend/api/storage.py` :

```python
from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    """Stockage personnalisé pour les médias"""
    location = 'media'
    file_overwrite = False

class PhotoStorage(S3Boto3Storage):
    """Stockage pour les photos d'identité"""
    location = 'media/photos'
    file_overwrite = False

class SignatureStorage(S3Boto3Storage):
    """Stockage pour les signatures"""
    location = 'media/signatures'
    file_overwrite = False

class DocumentStorage(S3Boto3Storage):
    """Stockage pour les documents"""
    location = 'media/documents'
    file_overwrite = False
```

### 3. Mettre à jour les modèles

Modifiez `backend/api/models/citoyen.py` pour utiliser le stockage personnalisé :

```python
from api.storage import PhotoStorage, SignatureStorage

class PhotoIdentite(models.Model):
    # ... autres champs
    url = models.URLField(blank=True, null=True)
    fichier = models.ImageField(
        storage=PhotoStorage(),
        upload_to='photos/',
        blank=True,
        null=True
    )
    # ... reste du modèle

class Signature(models.Model):
    # ... autres champs
    url = models.URLField(blank=True, null=True)
    fichier = models.ImageField(
        storage=SignatureStorage(),
        upload_to='signatures/',
        blank=True,
        null=True
    )
    # ... reste du modèle
```

## 🔧 Configuration MinIO

### 1. Créer un bucket

Via l'interface web (http://localhost:9001) :
1. Connectez-vous avec `minioadmin` / `minioadmin123`
2. Cliquez sur "Create Bucket"
3. Nom : `citizen-portal`
4. Région : `us-east-1` (par défaut)
5. Cochez "Versioning" si nécessaire

### 2. Configurer les politiques d'accès

Créez une politique pour permettre l'accès public en lecture :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::citizen-portal/*"]
    }
  ]
}
```

### 3. Variables d'environnement

Ajoutez à votre fichier `.env` :

```env
# MinIO Configuration
USE_S3=True
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=citizen-portal
MINIO_ENDPOINT=http://localhost:9000
MINIO_USE_SSL=False
MINIO_CUSTOM_DOMAIN=  # Optionnel : domaine personnalisé
```

## 📝 Utilisation dans le code

### Upload d'une photo

```python
from api.models import PhotoIdentite
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
import io

def upload_photo(citoyen_id, image_file):
    """Upload une photo d'identité"""
    # Ouvrir et traiter l'image
    img = Image.open(image_file)
    
    # Redimensionner si nécessaire (300x400 pour CNI)
    img.thumbnail((300, 400), Image.Resampling.LANCZOS)
    
    # Convertir en bytes
    img_io = io.BytesIO()
    img.save(img_io, format='JPEG', quality=95)
    img_io.seek(0)
    
    # Créer le fichier uploadé
    uploaded_file = InMemoryUploadedFile(
        img_io, None, f'photo_{citoyen_id}.jpg',
        'image/jpeg', img_io.tell(), None
    )
    
    # Créer l'objet PhotoIdentite
    photo = PhotoIdentite.objects.create(
        format='JPEG',
        resolution='300x400',
        taille_octets=img_io.tell(),
        date_capture=timezone.now(),
        conforme_iso=True,
        background_couleur='blanc',
        qualite_score=95,
        fichier=uploaded_file  # Upload vers MinIO
    )
    
    # L'URL sera automatiquement générée
    return photo
```

### Récupérer l'URL d'une image

```python
photo = PhotoIdentite.objects.get(id=photo_id)

# URL complète
url = photo.fichier.url  # http://localhost:9000/citizen-portal/media/photos/photo_xxx.jpg

# Ou utiliser le champ url si défini
if photo.url:
    url = photo.url
```

## 🧪 Tests

### Test de connexion MinIO

Créez `backend/api/management/commands/test_minio.py` :

```python
from django.core.management.base import BaseCommand
import boto3
from django.conf import settings

class Command(BaseCommand):
    help = 'Teste la connexion à MinIO'

    def handle(self, *args, **options):
        try:
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                verify=False
            )
            
            # Lister les buckets
            response = s3_client.list_buckets()
            self.stdout.write(self.style.SUCCESS('✓ Connexion MinIO réussie!'))
            self.stdout.write(f'Buckets disponibles: {[b["Name"] for b in response["Buckets"]]}')
            
            # Tester l'upload
            test_content = b"Test file content"
            s3_client.put_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key='test/test.txt',
                Body=test_content
            )
            self.stdout.write(self.style.SUCCESS('✓ Upload test réussi!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Erreur: {str(e)}'))
```

Exécutez :
```bash
python manage.py test_minio
```

## 🔒 Sécurité

### 1. Accès privé (recommandé pour production)

Pour des images privées, utilisez des URLs signées :

```python
from django.core.files.storage import default_storage
from django.conf import settings
import boto3
from datetime import timedelta

def get_signed_url(file_path, expiration=3600):
    """Génère une URL signée temporaire"""
    s3_client = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': file_path
        },
        ExpiresIn=expiration
    )
    
    return url
```

### 2. Permissions par bucket

Créez des buckets séparés pour différents types de fichiers :
- `citizen-portal-photos` : Photos publiques
- `citizen-portal-documents` : Documents privés
- `citizen-portal-signatures` : Signatures privées

## 📊 Monitoring

### Interface MinIO

Accédez à http://localhost:9001 pour :
- Voir l'utilisation du stockage
- Gérer les buckets
- Configurer les politiques
- Voir les logs

### Via API

```python
import boto3
from django.conf import settings

s3_client = boto3.client(
    's3',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
)

# Obtenir la taille d'un bucket
response = s3_client.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
total_size = sum(obj['Size'] for obj in response.get('Contents', []))
print(f"Taille totale: {total_size / 1024 / 1024:.2f} MB")
```

## 🚀 Déploiement Production

### Variables d'environnement production

```env
USE_S3=True
MINIO_ACCESS_KEY=votre_cle_secrete
MINIO_SECRET_KEY=votre_secret_secret
MINIO_BUCKET_NAME=citizen-portal-prod
MINIO_ENDPOINT=https://minio.votredomaine.com
MINIO_USE_SSL=True
MINIO_CUSTOM_DOMAIN=https://cdn.votredomaine.com
```

### Backup

MinIO supporte la réplication automatique. Configurez-la pour la redondance.

## 📚 Ressources

- [Documentation MinIO](https://min.io/docs/)
- [django-storages](https://django-storages.readthedocs.io/)
- [boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024

