"""
Modèles pour les véhicules - Version complète
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from .enums import (
    RegionSenegal, DepartementSenegal, MarqueVehicule, TypeVehicule, StatutVehicule,
    CouleurVehicule, TypeCarburant, TypePhotoVehicule, TypeAssurance, StatutAssurance,
    ResultatVisiteTechnique, StatutVisiteTechnique, TypeOrganismeGage, StatutGage,
    StatutEcheance, TypeZoneGPS, TypeAlerteGPS, TypeUsageVehicule, ModeAcquisition
)
# Import Citoyen via string pour éviter les imports circulaires
# from .citoyen import Citoyen
from api.storage import PhotoStorage, DocumentStorage


# ============================================
# Modèles de base
# ============================================

class PhotoVehicule(models.Model):
    """Photo d'un véhicule"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.ForeignKey(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='photos',
        blank=True,
        null=True
    )
    
    type = models.CharField(max_length=50, choices=TypePhotoVehicule.choices)
    description = models.TextField(blank=True, null=True)
    
    # Fichier image
    fichier = models.FileField(
        upload_to='vehicules/photos/',
        storage=PhotoStorage(),
        blank=True,
        null=True
    )
    url = models.URLField(blank=True, null=True)  # URL alternative
    
    # Métadonnées
    date_capture = models.DateTimeField()
    lieu_capture = models.CharField(max_length=200, blank=True, null=True)
    coordonnees_gps = JSONField(blank=True, null=True)  # {latitude, longitude}
    capture_par = models.CharField(max_length=100, blank=True, null=True)
    
    # Caractéristiques image
    taille_octets = models.IntegerField(blank=True, null=True)
    format = models.CharField(max_length=10, default='JPEG')
    resolution = models.CharField(max_length=20, blank=True, null=True)  # Ex: "1920x1080"
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'photos_vehicules'
        verbose_name = "Photo de Véhicule"
        verbose_name_plural = "Photos de Véhicules"
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.vehicule.matricule if self.vehicule else 'N/A'}"


class PlaqueImmatriculation(models.Model):
    """Plaque d'immatriculation"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.ForeignKey(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='plaques',
        blank=True,
        null=True
    )
    
    matricule = models.CharField(max_length=20, unique=True)  # Ex: DK-5678-CD
    region_code = models.CharField(max_length=10)  # Ex: DK
    numero = models.IntegerField()
    lettres = models.CharField(max_length=10)
    
    date_attribution = models.DateField()
    actif = models.BooleanField(default=True)
    
    photo_plaque = models.ForeignKey(
        PhotoVehicule,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='plaques_photo'
    )
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'plaques_immatriculation'
        verbose_name = "Plaque d'Immatriculation"
        verbose_name_plural = "Plaques d'Immatriculation"
    
    def __str__(self):
        return self.matricule


# ============================================
# Assurance
# ============================================

class GarantieAssurance(models.Model):
    """Garantie d'une assurance"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    assurance = models.ForeignKey(
        'AssuranceVehicule',
        on_delete=models.CASCADE,
        related_name='garanties'
    )
    
    type = models.CharField(max_length=200)
    plafond = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    franchise = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'garanties_assurance'
    
    def __str__(self):
        return f"{self.type} - {self.assurance.numero_police}"


class PaiementAssurance(models.Model):
    """Paiement d'une assurance"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    assurance = models.ForeignKey(
        'AssuranceVehicule',
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    
    date = models.DateField()
    montant = models.DecimalField(max_digits=15, decimal_places=2)
    mode_paiement = models.CharField(max_length=50)  # VIREMENT, CHEQUE, ESPECES, etc.
    reference_paiement = models.CharField(max_length=100, blank=True, null=True)
    recu_url = models.URLField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'paiements_assurance'
    
    def __str__(self):
        return f"Paiement {self.montant} - {self.date}"


class AssuranceVehicule(models.Model):
    """Assurance d'un véhicule"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.ForeignKey(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='assurances',
        blank=True,
        null=True
    )
    
    # Compagnie
    compagnie = models.CharField(max_length=200)
    numero_police = models.CharField(max_length=100, unique=True)
    numero_attestation = models.CharField(max_length=100, blank=True, null=True)
    
    type_assurance = models.CharField(max_length=50, choices=TypeAssurance.choices)
    
    # Période
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    duree_jours = models.IntegerField(blank=True, null=True)
    
    # Montants (en FCFA)
    montant_prime = models.DecimalField(max_digits=15, decimal_places=2)
    montant_accessoires = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    montant_total = models.DecimalField(max_digits=15, decimal_places=2)
    
    statut = models.CharField(max_length=50, choices=StatutAssurance.choices, default=StatutAssurance.VALIDE)
    
    # Assuré
    assure_nom = models.CharField(max_length=200, blank=True, null=True)
    assure_prenom = models.CharField(max_length=200, blank=True, null=True)
    assure_numero_identification = models.CharField(max_length=50, blank=True, null=True)
    assure_telephone = models.CharField(max_length=50, blank=True, null=True)
    
    # Documents
    attestation_url = models.URLField(blank=True, null=True)
    police_url = models.URLField(blank=True, null=True)
    carte_verte_url = models.URLField(blank=True, null=True)
    
    # Sinistres
    nombre_sinistres = models.IntegerField(default=0)
    montant_sinistres = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Renouvellement
    auto_renouvellement = models.BooleanField(default=False)
    prochain_renouvellement = models.DateField(blank=True, null=True)
    
    # Contact compagnie
    contact_compagnie_telephone = models.CharField(max_length=50, blank=True, null=True)
    contact_compagnie_email = models.EmailField(blank=True, null=True)
    contact_compagnie_agence = models.CharField(max_length=200, blank=True, null=True)
    contact_compagnie_hotline = models.CharField(max_length=50, blank=True, null=True)
    
    # DTT
    declaree_au_dtt = models.BooleanField(default=False)
    date_declaration_dtt = models.DateField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assurances_vehicules'
        verbose_name = "Assurance Véhicule"
        verbose_name_plural = "Assurances Véhicules"
    
    def __str__(self):
        return f"{self.compagnie} - {self.numero_police}"


# ============================================
# Visite Technique
# ============================================

class PointsControleVisiteTechnique(models.Model):
    """Points de contrôle d'une visite technique"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    visite_technique = models.ForeignKey(
        'VisiteTechnique',
        on_delete=models.CASCADE,
        related_name='points_controle'
    )
    
    # Type de contrôle
    type_controle = models.CharField(max_length=100)  # identification, freinage, direction, etc.
    
    # Résultat
    conformite = models.BooleanField()
    observations = models.TextField(blank=True, null=True)
    
    # Données spécifiques (stockées en JSON)
    donnees = JSONField(blank=True, null=True)  # Pour stocker les détails spécifiques
    
    class Meta:
        db_table = 'points_controle_visite_technique'
    
    def __str__(self):
        return f"{self.type_controle} - {self.visite_technique.numero_visite}"


class VisiteTechnique(models.Model):
    """Visite technique DTT"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.ForeignKey(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='visites_techniques',
        blank=True,
        null=True
    )
    
    numero_visite = models.CharField(max_length=100, unique=True)
    numero_proces_verbal = models.CharField(max_length=100, blank=True, null=True)
    
    # Dates
    date_visite = models.DateTimeField()
    date_expiration = models.DateTimeField()
    prochain_controle = models.DateField(blank=True, null=True)
    
    # Centre de contrôle
    centre_controle = models.CharField(max_length=200)
    numero_agrement = models.CharField(max_length=100, blank=True, null=True)
    adresse_centre = models.CharField(max_length=300, blank=True, null=True)
    telephone_centre = models.CharField(max_length=50, blank=True, null=True)
    region_centre = models.CharField(max_length=50, choices=RegionSenegal.choices, blank=True, null=True)
    
    # Résultat
    resultat = models.CharField(max_length=50, choices=ResultatVisiteTechnique.choices)
    date_resultat = models.DateTimeField(blank=True, null=True)
    
    # Défauts
    defauts_constates = ArrayField(models.CharField(max_length=500), blank=True, default=list)
    
    # Kilométrage
    kilometrage = models.IntegerField(blank=True, null=True)
    
    # Contrôleur
    controleur_nom = models.CharField(max_length=200, blank=True, null=True)
    controleur_prenom = models.CharField(max_length=200, blank=True, null=True)
    controleur_numero_agrement = models.CharField(max_length=100, blank=True, null=True)
    controleur_signature_url = models.URLField(blank=True, null=True)
    
    # Documents
    document_url = models.URLField(blank=True, null=True)
    vignette_url = models.URLField(blank=True, null=True)
    
    statut = models.CharField(max_length=50, choices=StatutVisiteTechnique.choices, default=StatutVisiteTechnique.VALIDE)
    
    # DTT
    enregistre_au_dtt = models.BooleanField(default=False)
    date_enregistrement_dtt = models.DateField(blank=True, null=True)
    numero_enregistrement_dtt = models.CharField(max_length=100, blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'visites_techniques'
        verbose_name = "Visite Technique"
        verbose_name_plural = "Visites Techniques"
    
    def __str__(self):
        return f"{self.numero_visite} - {self.vehicule.matricule if self.vehicule else 'N/A'}"


# ============================================
# Gage / Crédit
# ============================================

class EcheanceGage(models.Model):
    """Échéance d'un gage"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    gage = models.ForeignKey(
        'GageVehicule',
        on_delete=models.CASCADE,
        related_name='echeances'
    )
    
    numero = models.IntegerField()
    date_echeance = models.DateField()
    montant = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Détails
    capital = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    interets = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    assurance = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    statut = models.CharField(max_length=50, choices=StatutEcheance.choices, default=StatutEcheance.EN_ATTENTE)
    date_paiement = models.DateField(blank=True, null=True)
    reference_paiement = models.CharField(max_length=100, blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'echeances_gage'
        ordering = ['numero']
    
    def __str__(self):
        return f"Échéance {self.numero} - {self.gage.numero_contrat}"


class GarantieGage(models.Model):
    """Garantie d'un gage"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    gage = models.ForeignKey(
        'GageVehicule',
        on_delete=models.CASCADE,
        related_name='garanties'
    )
    
    type = models.CharField(max_length=100)  # VEHICULE, SALAIRE, etc.
    description = models.TextField(blank=True, null=True)
    montant = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    class Meta:
        db_table = 'garanties_gage'
    
    def __str__(self):
        return f"{self.type} - {self.gage.numero_contrat}"


class GageVehicule(models.Model):
    """Gage bancaire / crédit auto"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.ForeignKey(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='gages',
        blank=True,
        null=True
    )
    
    # Organisme
    organisme = models.CharField(max_length=200)
    type_organisme = models.CharField(max_length=50, choices=TypeOrganismeGage.choices)
    numero_contrat = models.CharField(max_length=100, unique=True)
    
    # Montants (en FCFA)
    montant_finance = models.DecimalField(max_digits=15, decimal_places=2)
    apport_personnel = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    montant_mensualite = models.DecimalField(max_digits=15, decimal_places=2)
    nombre_mensualites = models.IntegerField()
    montant_restant_du = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    # Taux
    taux_interet = models.DecimalField(max_digits=5, decimal_places=2)  # Ex: 9.5
    taux_assurance = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    
    # Dates
    date_debut = models.DateField()
    date_fin = models.DateField()
    date_premiere_echeance = models.DateField(blank=True, null=True)
    date_derniere_echeance = models.DateField(blank=True, null=True)
    
    statut = models.CharField(max_length=50, choices=StatutGage.choices, default=StatutGage.ACTIF)
    date_statut = models.DateField(blank=True, null=True)
    
    # Restrictions
    restriction_vente = models.BooleanField(default=False)
    restriction_export = models.BooleanField(default=False)
    assurance_obligatoire = models.BooleanField(default=True)
    
    # Inscription registre
    inscrit_registre_gages = models.BooleanField(default=False)
    date_inscription = models.DateField(blank=True, null=True)
    numero_inscription = models.CharField(max_length=100, blank=True, null=True)
    
    # Contact organisme
    contact_organisme_telephone = models.CharField(max_length=50, blank=True, null=True)
    contact_organisme_email = models.EmailField(blank=True, null=True)
    contact_organisme_agence = models.CharField(max_length=200, blank=True, null=True)
    contact_conseiller_nom = models.CharField(max_length=200, blank=True, null=True)
    contact_conseiller_telephone = models.CharField(max_length=50, blank=True, null=True)
    contact_conseiller_email = models.EmailField(blank=True, null=True)
    
    # Documents
    contrat_url = models.URLField(blank=True, null=True)
    tableau_amortissement_url = models.URLField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'gages_vehicules'
        verbose_name = "Gage Véhicule"
        verbose_name_plural = "Gages Véhicules"
    
    def __str__(self):
        return f"{self.organisme} - {self.numero_contrat}"


# ============================================
# Tracking GPS
# ============================================

class ZoneGPS(models.Model):
    """Zone géographique pour le tracking GPS"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    tracking = models.ForeignKey(
        'TrackingGPS',
        on_delete=models.CASCADE,
        related_name='zones'
    )
    
    nom = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TypeZoneGPS.choices)
    
    # Géométrie (stockée en JSON)
    geometrie = JSONField()  # {type: 'CERCLE'|'POLYGONE', centre: {lat, lng}, rayon, points: [...]}
    
    alerte_entree = models.BooleanField(default=False)
    alerte_sortie = models.BooleanField(default=False)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'zones_gps'
    
    def __str__(self):
        return f"{self.nom} - {self.get_type_display()}"


class HistoriqueAlerteGPS(models.Model):
    """Historique des alertes GPS"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    tracking = models.ForeignKey(
        'TrackingGPS',
        on_delete=models.CASCADE,
        related_name='historique_alertes'
    )
    
    date = models.DateTimeField()
    type = models.CharField(max_length=50, choices=TypeAlerteGPS.choices)
    description = models.TextField()
    
    # Position
    position_latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    position_longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    
    traite = models.BooleanField(default=False)
    date_traitement = models.DateTimeField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'historique_alertes_gps'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.date}"


class TrackingGPS(models.Model):
    """Système de tracking GPS"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicule = models.OneToOneField(
        'Vehicule',
        on_delete=models.CASCADE,
        related_name='tracking_gps',
        blank=True,
        null=True
    )
    
    # Dispositif
    dispositif_marque = models.CharField(max_length=100, blank=True, null=True)
    dispositif_modele = models.CharField(max_length=100, blank=True, null=True)
    dispositif_numero_serie = models.CharField(max_length=100, blank=True, null=True)
    dispositif_imei = models.CharField(max_length=50, blank=True, null=True)
    dispositif_numero_carte_sim = models.CharField(max_length=50, blank=True, null=True)
    dispositif_operateur_mobile = models.CharField(max_length=50, blank=True, null=True)
    
    date_installation = models.DateField(blank=True, null=True)
    installe_par = models.CharField(max_length=200, blank=True, null=True)
    emplacement_vehicule = models.CharField(max_length=300, blank=True, null=True)
    
    # Fournisseur
    fournisseur_nom = models.CharField(max_length=200, blank=True, null=True)
    fournisseur_contact = models.CharField(max_length=50, blank=True, null=True)
    fournisseur_email = models.EmailField(blank=True, null=True)
    fournisseur_url_plateforme = models.URLField(blank=True, null=True)
    
    # Abonnement
    abonnement_type = models.CharField(max_length=50, blank=True, null=True)  # MENSUEL, ANNUEL
    abonnement_montant = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    abonnement_date_debut = models.DateField(blank=True, null=True)
    abonnement_date_fin = models.DateField(blank=True, null=True)
    abonnement_statut = models.CharField(max_length=50, blank=True, null=True)
    abonnement_auto_renouvellement = models.BooleanField(default=False)
    
    # Position actuelle
    position_actuelle_latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    position_actuelle_longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    position_actuelle_altitude = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    position_actuelle_precision = models.IntegerField(blank=True, null=True)  # en mètres
    position_actuelle_vitesse = models.IntegerField(blank=True, null=True)  # en km/h
    position_actuelle_direction = models.IntegerField(blank=True, null=True)  # cap en degrés
    position_actuelle_date = models.DateTimeField(blank=True, null=True)
    position_actuelle_adresse = models.CharField(max_length=300, blank=True, null=True)
    position_actuelle_en_mouvement = models.BooleanField(default=False)
    position_actuelle_moteur_allume = models.BooleanField(default=False)
    
    # Alertes configurées (stockées en JSON)
    alertes_config = JSONField(blank=True, null=True)
    
    # Statistiques
    statistiques_kilometres_parcourus = models.IntegerField(default=0)
    statistiques_temps_moteur_allume = models.IntegerField(default=0)  # en heures
    statistiques_nombre_alertes = models.IntegerField(default=0)
    statistiques_derniere_connexion = models.DateTimeField(blank=True, null=True)
    
    statut_dispositif = models.CharField(max_length=50, default='ACTIF')
    dernier_signal = models.DateTimeField(blank=True, null=True)
    niveau_batterie = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Anti-vol
    antivol_active = models.BooleanField(default=False)
    antivol_immobilisation_moteur = models.BooleanField(default=False)
    antivol_derniere_immobilisation = models.DateTimeField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tracking_gps'
        verbose_name = "Tracking GPS"
        verbose_name_plural = "Trackings GPS"
    
    def __str__(self):
        return f"GPS - {self.vehicule.matricule if self.vehicule else 'N/A'}"


# ============================================
# Modèle Véhicule Principal
# ============================================

class Vehicule(models.Model):
    """Véhicule - Modèle principal complet"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Immatriculation
    matricule = models.CharField(max_length=20, unique=True)  # Ex: DK-5678-CD
    numero_carte_grise = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Type et usage
    type_vehicule = models.CharField(max_length=50, choices=TypeVehicule.choices)
    usage = models.CharField(max_length=50, choices=TypeUsageVehicule.choices, default=TypeUsageVehicule.PARTICULIER)
    
    # Identification
    marque = models.CharField(max_length=50, choices=MarqueVehicule.choices)
    modele = models.CharField(max_length=100)
    version = models.CharField(max_length=100, blank=True, null=True)
    annee_modele = models.IntegerField(blank=True, null=True)
    annee_fabrication = models.IntegerField()
    numero_serie = models.CharField(max_length=100, unique=True, blank=True, null=True)  # VIN
    numero_moteur = models.CharField(max_length=100, blank=True, null=True)
    
    # Apparence
    couleur_principale = models.CharField(max_length=50, choices=CouleurVehicule.choices, blank=True, null=True)
    nombre_couleurs = models.IntegerField(default=1)
    signes_distinctifs = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    
    # Carburant
    carburant = models.CharField(max_length=50, choices=TypeCarburant.choices)
    
    # Caractéristiques techniques (stockées en JSON)
    caracteristiques = JSONField(blank=True, null=True)  # cylindree, puissance, places, portes, poids, etc.
    
    # Propriétaire actuel
    proprietaire = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.SET_NULL,
        related_name='vehicules_possedes',
        blank=True,
        null=True
    )
    proprietaire_type = models.CharField(max_length=50, default='PERSONNE_PHYSIQUE')  # PERSONNE_PHYSIQUE, PERSONNE_MORALE
    proprietaire_nom = models.CharField(max_length=200, blank=True, null=True)
    proprietaire_prenom = models.CharField(max_length=200, blank=True, null=True)
    proprietaire_numero_identification = models.CharField(max_length=50, blank=True, null=True)
    proprietaire_adresse = models.CharField(max_length=300, blank=True, null=True)
    proprietaire_telephone = models.CharField(max_length=50, blank=True, null=True)
    proprietaire_email = models.EmailField(blank=True, null=True)
    date_acquisition = models.DateField(blank=True, null=True)
    mode_acquisition = models.CharField(max_length=50, choices=ModeAcquisition.choices, blank=True, null=True)
    prix_achat = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    
    # Carte grise
    carte_grise_numero = models.CharField(max_length=100, blank=True, null=True)
    carte_grise_date_emission = models.DateField(blank=True, null=True)
    carte_grise_document_url = models.URLField(blank=True, null=True)
    
    # Assurance actuelle (relation via ForeignKey)
    # assurance_actuelle = ForeignKey vers AssuranceVehicule (via related_name)
    
    # Visite technique actuelle (relation via ForeignKey)
    # visite_technique_actuelle = ForeignKey vers VisiteTechnique (via related_name)
    
    # Entretiens
    dernier_entretien = models.DateField(blank=True, null=True)
    kilometrage_actuel = models.IntegerField(default=0)
    
    # Infractions et sinistres
    nombre_infractions = models.IntegerField(default=0)
    infractions_ids = ArrayField(models.UUIDField(), blank=True, default=list)
    sinistres_ids = ArrayField(models.UUIDField(), blank=True, default=list)
    
    # Statut
    statut = models.CharField(max_length=50, choices=StatutVehicule.choices, default=StatutVehicule.ACTIF)
    date_statut = models.DateField(blank=True, null=True)
    
    # Localisation actuelle
    localisation_region = models.CharField(max_length=50, choices=RegionSenegal.choices, blank=True, null=True)
    localisation_departement = models.CharField(max_length=50, choices=DepartementSenegal.choices, blank=True, null=True)
    localisation_commune = models.CharField(max_length=200, blank=True, null=True)
    localisation_adresse = models.CharField(max_length=300, blank=True, null=True)
    localisation_coordonnees_gps = JSONField(blank=True, null=True)  # {latitude, longitude}
    localisation_date = models.DateTimeField(blank=True, null=True)
    
    # Équipements spéciaux
    equipements_speciaux = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    
    # Métadonnées
    date_immatriculation = models.DateField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    cree_par = models.CharField(max_length=100, blank=True, null=True)
    modifie_par = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'vehicules'
        verbose_name = "Véhicule"
        verbose_name_plural = "Véhicules"
        indexes = [
            models.Index(fields=['matricule']),
            models.Index(fields=['numero_carte_grise']),
            models.Index(fields=['statut']),
            models.Index(fields=['proprietaire']),
        ]
    
    def __str__(self):
        return f"{self.matricule} - {self.marque} {self.modele}"
    
    @property
    def assurance_actuelle(self):
        """Retourne l'assurance actuelle valide"""
        return self.assurances.filter(
            statut=StatutAssurance.VALIDE
        ).order_by('-date_fin').first()
    
    @property
    def visite_technique_actuelle(self):
        """Retourne la visite technique actuelle valide"""
        return self.visites_techniques.filter(
            statut=StatutVisiteTechnique.VALIDE
        ).order_by('-date_expiration').first()
    
    @property
    def gage_actuel(self):
        """Retourne le gage actif"""
        return self.gages.filter(statut=StatutGage.ACTIF).first()
    
    @property
    def plaque_actuelle(self):
        """Retourne la plaque d'immatriculation active"""
        return self.plaques.filter(actif=True).first()
