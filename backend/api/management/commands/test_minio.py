"""
Commande Django pour tester la connexion à MinIO
"""
from django.core.management.base import BaseCommand
import boto3
from django.conf import settings


class Command(BaseCommand):
    help = 'Teste la connexion à MinIO'

    def handle(self, *args, **options):
        if not getattr(settings, 'USE_S3', False):
            self.stdout.write(self.style.WARNING('MinIO n\'est pas activé. Définissez USE_S3=True dans .env'))
            return
        
        try:
            self.stdout.write(self.style.SUCCESS('Test de connexion à MinIO...'))
            
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                verify=settings.AWS_S3_VERIFY if hasattr(settings, 'AWS_S3_VERIFY') else False
            )
            
            # Lister les buckets
            response = s3_client.list_buckets()
            self.stdout.write(self.style.SUCCESS('✓ Connexion MinIO réussie!'))
            self.stdout.write(f'Buckets disponibles: {[b["Name"] for b in response["Buckets"]]}')
            
            # Vérifier si le bucket existe
            bucket_name = settings.AWS_STORAGE_BUCKET_NAME
            buckets = [b["Name"] for b in response["Buckets"]]
            
            if bucket_name not in buckets:
                self.stdout.write(self.style.WARNING(f'⚠ Le bucket "{bucket_name}" n\'existe pas.'))
                self.stdout.write('Créez-le via l\'interface MinIO (http://localhost:9001)')
            else:
                self.stdout.write(self.style.SUCCESS(f'✓ Bucket "{bucket_name}" trouvé'))
                
                # Tester l'upload
                try:
                    test_content = b"Test file content from Django"
                    test_key = 'test/django_test.txt'
                    
                    s3_client.put_object(
                        Bucket=bucket_name,
                        Key=test_key,
                        Body=test_content,
                        ContentType='text/plain'
                    )
                    self.stdout.write(self.style.SUCCESS('✓ Upload test réussi!'))
                    
                    # Tester le téléchargement
                    response = s3_client.get_object(Bucket=bucket_name, Key=test_key)
                    content = response['Body'].read()
                    if content == test_content:
                        self.stdout.write(self.style.SUCCESS('✓ Download test réussi!'))
                    
                    # Nettoyer
                    s3_client.delete_object(Bucket=bucket_name, Key=test_key)
                    self.stdout.write(self.style.SUCCESS('✓ Fichier de test supprimé'))
                    
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'✗ Erreur lors du test upload/download: {str(e)}'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Erreur de connexion: {str(e)}'))
            self.stdout.write(self.style.WARNING('\nVérifiez:'))
            self.stdout.write('  1. Que MinIO est démarré (docker ou serveur)')
            self.stdout.write('  2. Que MINIO_ENDPOINT est correct dans .env')
            self.stdout.write('  3. Que MINIO_ACCESS_KEY et MINIO_SECRET_KEY sont corrects')
            return

