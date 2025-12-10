"""
Commande Django pour configurer le bucket MinIO avec les dossiers nécessaires
"""
from django.core.management.base import BaseCommand
import boto3
from django.conf import settings


class Command(BaseCommand):
    help = 'Configure le bucket MinIO avec les dossiers nécessaires'

    def handle(self, *args, **options):
        if not getattr(settings, 'USE_S3', False):
            self.stdout.write(self.style.WARNING('MinIO n\'est pas activé. Définissez USE_S3=True dans .env'))
            return
        
        try:
            self.stdout.write(self.style.SUCCESS('Configuration du bucket MinIO...'))
            
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                verify=False
            )
            
            bucket_name = settings.AWS_STORAGE_BUCKET_NAME
            
            # Créer les dossiers de base (en créant des fichiers vides)
            folders = [
                'media/photos/',
                'media/signatures/',
                'media/documents/',
                'media/private/'
            ]
            
            for folder in folders:
                try:
                    # Créer un fichier "placeholder" pour créer le dossier
                    s3_client.put_object(
                        Bucket=bucket_name,
                        Key=f'{folder}.gitkeep',
                        Body=b'',
                        ContentType='text/plain'
                    )
                    self.stdout.write(self.style.SUCCESS(f'✓ Dossier créé: {folder}'))
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'⚠ Erreur pour {folder}: {str(e)}'))
            
            # Configurer la politique d'accès public pour les photos et signatures
            try:
                policy = {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": "*",
                            "Action": ["s3:GetObject"],
                            "Resource": [
                                f"arn:aws:s3:::{bucket_name}/media/photos/*",
                                f"arn:aws:s3:::{bucket_name}/media/signatures/*"
                            ]
                        }
                    ]
                }
                
                s3_client.put_bucket_policy(
                    Bucket=bucket_name,
                    Policy=str(policy).replace("'", '"')
                )
                self.stdout.write(self.style.SUCCESS('✓ Politique d\'accès public configurée'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'⚠ Impossible de configurer la politique: {str(e)}'))
                self.stdout.write(self.style.WARNING('Configurez-la manuellement via l\'interface MinIO'))
            
            self.stdout.write(self.style.SUCCESS('\n✅ Configuration terminée!'))
            self.stdout.write(f'\n📋 Interface MinIO: {settings.AWS_S3_ENDPOINT_URL.replace(":9000", ":9001")}')
            self.stdout.write(f'   Identifiants: minioadmin / minioadmin123')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Erreur: {str(e)}'))
            import traceback
            traceback.print_exc()

