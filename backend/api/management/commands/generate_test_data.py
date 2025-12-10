"""
Commande Django pour générer des données de test
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
import random
from api.models import (
    Citoyen, Adresse, Contact, InfoParentale, Biometrie,
    PhotoIdentite, Signature, ReconnaissanceFaciale, EmpreinteDigitale,
    InfoMedicale, Agent, Organisme, EcoleFormation, Vehicule,
    EmpreinteBiometrie
)
from api.models.enums import (
    Genre, SituationMatrimoniale, GroupeSanguin, RegionSenegal,
    DepartementSenegal, Nationalite, Profession, StatutCitoyen,
    TypeForceOrdre, GradePolice, GradeGendarmerie, GradePompiers,
    StatutCitoyen, Doigt, FormatEmpreinte, FormatPhoto, FormatSignature,
    TypeCaptureSignature, MarqueVehicule,
    TypeVehicule, StatutVehicule, CouleurVehicule, TypeCarburant
)
from api.models.citoyen import AlgorithmeReconnaissance


class Command(BaseCommand):
    help = 'Génère des données de test : 10 citoyens, 10 agents, 10 véhicules'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Supprimer les données existantes avant de créer',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Suppression des données existantes...'))
            Vehicule.objects.all().delete()
            Agent.objects.all().delete()
            Citoyen.objects.all().delete()
            Adresse.objects.all().delete()
            Contact.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Données supprimées'))

        self.stdout.write(self.style.SUCCESS('Génération des données de test...'))

        # Générer les organismes si nécessaire
        self.ensure_organismes()

        # Créer le citoyen spécifique Souleymane FALL
        citoyen_souleymane = self.create_souleymane_fall()
        self.stdout.write(self.style.SUCCESS(f'✓ Citoyen spécifique créé: SOULEYMANE FALL'))

        # Générer 9 autres citoyens (10 au total avec Souleymane)
        autres_citoyens = self.generate_citoyens(9)
        citoyens = [citoyen_souleymane] + autres_citoyens
        self.stdout.write(self.style.SUCCESS(f'✓ {len(citoyens)} citoyens créés au total'))

        # Générer 10 agents (3 Police, 4 Gendarmerie, 3 Pompiers)
        agents = self.generate_agents(citoyens[:10])
        self.stdout.write(self.style.SUCCESS(f'✓ {len(agents)} agents créés'))

        # Générer 10 véhicules
        vehicules = self.generate_vehicules(citoyens)
        self.stdout.write(self.style.SUCCESS(f'✓ {len(vehicules)} véhicules créés'))

        self.stdout.write(self.style.SUCCESS('\n✓ Génération terminée avec succès!'))

    def ensure_organismes(self):
        """S'assure que les organismes existent"""
        from django.core.management import call_command
        try:
            call_command('init_organismes', verbosity=0)
        except:
            pass

    def create_souleymane_fall(self):
        """Crée le citoyen spécifique Souleymane FALL"""
        from api.models import Citoyen, Adresse, Contact, InfoParentale, Biometrie
        from api.models import PhotoIdentite, Signature, ReconnaissanceFaciale, EmpreinteDigitale, InfoMedicale
        from api.models.enums import Genre, SituationMatrimoniale, GroupeSanguin, RegionSenegal
        from api.models.enums import DepartementSenegal, Nationalite, Profession, StatutCitoyen
        from api.models.enums import Doigt, FormatEmpreinte, FormatPhoto, FormatSignature
        from api.models.enums import TypeCaptureSignature
        from api.models.citoyen import AlgorithmeReconnaissance
        
        # Date de naissance: 10/10/2000
        date_naissance = date(2000, 10, 10)
        numero_cni = '1663200000432'  # Format: 20001010 + 000432
        
        # Créer adresse
        adresse = Adresse.objects.create(
            quartier='Plateau',
            commune='Dakar-Plateau',
            departement=DepartementSenegal.DAKAR,
            region=RegionSenegal.DAKAR,
            pays='Sénégal',
            latitude=14.6928,
            longitude=-17.4467
        )

        # Créer contact
        contact = Contact.objects.create(
            telephone_principal='+221776543210',
            email='souleymane.fall@example.sn',
            telephone_urgence='+221775551234',
            contact_urgence_nom='Fatou FALL',
            contact_urgence_relation='Mère'
        )

        # Créer info parentale
        info_parentale = InfoParentale.objects.create(
            nom_pere='FALL',
            prenom_pere='Mamadou',
            profession_pere='Fonctionnaire',
            nom_mere='NDIAYE',
            prenom_mere='Fatou',
            profession_mere='Enseignante'
        )

        # Créer info médicale
        info_medicale = InfoMedicale.objects.create(
            groupe_sanguin=GroupeSanguin.O_POSITIF,
            donneur_organes=True
        )

        # Créer biométrie complète
        photo = PhotoIdentite.objects.create(
            format=FormatPhoto.JPEG,
            resolution='300x400',
            taille_octets=85000,
            date_capture=timezone.now(),
            conforme_iso=True,
            background_couleur='blanc',
            qualite_score=95
        )

        signature = Signature.objects.create(
            format=FormatSignature.PNG,
            taille_octets=25000,
            date_capture=timezone.now(),
            type_capture=TypeCaptureSignature.TABLETTE
        )

        reconnaissance_faciale = ReconnaissanceFaciale.objects.create(
            encodage_facial=f"FACENET_128D_{random.randint(100000, 999999)}",
            algorithme=AlgorithmeReconnaissance.FACENET,
            version='2.0',
            date_capture=timezone.now(),
            qualite_image=96,
            confiance=0.98
        )

        biometrie = Biometrie.objects.create(
            lieu_capture='Centre d\'Enrôlement ANCEC - Dakar Plateau',
            operateur_capture='agent_ancec_045',
            date_enrolement=timezone.now(),
            conforme_ancec=True,
            numero_enrolement_ancec=f'ANCEC-{date_naissance.year}-DK-{random.randint(100000, 999999):06d}',
            photo_identite=photo,
            signature=signature,
            reconnaissance_faciale=reconnaissance_faciale
        )

        # Créer quelques empreintes digitales
        for doigt in [Doigt.POUCE_DROIT, Doigt.INDEX_DROIT, Doigt.MAJEUR_DROIT]:
            empreinte = EmpreinteDigitale.objects.create(
                doigt=doigt,
                template=f"WSQ_TEMPLATE_{random.randint(100000, 999999)}",
                format=FormatEmpreinte.WSQ,
                qualite=random.randint(90, 100),
                date_capture=timezone.now(),
                dispositif_capture='Morpho MSO 1300',
                resolution=500
            )
            EmpreinteBiometrie.objects.create(
                biometrie=biometrie,
                empreinte=empreinte
            )

        # Créer le citoyen
        citoyen = Citoyen.objects.create(
            numero_cni=numero_cni,
            nom='FALL',
            prenom='Souleymane',
            date_naissance=date_naissance,
            lieu_naissance='Hôpital Aristide Le Dantec',
            commune_naissance='Dakar-Plateau',
            departement_naissance=DepartementSenegal.DAKAR,
            region_naissance=RegionSenegal.DAKAR,
            pays_naissance='Sénégal',
            genre=Genre.MASCULIN,
            nationalite=Nationalite.SENEGALAISE,
            situation_matrimoniale=SituationMatrimoniale.CELIBATAIRE,
            profession=Profession.ETUDIANT,
            adresse_actuelle=adresse,
            contact=contact,
            info_parentale=info_parentale,
            biometrie=biometrie,
            info_medicale=info_medicale,
            statut=StatutCitoyen.ACTIF
        )

        return citoyen

    def generate_citoyens(self, count):
        """Génère des citoyens de test"""
        prenoms_masculins = ['Mamadou', 'Ibrahima', 'Amadou', 'Ousmane', 'Cheikh', 'Abdoulaye', 'Moussa', 'Boubacar', 'Modou', 'Pape']
        prenoms_feminins = ['Fatou', 'Aissatou', 'Mariama', 'Aminata', 'Khadija', 'Awa', 'Ndeye', 'Mame', 'Rokhaya', 'Sokhna']
        noms = ['SARR', 'DIOP', 'FALL', 'NDIAYE', 'BA', 'DIENG', 'THIAM', 'SECK', 'NDOYE', 'SALL']

        citoyens = []
        for i in range(count):
            genre = random.choice([Genre.MASCULIN, Genre.FEMININ])
            prenom = random.choice(prenoms_masculins if genre == Genre.MASCULIN else prenoms_feminins)
            nom = random.choice(noms)
            
            # Générer date de naissance (entre 1970 et 2000)
            annee_naissance = random.randint(1970, 2000)
            mois_naissance = random.randint(1, 12)
            jour_naissance = random.randint(1, 28)
            date_naissance = date(annee_naissance, mois_naissance, jour_naissance)
            
            # Générer numéro CNI
            numero_cni = f"{annee_naissance:04d}{mois_naissance:02d}{jour_naissance:02d}{random.randint(10000, 99999):05d}"

            # Créer adresse
            adresse = Adresse.objects.create(
                quartier=random.choice(['Médina', 'Plateau', 'Almadies', 'Yoff', 'Parcelles Assainies']),
                commune=random.choice(['Dakar-Plateau', 'Médina', 'Yoff', 'Parcelles Assainies']),
                departement=DepartementSenegal.DAKAR,
                region=RegionSenegal.DAKAR,
                pays='Sénégal',
                latitude=14.6928 + random.uniform(-0.1, 0.1),
                longitude=-17.4467 + random.uniform(-0.1, 0.1)
            )

            # Créer contact
            contact = Contact.objects.create(
                telephone_principal=f"+221{random.randint(770000000, 779999999)}",
                email=f"{prenom.lower()}.{nom.lower()}@example.sn",
                telephone_urgence=f"+221{random.randint(770000000, 779999999)}",
                contact_urgence_nom=f"{random.choice(prenoms_feminins)} {nom}",
                contact_urgence_relation=random.choice(['Mère', 'Père', 'Conjoint', 'Frère'])
            )

            # Créer info parentale
            info_parentale = InfoParentale.objects.create(
                nom_pere=nom,
                prenom_pere=random.choice(prenoms_masculins),
                profession_pere=random.choice(['Commerçant', 'Fonctionnaire', 'Agriculteur']),
                nom_mere=random.choice(noms),
                prenom_mere=random.choice(prenoms_feminins),
                profession_mere=random.choice(['Enseignante', 'Commerçante', 'Fonctionnaire'])
            )

            # Créer info médicale
            info_medicale = InfoMedicale.objects.create(
                groupe_sanguin=random.choice([g[0] for g in GroupeSanguin.choices]),
                donneur_organes=random.choice([True, False])
            )

            # Créer biométrie basique
            photo = PhotoIdentite.objects.create(
                format=FormatPhoto.JPEG,
                resolution='300x400',
                taille_octets=random.randint(50000, 100000),
                date_capture=timezone.now(),
                conforme_iso=True,
                background_couleur='blanc',
                qualite_score=random.randint(85, 100)
            )

            signature = Signature.objects.create(
                format=FormatSignature.PNG,
                taille_octets=random.randint(15000, 30000),
                date_capture=timezone.now(),
                type_capture=TypeCaptureSignature.TABLETTE
            )

            reconnaissance_faciale = ReconnaissanceFaciale.objects.create(
                encodage_facial=f"FACENET_128D_{random.randint(100000, 999999)}",
                algorithme=AlgorithmeReconnaissance.FACENET,
                version='2.0',
                date_capture=timezone.now(),
                qualite_image=random.randint(85, 100),
                confiance=random.uniform(0.85, 0.99)
            )

            biometrie = Biometrie.objects.create(
                lieu_capture='Centre d\'Enrôlement ANCEC - Dakar',
                operateur_capture=f'agent_ancec_{random.randint(1, 100):03d}',
                date_enrolement=timezone.now(),
                conforme_ancec=True,
                numero_enrolement_ancec=f'ANCEC-{date_naissance.year}-DK-{random.randint(100000, 999999):06d}',
                photo_identite=photo,
                signature=signature,
                reconnaissance_faciale=reconnaissance_faciale
            )

            # Créer quelques empreintes digitales
            for doigt in [Doigt.POUCE_DROIT, Doigt.INDEX_DROIT, Doigt.MAJEUR_DROIT]:
                empreinte = EmpreinteDigitale.objects.create(
                    doigt=doigt,
                    template=f"WSQ_TEMPLATE_{random.randint(100000, 999999)}",
                    format=FormatEmpreinte.WSQ,
                    qualite=random.randint(85, 100),
                    date_capture=timezone.now(),
                    dispositif_capture='Morpho MSO 1300',
                    resolution=500
                )
                EmpreinteBiometrie.objects.create(
                    biometrie=biometrie,
                    empreinte=empreinte
                )

            # Créer citoyen
            citoyen = Citoyen.objects.create(
                numero_cni=numero_cni,
                nom=nom,
                prenom=prenom,
                date_naissance=date_naissance,
                lieu_naissance=random.choice(['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack']),
                commune_naissance=random.choice(['Dakar-Plateau', 'Médina', 'Thiès']),
                departement_naissance=DepartementSenegal.DAKAR,
                region_naissance=RegionSenegal.DAKAR,
                pays_naissance='Sénégal',
                genre=genre,
                nationalite=Nationalite.SENEGALAISE,
                situation_matrimoniale=random.choice([s[0] for s in SituationMatrimoniale.choices]),
                profession=random.choice([p[0] for p in Profession.choices]),
                adresse_actuelle=adresse,
                contact=contact,
                info_parentale=info_parentale,
                biometrie=biometrie,
                info_medicale=info_medicale,
                statut=StatutCitoyen.ACTIF
            )

            citoyens.append(citoyen)

        return citoyens

    def generate_agents(self, citoyens):
        """Génère des agents de test"""
        agents = []
        
        # 3 agents Police
        grades_police = [
            GradePolice.GARDIEN_PAIX,
            GradePolice.BRIGADIER,
            GradePolice.CAPITAINE
        ]
        
        for i, citoyen in enumerate(citoyens[:3]):
            annee = random.randint(2018, 2024)
            matricule = f"POL-{annee}-{random.randint(100000, 999999):06d}"
            
            ecole = EcoleFormation.objects.filter(
                organisme__sigle='DGPN'
            ).first()
            
            agent = Agent.objects.create(
                citoyen=citoyen,
                matricule=matricule,
                type_force=TypeForceOrdre.POLICE_NATIONALE,
                grade_police=grades_police[i],
                unite_affectation=random.choice([
                    'Commissariat Central de Dakar',
                    'Commissariat de Médina',
                    'Commissariat de Yoff'
                ]),
                poste=random.choice(['Agent de patrouille', 'Agent de sécurité', 'Agent d\'investigation']),
                date_entree_service=date(annee, 9, 1),
                date_nomination_grade=date(annee, 9, 1),
                ecole_formation=ecole,
                annee_formation=annee,
                statut='ACTIF',
                verifications_effectuees=random.randint(50, 500),
                alertes_creees=random.randint(5, 50),
                arrestations=random.randint(10, 100)
            )
            agents.append(agent)

        # 4 agents Gendarmerie
        grades_gendarmerie = [
            GradeGendarmerie.GENDARME,
            GradeGendarmerie.MARECHAL_LOGIS,
            GradeGendarmerie.ADJUDANT,
            GradeGendarmerie.CAPITAINE
        ]
        
        for i, citoyen in enumerate(citoyens[3:7]):
            annee = random.randint(2017, 2023)
            matricule = f"GEN-{annee}-{random.randint(100000, 999999):06d}"
            
            ecole = EcoleFormation.objects.filter(
                organisme__sigle='HCGN'
            ).first()
            
            agent = Agent.objects.create(
                citoyen=citoyen,
                matricule=matricule,
                type_force=TypeForceOrdre.GENDARMERIE_NATIONALE,
                grade_gendarmerie=grades_gendarmerie[i],
                unite_affectation=random.choice([
                    'Gendarmerie de Dakar',
                    'Gendarmerie de Thiès',
                    'Gendarmerie de Saint-Louis'
                ]),
                poste=random.choice(['Gendarme de patrouille', 'Gendarme d\'investigation', 'Gendarme de sécurité']),
                date_entree_service=date(annee, 9, 1),
                date_nomination_grade=date(annee, 9, 1),
                ecole_formation=ecole,
                annee_formation=annee,
                statut='ACTIF',
                verifications_effectuees=random.randint(50, 500),
                alertes_creees=random.randint(5, 50),
                arrestations=random.randint(10, 100)
            )
            agents.append(agent)

        # 3 agents Pompiers
        grades_pompiers = [
            GradePompiers.SAPEUR,
            GradePompiers.SERGENT,
            GradePompiers.CAPITAINE
        ]
        
        for i, citoyen in enumerate(citoyens[7:10]):
            annee = random.randint(2019, 2024)
            matricule = f"POM-{annee}-{random.randint(100000, 999999):06d}"
            
            ecole = EcoleFormation.objects.filter(
                organisme__sigle='DNPC'
            ).first()
            
            agent = Agent.objects.create(
                citoyen=citoyen,
                matricule=matricule,
                type_force=TypeForceOrdre.SAPEURS_POMPIERS,
                grade_pompiers=grades_pompiers[i],
                unite_affectation=random.choice([
                    'Caserne de Dakar',
                    'Caserne de Thiès',
                    'Caserne de Saint-Louis'
                ]),
                poste=random.choice(['Sapeur-pompier', 'Chef d\'équipe', 'Officier']),
                date_entree_service=date(annee, 9, 1),
                date_nomination_grade=date(annee, 9, 1),
                ecole_formation=ecole,
                annee_formation=annee,
                statut='ACTIF',
                verifications_effectuees=random.randint(20, 200),
                alertes_creees=random.randint(0, 20),
                missions_completes=random.randint(50, 500)
            )
            agents.append(agent)

        return agents

    def generate_vehicules(self, citoyens):
        """Génère des véhicules de test"""
        marques = [m[0] for m in MarqueVehicule.choices if m[0] != MarqueVehicule.AUTRE]
        modeles = {
            'TOYOTA': ['Corolla', 'Camry', 'Rav4', 'Hilux', 'Land Cruiser'],
            'MERCEDES': ['Classe C', 'Classe E', 'GLE', 'Sprinter'],
            'PEUGEOT': ['206', '207', '208', '3008', 'Partner'],
            'RENAULT': ['Logan', 'Duster', 'Kangoo', 'Clio'],
            'NISSAN': ['Micra', 'Almera', 'Patrol', 'Navara'],
            'HYUNDAI': ['Accent', 'Elantra', 'Tucson', 'Santa Fe'],
            'KIA': ['Rio', 'Cerato', 'Sportage', 'Sorento'],
            'SUZUKI': ['Swift', 'Vitara', 'Jimny', 'Grand Vitara'],
            'FORD': ['Focus', 'Fiesta', 'Ranger', 'Explorer'],
            'VOLKSWAGEN': ['Polo', 'Golf', 'Tiguan', 'Amarok']
        }
        couleurs_enum = [c[0] for c in CouleurVehicule.choices]
        regions_codes = {
            RegionSenegal.DAKAR: 'DK',
            RegionSenegal.THIES: 'TH',
            RegionSenegal.SAINT_LOUIS: 'SL',
            RegionSenegal.KAOLACK: 'KC',
            RegionSenegal.TAMBACOUNDA: 'TC'
        }

        vehicules = []
        for i in range(10):
            marque = random.choice(marques)
            modele = random.choice(modeles.get(marque, ['Modèle']))
            couleur_enum = random.choice(couleurs_enum)
            annee = random.randint(2015, 2024)
            
            # Générer immatriculation
            region = random.choice([RegionSenegal.DAKAR, RegionSenegal.THIES, RegionSenegal.SAINT_LOUIS])
            code_region = regions_codes[region]
            numero = random.randint(1000, 9999)
            lettres = ''.join([chr(random.randint(65, 90)) for _ in range(2)])
            immatriculation = f"{code_region}-{numero}-{lettres}"
            
            # Générer carte grise
            carte_grise = f"CG-{code_region}-{annee}-{random.randint(1000, 9999):04d}"
            
            # Propriétaire (peut être un citoyen ou non)
            proprietaire = random.choice(citoyens) if random.random() > 0.3 else None
            
            # Déterminer le carburant selon l'enum
            carburant_enum = random.choice([c[0] for c in TypeCarburant.choices])
            
            # Caractéristiques techniques (dans JSONField)
            nombre_places = random.choice([4, 5, 7, 9, 15, 50])
            puissance_moteur = random.choice(['1.4L', '1.6L', '2.0L', '2.5L', '2000cc', '2500cc'])
            caracteristiques = {
                'nombre_places': nombre_places,
                'puissance_moteur': puissance_moteur,
                'cylindree': random.choice(['1400', '1600', '2000', '2500']),
                'portes': random.choice([2, 4, 5]),
                'poids': random.randint(1000, 2500),
            }
            
            date_immat = date(annee, random.randint(1, 12), random.randint(1, 28))
            
            vehicule = Vehicule.objects.create(
                matricule=immatriculation,
                numero_carte_grise=carte_grise,
                marque=marque,
                modele=modele,
                annee_fabrication=annee,
                couleur_principale=couleur_enum,
                type_vehicule=random.choice([t[0] for t in TypeVehicule.choices]),
                numero_serie=f"VIN{random.randint(100000, 999999)}",
                numero_moteur=f"MOTEUR{random.randint(100000, 999999)}",
                proprietaire=proprietaire,
                proprietaire_nom=f"{proprietaire.nom} {proprietaire.prenom}" if proprietaire else None,
                localisation_region=region,
                localisation_departement=DepartementSenegal.DAKAR,
                date_immatriculation=date_immat,
                carte_grise_date_emission=date_immat,
                statut=random.choice([s[0] for s in StatutVehicule.choices]),
                caracteristiques=caracteristiques,
                carburant=carburant_enum
            )
            vehicules.append(vehicule)

        return vehicules

