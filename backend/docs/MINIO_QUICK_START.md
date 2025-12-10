# 🚀 Guide Rapide MinIO - Démarrage en 5 minutes

## Installation rapide avec Docker

```bash
# 1. Démarrer MinIO
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  -v minio_data:/data \
  minio/minio server /data --console-address ":9001"
```

## Configuration Django

### 1. Installer les dépendances

```bash
pip install django-storages boto3 Pillow
```

### 2. Configurer .env

Ajoutez à votre fichier `.env` :

```env
USE_S3=True
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=citizen-portal
MINIO_ENDPOINT=http://localhost:9000
MINIO_USE_SSL=False
```

### 3. Créer le bucket

1. Ouvrez http://localhost:9001
2. Connectez-vous : `minioadmin` / `minioadmin123`
3. Créez un bucket nommé `citizen-portal`

### 4. Tester la connexion

```bash
python manage.py test_minio
```

## Utilisation

### Upload d'une photo

```python
from api.models import PhotoIdentite
from api.utils.images import process_photo_identite

# Traiter et uploader
processed_file, size, file_size = process_photo_identite(image_file, citoyen_id)

photo = PhotoIdentite.objects.create(
    format='JPEG',
    resolution=f'{size[0]}x{size[1]}',
    taille_octets=file_size,
    fichier=processed_file  # Upload automatique vers MinIO
)

# URL de l'image
url = photo.image_url  # http://localhost:9000/citizen-portal/media/photos/...
```

### Via API

```bash
curl -X POST http://localhost:8000/api/images/upload-photo/ \
  -F "image=@photo.jpg" \
  -F "citoyen_id=uuid-du-citoyen"
```

## Structure des dossiers MinIO

```
citizen-portal/
├── media/
│   ├── photos/          # Photos d'identité
│   ├── signatures/       # Signatures
│   └── documents/        # Documents
```

## Vérification

- Interface web : http://localhost:9001
- API endpoint : http://localhost:9000
- Test connexion : `python manage.py test_minio`

---

**Pour plus de détails** : Voir [MINIO_SETUP.md](./MINIO_SETUP.md)

