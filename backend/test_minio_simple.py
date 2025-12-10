"""
Script simple pour tester MinIO sans Django
"""
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
endpoint = os.getenv('MINIO_ENDPOINT', 'http://localhost:9000')
access_key = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
secret_key = os.getenv('MINIO_SECRET_KEY', 'minioadmin123')
bucket_name = os.getenv('MINIO_BUCKET_NAME', 'citizen-portal')

print("🔍 Test de connexion à MinIO...")
print(f"Endpoint: {endpoint}")
print(f"Bucket: {bucket_name}")

try:
    # Créer le client S3
    s3_client = boto3.client(
        's3',
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        verify=False
    )
    
    # Lister les buckets
    print("\n📦 Buckets disponibles:")
    response = s3_client.list_buckets()
    for bucket in response['Buckets']:
        print(f"  - {bucket['Name']}")
    
    # Vérifier si le bucket existe
    if bucket_name in [b['Name'] for b in response['Buckets']]:
        print(f"\n✅ Bucket '{bucket_name}' trouvé!")
        
        # Tester l'upload
        print("\n📤 Test d'upload...")
        test_content = b"Test file from Django backend"
        test_key = 'test/django_test.txt'
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=test_content,
            ContentType='text/plain'
        )
        print(f"✅ Fichier uploadé: {test_key}")
        
        # Tester le téléchargement
        print("\n📥 Test de téléchargement...")
        response = s3_client.get_object(Bucket=bucket_name, Key=test_key)
        content = response['Body'].read()
        if content == test_content:
            print("✅ Contenu vérifié avec succès!")
        
        # Lister les objets dans le bucket
        print(f"\n📋 Objets dans '{bucket_name}':")
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if 'Contents' in response:
            for obj in response['Contents']:
                print(f"  - {obj['Key']} ({obj['Size']} bytes)")
        else:
            print("  (vide)")
        
        # Nettoyer
        s3_client.delete_object(Bucket=bucket_name, Key=test_key)
        print(f"\n🧹 Fichier de test supprimé")
        
        print("\n✅ Tous les tests MinIO ont réussi!")
        
    else:
        print(f"\n⚠️  Le bucket '{bucket_name}' n'existe pas.")
        print("Créez-le via l'interface MinIO (http://localhost:9001)")
        
except Exception as e:
    print(f"\n❌ Erreur: {str(e)}")
    import traceback
    traceback.print_exc()

