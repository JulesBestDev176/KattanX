"""
Commande Django pour initialiser les organismes officiels du Sénégal
"""
from django.core.management.base import BaseCommand
from api.models import Organisme, EcoleFormation, CodeOfficiel


class Command(BaseCommand):
    help = 'Initialise les organismes officiels du Sénégal, les écoles et les codes officiels'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Initialisation des organismes officiels...'))
        
        # Créer les organismes
        organismes_data = [
            {
                'nom': 'Agence Nationale de la Carte d\'Identité et de l\'État Civil',
                'sigle': 'ANCEC',
                'ministere': 'Ministère de l\'Intérieur',
                'role': 'Gestion des CNI biométriques et de l\'état civil',
                'telephone': '+221 33 889 40 00',
                'email': 'contact@ancec.sn',
                'site_web': 'https://ancec.sn',
                'adresse': 'Dakar, Sénégal',
                'services': [
                    'Délivrance CNI biométrique',
                    'Enregistrement état civil',
                    'Gestion base de données citoyens',
                    'Authentification biométrique'
                ]
            },
            {
                'nom': 'Direction Générale de la Police Nationale',
                'sigle': 'DGPN',
                'ministere': 'Ministère de l\'Intérieur',
                'role': 'Administration de la Police Nationale',
                'telephone': '17',
                'email': 'contact@police.sn',
                'adresse': 'Dakar, Sénégal',
                'commandement': 'Directeur Général de la Police Nationale',
                'ecoles': [
                    'École Nationale de Police (ENP)',
                    'École Nationale des Officiers de Police (ENOP)'
                ]
            },
            {
                'nom': 'Haut Commandement de la Gendarmerie Nationale',
                'sigle': 'HCGN',
                'ministere': 'Ministère des Forces Armées',
                'role': 'Administration de la Gendarmerie Nationale',
                'telephone': '17',
                'email': 'contact@gendarmerie.sn',
                'adresse': 'Dakar, Sénégal',
                'commandement': 'Haut-Commandant de la Gendarmerie',
                'ecoles': [
                    'École de Gendarmerie de Ouakam',
                    'École des Officiers de la Gendarmerie Nationale (EOGN)'
                ]
            },
            {
                'nom': 'Direction Nationale de la Protection Civile',
                'sigle': 'DNPC',
                'ministere': 'Ministère de l\'Intérieur',
                'role': 'Gestion des Sapeurs-Pompiers et protection civile',
                'telephone': '18',
                'email': 'contact@protectioncivile.sn',
                'adresse': 'Dakar, Sénégal',
                'commandement': 'Directeur National de la Protection Civile',
                'ecoles': [
                    'École Nationale des Sapeurs-Pompiers (ENSP)'
                ]
            },
            {
                'nom': 'Direction des Transports Terrestres',
                'sigle': 'DTT',
                'ministere': 'Ministère des Infrastructures et des Transports',
                'role': 'Gestion des permis de conduire et immatriculations',
                'telephone': '+221 33 889 11 00',
                'email': 'contact@dtt.sn',
                'adresse': 'Dakar, Sénégal',
                'services': [
                    'Délivrance permis de conduire',
                    'Immatriculation véhicules',
                    'Visite technique',
                    'Gestion infractions routières'
                ]
            },
            {
                'nom': 'Direction Générale des Impôts et des Domaines',
                'sigle': 'DGID',
                'ministere': 'Ministère des Finances et du Budget',
                'role': 'Identification fiscale',
                'telephone': '+221 33 889 35 00',
                'email': 'contact@impots.sn',
                'site_web': 'https://impots.sn'
            },
            {
                'nom': 'Agence Nationale de la Statistique et de la Démographie',
                'sigle': 'ANSD',
                'ministere': 'Ministère de l\'Économie, du Plan et de la Coopération',
                'role': 'Statistiques et recensement de la population',
                'telephone': '+221 33 869 21 39',
                'email': 'ansd@ansd.sn',
                'site_web': 'https://ansd.sn'
            },
            {
                'nom': 'Ministère de la Santé et de l\'Action Sociale',
                'sigle': 'MSAS',
                'role': 'Gestion des données sanitaires',
                'telephone': '+221 33 889 18 00'
            }
        ]
        
        for org_data in organismes_data:
            org, created = Organisme.objects.get_or_create(
                sigle=org_data['sigle'],
                defaults=org_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Créé: {org.sigle}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ Existant: {org.sigle}'))
        
        # Créer les écoles
        dgpn = Organisme.objects.get(sigle='DGPN')
        hcgn = Organisme.objects.get(sigle='HCGN')
        dnpc = Organisme.objects.get(sigle='DNPC')
        
        ecoles_data = [
            {
                'nom': 'École Nationale de Police',
                'sigle': 'ENP',
                'lieu': 'Dakar',
                'type_formation': 'Formation initiale sous-officiers',
                'duree_formation': '12 mois',
                'admission': 'Concours + aptitude physique',
                'organisme': dgpn
            },
            {
                'nom': 'École Nationale des Officiers de Police',
                'sigle': 'ENOP',
                'lieu': 'Dakar',
                'type_formation': 'Formation officiers',
                'duree_formation': '24 mois',
                'admission': 'Bac + 2 minimum + concours',
                'organisme': dgpn
            },
            {
                'nom': 'École de Gendarmerie de Ouakam',
                'lieu': 'Ouakam, Dakar',
                'type_formation': 'Formation gendarmes et sous-officiers',
                'duree_formation': '12-18 mois',
                'admission': 'Concours + aptitude physique',
                'organisme': hcgn
            },
            {
                'nom': 'École des Officiers de la Gendarmerie Nationale',
                'sigle': 'EOGN',
                'lieu': 'Dakar',
                'type_formation': 'Formation officiers',
                'duree_formation': '24 mois',
                'admission': 'Bac + 2 minimum + concours',
                'organisme': hcgn
            },
            {
                'nom': 'École Nationale des Sapeurs-Pompiers',
                'sigle': 'ENSP',
                'lieu': 'Dakar',
                'type_formation': 'Formation sapeurs-pompiers et sous-officiers',
                'duree_formation': '12 mois',
                'admission': 'Concours + aptitude physique',
                'organisme': dnpc
            }
        ]
        
        for ecole_data in ecoles_data:
            ecole, created = EcoleFormation.objects.get_or_create(
                nom=ecole_data['nom'],
                defaults=ecole_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Créé: {ecole.nom}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ Existant: {ecole.nom}'))
        
        # Créer les codes officiels
        codes_data = [
            {
                'type_code': 'MATRICULE_POLICE',
                'format_pattern': 'POL-AAAA-NNNNNN',
                'description': 'Format matricule Police Nationale',
                'exemple': 'POL-2024-123456'
            },
            {
                'type_code': 'MATRICULE_GENDARMERIE',
                'format_pattern': 'GEN-AAAA-NNNNNN',
                'description': 'Format matricule Gendarmerie Nationale',
                'exemple': 'GEN-2024-123456'
            },
            {
                'type_code': 'MATRICULE_POMPIERS',
                'format_pattern': 'POM-AAAA-NNNNNN',
                'description': 'Format matricule Sapeurs-Pompiers',
                'exemple': 'POM-2024-123456'
            },
            {
                'type_code': 'CNI',
                'format_pattern': 'AAAAMMJJNNNNN',
                'description': 'Format CNI ANCEC (13 chiffres)',
                'exemple': '1990010112345'
            },
            {
                'type_code': 'PERMIS',
                'format_pattern': 'PC-AAAA-NNNNNN',
                'description': 'Format Permis de Conduire',
                'exemple': 'PC-2024-123456'
            },
            {
                'type_code': 'CARTE_GRISE',
                'format_pattern': 'CG-RR-AAAA-NNNN',
                'description': 'Format Carte Grise',
                'exemple': 'CG-DK-2024-1234'
            },
            {
                'type_code': 'IMMATRICULATION',
                'format_pattern': 'RR-NNNN-LL',
                'description': 'Format immatriculation véhicule',
                'exemple': 'DK-1234-AB'
            }
        ]
        
        for code_data in codes_data:
            code, created = CodeOfficiel.objects.get_or_create(
                type_code=code_data['type_code'],
                defaults=code_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Créé: {code.type_code}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ Existant: {code.type_code}'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Initialisation terminée avec succès!'))

