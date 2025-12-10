"""
Modèles pour les services citoyens : dénonciations, plaintes, documents, revenus
"""
from django.db import models
from django.db.models import JSONField
from django.core.validators import MinValueValidator
import uuid
from .enums import RegionSenegal, DepartementSenegal


class Document(models.Model):
    """Document administratif d'un citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='documents'
    )
    
    type = models.CharField(max_length=50, choices=[
        ('cni', 'CNI'),
        ('passeport', 'Passeport'),
        ('extrait_naissance', 'Extrait de naissance'),
        ('casier_judiciaire', 'Casier judiciaire'),
        ('acte_mariage', 'Acte de mariage'),
        ('acte_deces', 'Acte de décès'),
        ('certificat_residence', 'Certificat de résidence'),
        ('permis_conduire', 'Permis de conduire'),
        ('carte_sejour', 'Carte de séjour'),
        ('autre', 'Autre'),
    ])
    
    numero = models.CharField(max_length=200)
    date_emission = models.DateField()
    date_expiration = models.DateField(blank=True, null=True)
    
    statut = models.CharField(max_length=50, choices=[
        ('valide', 'Valide'),
        ('expire', 'Expiré'),
        ('en_attente', 'En attente'),
    ], default='valide')
    
    document_url = models.URLField(blank=True, null=True)
    fichier = models.FileField(
        upload_to='documents/',
        blank=True,
        null=True,
        help_text='Fichier PDF ou image du document'
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ['-date_emission']
        indexes = [
            models.Index(fields=['citoyen', 'type']),
            models.Index(fields=['statut']),
        ]
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.numero}"


class Denonciation(models.Model):
    """Dénonciation d'un incident par un citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='denonciations'
    )
    
    type = models.CharField(max_length=50, choices=[
        ('vol', 'Vol'),
        ('agression', 'Agression'),
        ('accident', 'Accident'),
        ('incendie', 'Incendie'),
        ('autre', 'Autre'),
    ])
    
    description = models.TextField()
    localisation = models.CharField(max_length=500)
    coordonnees_gps = JSONField(blank=True, null=True)  # {latitude, longitude}
    
    preuve_type = models.CharField(max_length=50, choices=[
        ('image', 'Image'),
        ('audio', 'Audio'),
        ('video', 'Vidéo'),
        ('aucun', 'Aucun'),
    ], default='aucun')
    
    preuve_url = models.URLField(blank=True, null=True)
    preuve_fichier = models.FileField(
        upload_to='denonciations/preuves/',
        blank=True,
        null=True
    )
    
    status = models.CharField(max_length=50, choices=[
        ('pending', 'En attente'),
        ('verified', 'Vérifiée'),
        ('rejected', 'Rejetée'),
        ('en_cours', 'En cours de traitement'),
    ], default='pending')
    
    reponse = models.TextField(blank=True, null=True)
    reponse_date = models.DateTimeField(blank=True, null=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'denonciations'
        verbose_name = "Dénonciation"
        verbose_name_plural = "Dénonciations"
        ordering = ['-date_creation']
        indexes = [
            models.Index(fields=['citoyen', 'status']),
            models.Index(fields=['type', 'status']),
        ]
    
    def __str__(self):
        return f"Dénonciation {self.get_type_display()} - {self.citoyen.nom} ({self.status})"


class Plainte(models.Model):
    """Plainte déposée ou reçue par un citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='plaintes'
    )
    
    type = models.CharField(max_length=50, choices=[
        ('reçue', 'Reçue'),
        ('déposée', 'Déposée'),
    ])
    
    objet = models.CharField(max_length=255)
    description = models.TextField()
    
    commissariat = models.CharField(max_length=200, blank=True, null=True)
    localisation = JSONField(blank=True, null=True)  # {latitude, longitude, adresse}
    
    amende = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    
    status = models.CharField(max_length=50, choices=[
        ('en_cours', 'En cours'),
        ('resolue', 'Résolue'),
        ('rejetee', 'Rejetée'),
        ('en_attente', 'En attente'),
    ], default='en_attente')
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plaintes'
        verbose_name = "Plainte"
        verbose_name_plural = "Plaintes"
        ordering = ['-date_creation']
        indexes = [
            models.Index(fields=['citoyen', 'type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Plainte {self.get_type_display()} - {self.objet} ({self.status})"


class Transaction(models.Model):
    """Transaction financière (gain, transfert, retrait)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    
    type = models.CharField(max_length=50, choices=[
        ('gain', 'Gain'),
        ('transfert', 'Transfert'),
        ('retrait', 'Retrait'),
    ])
    
    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    description = models.CharField(max_length=500, blank=True, null=True)
    destinataire = models.CharField(max_length=200, blank=True, null=True)
    
    statut = models.CharField(max_length=50, choices=[
        ('en_attente', 'En attente'),
        ('complete', 'Complète'),
        ('echec', 'Échec'),
    ], default='en_attente')
    
    date = models.DateTimeField(auto_now_add=True)
    date_completion = models.DateTimeField(blank=True, null=True)
    
    # Métadonnées
    reference = models.CharField(max_length=100, blank=True, null=True)
    details = JSONField(blank=True, null=True)  # Détails supplémentaires
    
    class Meta:
        db_table = 'transactions'
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-date']
        indexes = [
            models.Index(fields=['citoyen', 'type']),
            models.Index(fields=['statut', 'date']),
        ]
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.montant} FCFA ({self.statut})"


class Revenu(models.Model):
    """Compte de revenus d'un citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.OneToOneField(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='revenu'
    )
    
    solde = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'revenus'
        verbose_name = "Revenu"
        verbose_name_plural = "Revenus"
    
    def __str__(self):
        return f"Revenu {self.citoyen.nom} - {self.solde} FCFA"


class AlerteUrgence(models.Model):
    """Alerte d'urgence 'Je suis en danger' envoyée par un citoyen"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.CASCADE,
        related_name='alertes_urgence'
    )
    
    type = models.CharField(max_length=50, choices=[
        ('danger_imminent', 'Danger imminent'),
        ('agression', 'Agression'),
        ('accident', 'Accident'),
        ('maladie', 'Maladie/Urgence médicale'),
        ('autre', 'Autre'),
    ], default='danger_imminent')
    
    description = models.TextField(blank=True, null=True)
    
    # Localisation
    localisation = models.CharField(max_length=500, blank=True, null=True)
    coordonnees_gps = JSONField()  # {latitude, longitude}
    
    # Brigades notifiées
    brigades_notifiees = JSONField(default=list)  # Array of {brigade_id, brigade_nom, distance_km, date_notification}
    
    # Statut
    statut = models.CharField(max_length=50, choices=[
        ('envoyee', 'Envoyée'),
        ('en_cours', 'En cours de traitement'),
        ('prise_en_charge', 'Prise en charge'),
        ('resolue', 'Résolue'),
        ('annulee', 'Annulée'),
    ], default='envoyee')
    
    # Agent qui prend en charge
    agent_charge_id = models.CharField(max_length=50, blank=True, null=True)
    agent_charge_nom = models.CharField(max_length=200, blank=True, null=True)
    brigade_charge_id = models.CharField(max_length=50, blank=True, null=True)
    brigade_charge_nom = models.CharField(max_length=200, blank=True, null=True)
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_prise_en_charge = models.DateTimeField(blank=True, null=True)
    date_resolution = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'alertes_urgence'
        verbose_name = "Alerte d'Urgence"
        verbose_name_plural = "Alertes d'Urgence"
        ordering = ['-date_creation']
        indexes = [
            models.Index(fields=['citoyen', 'statut']),
            models.Index(fields=['statut', 'date_creation']),
        ]
    
    def __str__(self):
        return f"Alerte {self.get_type_display()} - {self.citoyen.nom} ({self.statut})"

