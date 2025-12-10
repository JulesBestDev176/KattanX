"""
Commande Django pour tester la connexion à la base de données Supabase
"""
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings


class Command(BaseCommand):
    help = 'Teste la connexion à la base de données Supabase'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Test de connexion à Supabase...'))
        
        try:
            # Test de connexion
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                self.stdout.write(self.style.SUCCESS(f'✓ Connexion réussie!'))
                self.stdout.write(f'  PostgreSQL version: {version[0]}')
                
                # Afficher les informations de connexion
                db_settings = settings.DATABASES['default']
                self.stdout.write(f'\nConfiguration:')
                self.stdout.write(f'  Host: {db_settings["HOST"]}')
                self.stdout.write(f'  Port: {db_settings["PORT"]}')
                self.stdout.write(f'  Database: {db_settings["NAME"]}')
                self.stdout.write(f'  User: {db_settings["USER"]}')
                
                # Test de requête simple
                cursor.execute("SELECT current_database(), current_user;")
                db_info = cursor.fetchone()
                self.stdout.write(f'\nBase de données actuelle: {db_info[0]}')
                self.stdout.write(f'Utilisateur actuel: {db_info[1]}')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Erreur de connexion: {str(e)}'))
            self.stdout.write(self.style.WARNING('\nVérifiez:'))
            self.stdout.write('  1. Que le fichier .env est correctement configuré')
            self.stdout.write('  2. Que DB_PASSWORD contient le bon mot de passe Supabase')
            self.stdout.write('  3. Que votre IP est autorisée dans Supabase (Settings > Database > Connection Pooling)')
            return

