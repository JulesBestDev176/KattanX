"""
Modèles Django pour le système Citizen Portal
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

# Importer tous les enums depuis enums.py
from .enums import (
    Genre, SituationMatrimoniale, GroupeSanguin, RegionSenegal,
    DepartementSenegal, Nationalite, Profession, StatutCitoyen,
    Doigt, FormatEmpreinte, FormatPhoto, FormatSignature,
    TypeCaptureSignature, AlgorithmeReconnaissance, FormatIris,
    Oeil, TypeVerificationBiometrique, ResultatVerification
)


# ==================== MODÈLES ====================

class Adresse(models.Model):
    """Adresse détaillée"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_rue = models.CharField(max_length=20, blank=True, null=True)
    rue = models.CharField(max_length=200, blank=True, null=True)
    quartier = models.CharField(max_length=200)
    commune = models.CharField(max_length=200)
    departement = models.CharField(max_length=50, choices=DepartementSenegal.choices)
    region = models.CharField(max_length=50, choices=RegionSenegal.choices)
    code_postal = models.CharField(max_length=10, blank=True, null=True)
    pays = models.CharField(max_length=100, default='Sénégal')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    complement_adresse = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'adresses'
    
    def __str__(self):
        return f"{self.quartier}, {self.commune}, {self.region}"


class Contact(models.Model):
    """Contact"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    telephone_principal = models.CharField(max_length=20)
    telephone_secondaire = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telephone_urgence = models.CharField(max_length=20, blank=True, null=True)
    contact_urgence_nom = models.CharField(max_length=200, blank=True, null=True)
    contact_urgence_relation = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'contacts'
    
    def __str__(self):
        return self.telephone_principal


class InfoParentale(models.Model):
    """Informations parentales"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom_pere = models.CharField(max_length=200, blank=True, null=True)
    prenom_pere = models.CharField(max_length=200, blank=True, null=True)
    profession_pere = models.CharField(max_length=200, blank=True, null=True)
    nom_mere = models.CharField(max_length=200, blank=True, null=True)
    prenom_mere = models.CharField(max_length=200, blank=True, null=True)
    profession_mere = models.CharField(max_length=200, blank=True, null=True)
    lieu_naissance_pere = models.CharField(max_length=200, blank=True, null=True)
    lieu_naissance_mere = models.CharField(max_length=200, blank=True, null=True)
    
    class Meta:
        db_table = 'info_parentales'
    
    def __str__(self):
        return f"Parents de {self.nom_pere or 'N/A'}"


class Conjoint(models.Model):
    """Conjoint"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    citoyen = models.ForeignKey('Citoyen', on_delete=models.CASCADE, related_name='conjoints', blank=True, null=True)
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    date_naissance = models.DateField(blank=True, null=True)
    lieu_naissance = models.CharField(max_length=200, blank=True, null=True)
    profession = models.CharField(max_length=200, blank=True, null=True)
    date_marriage = models.DateField(blank=True, null=True)
    lieu_marriage = models.CharField(max_length=200, blank=True, null=True)
    numero_cni = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'conjoints'
    
    def __str__(self):
        return f"{self.nom} {self.prenom}"


class Enfant(models.Model):
    """Enfant"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    citoyen = models.ForeignKey('Citoyen', on_delete=models.CASCADE, related_name='enfants', blank=True, null=True)
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=200)
    genre = models.CharField(max_length=1, choices=Genre.choices)
    numero_cni = models.CharField(max_length=50, blank=True, null=True)
    numero_acte_naissance = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'enfants'
    
    def __str__(self):
        return f"{self.nom} {self.prenom}"


class EmpreinteDigitale(models.Model):
    """Empreinte digitale"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doigt = models.CharField(max_length=20, choices=Doigt.choices)
    template = models.TextField(blank=True, null=True)  # Template biométrique encodé (optionnel)
    format = models.CharField(max_length=20, choices=FormatEmpreinte.choices)
    qualite = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    date_capture = models.DateTimeField()
    dispositif_capture = models.CharField(max_length=200, blank=True, null=True)
    taille_octets = models.IntegerField(blank=True, null=True)
    resolution = models.IntegerField(blank=True, null=True)  # DPI
    fichier = models.FileField(
        upload_to='empreintes/',
        storage=None,  # Sera défini dynamiquement selon USE_S3
        blank=True,
        null=True,
        help_text='Fichier empreinte stocké sur MinIO ou localement'
    )
    
    def save(self, *args, **kwargs):
        """Définir le storage dynamiquement"""
        from django.conf import settings
        if getattr(settings, 'USE_S3', False):
            from api.storage import EmpreinteStorage
            if self.fichier:
                self.fichier.storage = EmpreinteStorage()
        super().save(*args, **kwargs)
    
    @property
    def file_url(self):
        """Retourne l'URL du fichier empreinte"""
        if self.fichier:
            return self.fichier.url
        return None
    
    class Meta:
        db_table = 'empreintes_digitales'
    
    def __str__(self):
        return f"{self.get_doigt_display()} - {self.date_capture}"


class PhotoIdentite(models.Model):
    """Photo d'identité"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.URLField(blank=True, null=True)
    base64 = models.TextField(blank=True, null=True)  # Image encodée en base64
    fichier = models.ImageField(
        upload_to='photos/',
        storage=None,  # Sera défini dynamiquement selon USE_S3
        blank=True,
        null=True,
        help_text='Fichier image stocké sur MinIO ou localement'
    )
    format = models.CharField(max_length=20, choices=FormatPhoto.choices)
    taille_octets = models.IntegerField()
    resolution = models.CharField(max_length=20)  # Ex: "300x400"
    date_capture = models.DateTimeField()
    conforme_iso = models.BooleanField(default=False)
    background_couleur = models.CharField(max_length=50, blank=True, null=True)
    qualite_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Définir le storage dynamiquement"""
        from django.conf import settings
        if getattr(settings, 'USE_S3', False):
            from api.storage import PhotoStorage
            self.fichier.storage = PhotoStorage()
        super().save(*args, **kwargs)
    
    @property
    def image_url(self):
        """Retourne l'URL de l'image (fichier ou url)"""
        if self.fichier:
            return self.fichier.url
        return self.url
    
    class Meta:
        db_table = 'photos_identite'
    
    def __str__(self):
        return f"Photo - {self.date_capture}"


class Signature(models.Model):
    """Signature numérisée"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.URLField(blank=True, null=True)
    base64 = models.TextField(blank=True, null=True)
    fichier = models.ImageField(
        upload_to='signatures/',
        storage=None,  # Sera défini dynamiquement selon USE_S3
        blank=True,
        null=True,
        help_text='Fichier signature stocké sur MinIO ou localement'
    )
    format = models.CharField(max_length=10, choices=FormatSignature.choices)
    taille_octets = models.IntegerField()
    date_capture = models.DateTimeField()
    type_capture = models.CharField(max_length=20, choices=TypeCaptureSignature.choices)
    
    def save(self, *args, **kwargs):
        """Définir le storage dynamiquement"""
        from django.conf import settings
        if getattr(settings, 'USE_S3', False):
            from api.storage import SignatureStorage
            self.fichier.storage = SignatureStorage()
        super().save(*args, **kwargs)
    
    @property
    def image_url(self):
        """Retourne l'URL de la signature (fichier ou url)"""
        if self.fichier:
            return self.fichier.url
        return self.url
    
    class Meta:
        db_table = 'signatures'
    
    def __str__(self):
        return f"Signature - {self.date_capture}"


class ReconnaissanceFaciale(models.Model):
    """Reconnaissance faciale"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    encodage_facial = models.TextField()  # Vecteur facial encodé
    algorithme = models.CharField(max_length=20, choices=AlgorithmeReconnaissance.choices)
    version = models.CharField(max_length=50)
    date_capture = models.DateTimeField()
    qualite_image = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    confiance = models.FloatField(blank=True, null=True)
    points_cles = JSONField(blank=True, null=True)  # Structure JSON pour les points clés
    
    class Meta:
        db_table = 'reconnaissances_faciales'
    
    def __str__(self):
        return f"Reconnaissance faciale - {self.algorithme} - {self.date_capture}"


class Iris(models.Model):
    """Iris (optionnel pour sécurité avancée)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    oeil = models.CharField(max_length=10, choices=Oeil.choices)
    template = models.TextField()  # Template iris encodé
    format = models.CharField(max_length=20, choices=FormatIris.choices)
    qualite = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    date_capture = models.DateTimeField()
    
    class Meta:
        db_table = 'iris'
    
    def __str__(self):
        return f"Iris {self.get_oeil_display()} - {self.date_capture}"


class Biometrie(models.Model):
    """Informations biométriques"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lieu_capture = models.CharField(max_length=200, blank=True, null=True)
    operateur_capture = models.CharField(max_length=200, blank=True, null=True)
    date_enrolement = models.DateTimeField()
    conforme_ancec = models.BooleanField(default=False)
    numero_enrolement_ancec = models.CharField(max_length=100, blank=True, null=True)
    derniere_verification_date = models.DateTimeField(blank=True, null=True)
    derniere_verification_type = models.CharField(max_length=20, choices=TypeVerificationBiometrique.choices, blank=True, null=True)
    derniere_verification_resultat = models.CharField(max_length=10, choices=ResultatVerification.choices, blank=True, null=True)
    derniere_verification_score_confiance = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], blank=True, null=True)
    derniere_verification_verifiee_par = models.CharField(max_length=200, blank=True, null=True)
    
    # Relations
    photo_identite = models.OneToOneField(PhotoIdentite, on_delete=models.CASCADE, related_name='biometrie_photo')
    signature = models.OneToOneField(Signature, on_delete=models.CASCADE, related_name='biometrie_signature')
    reconnaissance_faciale = models.OneToOneField(ReconnaissanceFaciale, on_delete=models.SET_NULL, blank=True, null=True, related_name='biometrie_faciale')
    
    class Meta:
        db_table = 'biometries'
    
    def __str__(self):
        return f"Biométrie - {self.date_enrolement}"


class EmpreinteBiometrie(models.Model):
    """Relation many-to-many entre Biometrie et EmpreinteDigitale"""
    biometrie = models.ForeignKey(Biometrie, on_delete=models.CASCADE, related_name='empreintes')
    empreinte = models.ForeignKey(EmpreinteDigitale, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'biometrie_empreintes'
        unique_together = ['biometrie', 'empreinte']


class IrisBiometrie(models.Model):
    """Relation many-to-many entre Biometrie et Iris"""
    biometrie = models.ForeignKey(Biometrie, on_delete=models.CASCADE, related_name='iris_list')
    iris = models.ForeignKey(Iris, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'biometrie_iris'
        unique_together = ['biometrie', 'iris']


class InfoMedicale(models.Model):
    """Informations médicales"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    groupe_sanguin = models.CharField(max_length=3, choices=GroupeSanguin.choices, blank=True, null=True)
    allergies = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    maladies_chroniques = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    handicap_type = models.CharField(max_length=200, blank=True, null=True)
    handicap_description = models.TextField(blank=True, null=True)
    taux_incapacite = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], blank=True, null=True)
    donneur_organes = models.BooleanField(default=False)
    personne_contact_nom = models.CharField(max_length=200, blank=True, null=True)
    personne_contact_telephone = models.CharField(max_length=20, blank=True, null=True)
    personne_contact_relation = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'info_medicales'
    
    def __str__(self):
        return f"Info médicale - {self.groupe_sanguin or 'N/A'}"


class Citoyen(models.Model):
    """Modèle principal Citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Informations personnelles de base
    numero_cni = models.CharField(max_length=50, unique=True, blank=True, null=True)
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    nom_jeune_fille = models.CharField(max_length=200, blank=True, null=True)
    autres_prenoms = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=200)
    commune_naissance = models.CharField(max_length=200)
    departement_naissance = models.CharField(max_length=50, choices=DepartementSenegal.choices)
    region_naissance = models.CharField(max_length=50, choices=RegionSenegal.choices)
    pays_naissance = models.CharField(max_length=100, default='Sénégal')
    
    # Identité
    genre = models.CharField(max_length=1, choices=Genre.choices)
    nationalite = models.CharField(max_length=50, choices=Nationalite.choices)
    nationalite_origine = models.CharField(max_length=50, choices=Nationalite.choices, blank=True, null=True)
    situation_matrimoniale = models.CharField(max_length=20, choices=SituationMatrimoniale.choices)
    
    # Informations professionnelles
    profession = models.CharField(max_length=50, choices=Profession.choices, blank=True, null=True)
    profession_details = models.CharField(max_length=200, blank=True, null=True)
    employeur = models.CharField(max_length=200, blank=True, null=True)
    numero_securite_sociale = models.CharField(max_length=50, blank=True, null=True)
    
    # Relations
    adresse_actuelle = models.ForeignKey(Adresse, on_delete=models.SET_NULL, related_name='citoyens_actuels', blank=True, null=True)
    adresse_originale = models.ForeignKey(Adresse, on_delete=models.SET_NULL, related_name='citoyens_originaux', blank=True, null=True)
    contact = models.OneToOneField(Contact, on_delete=models.CASCADE, related_name='citoyen')
    info_parentale = models.OneToOneField(InfoParentale, on_delete=models.SET_NULL, blank=True, null=True, related_name='citoyen')
    biometrie = models.OneToOneField(Biometrie, on_delete=models.SET_NULL, blank=True, null=True, related_name='citoyen')
    info_medicale = models.OneToOneField(InfoMedicale, on_delete=models.SET_NULL, blank=True, null=True, related_name='citoyen')
    
    # Informations familiales
    nombre_enfants = models.IntegerField(default=0)
    
    # Documents et véhicules (références)
    documents_ids = ArrayField(models.UUIDField(), blank=True, default=list)
    vehicules_ids = ArrayField(models.UUIDField(), blank=True, default=list)
    
    # Casier judiciaire
    casier_judiciaire_vierge = models.BooleanField(default=True)
    casier_judiciaire_condamnations = JSONField(blank=True, null=True)
    
    # Antécédents
    antecedents_infractions = ArrayField(models.UUIDField(), blank=True, default=list)
    antecedents_signalements = ArrayField(models.UUIDField(), blank=True, default=list)
    antecedents_alertes = ArrayField(models.UUIDField(), blank=True, default=list)
    
    # Statut et métadonnées
    statut = models.CharField(max_length=20, choices=StatutCitoyen.choices, default=StatutCitoyen.ACTIF)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    date_derniere_mise_a_jour = models.DateTimeField(auto_now=True)
    cree_par = models.UUIDField(blank=True, null=True)  # ID de l'agent
    modifie_par = models.UUIDField(blank=True, null=True)  # ID de l'agent
    
    # Informations de vérification
    verification_identite_verifie = models.BooleanField(default=False)
    verification_identite_date = models.DateTimeField(blank=True, null=True)
    verification_identite_verifiee_par = models.UUIDField(blank=True, null=True)
    verification_identite_methode = models.CharField(max_length=200, blank=True, null=True)
    
    # Notes administratives
    notes = models.TextField(blank=True, null=True)
    drapeaux = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    
    class Meta:
        db_table = 'citoyens'
        indexes = [
            models.Index(fields=['numero_cni']),
            models.Index(fields=['nom', 'prenom']),
            models.Index(fields=['statut']),
        ]
    
    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.numero_cni or 'N/A'})"
    
    @property
    def nom_complet(self):
        """Retourne le nom complet"""
        return f"{self.nom} {self.prenom}"

