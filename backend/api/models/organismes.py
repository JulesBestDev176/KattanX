"""
Modèles pour les organismes officiels du Sénégal
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
import uuid


class Organisme(models.Model):
    """Organisme officiel du Sénégal"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Informations de base
    nom = models.CharField(max_length=300)
    sigle = models.CharField(max_length=50, unique=True)
    ministere = models.CharField(max_length=200, blank=True, null=True)
    role = models.TextField(blank=True, null=True)
    
    # Contact
    telephone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    site_web = models.URLField(blank=True, null=True)
    adresse = models.CharField(max_length=500, blank=True, null=True)
    
    # Informations spécifiques
    commandement = models.CharField(max_length=200, blank=True, null=True)  # Nom du dirigeant
    services = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    ecoles = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    actif = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'organismes'
        ordering = ['sigle']
    
    def __str__(self):
        return f"{self.sigle} - {self.nom}"


class EcoleFormation(models.Model):
    """École de formation pour les forces de l'ordre"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Informations de base
    nom = models.CharField(max_length=200)
    sigle = models.CharField(max_length=50, blank=True, null=True)
    lieu = models.CharField(max_length=200)
    type_formation = models.CharField(max_length=200)  # Ex: "Formation initiale sous-officiers"
    
    # Détails
    duree_formation = models.CharField(max_length=50, blank=True, null=True)
    admission = models.TextField(blank=True, null=True)  # Conditions d'admission
    
    # Relation avec organisme
    organisme = models.ForeignKey(
        Organisme,
        on_delete=models.CASCADE,
        related_name='ecoles_formation',
        blank=True,
        null=True
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    actif = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'ecoles_formation'
        ordering = ['nom']
    
    def __str__(self):
        return f"{self.nom} ({self.lieu})"


class CodeOfficiel(models.Model):
    """Codes et formats officiels (matricules, CNI, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Type de code
    TYPE_CHOICES = [
        ('MATRICULE_POLICE', 'Matricule Police'),
        ('MATRICULE_GENDARMERIE', 'Matricule Gendarmerie'),
        ('MATRICULE_POMPIERS', 'Matricule Pompiers'),
        ('CNI', 'CNI'),
        ('PERMIS', 'Permis de Conduire'),
        ('CARTE_GRISE', 'Carte Grise'),
        ('IMMATRICULATION', 'Immatriculation Véhicule'),
    ]
    
    type_code = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True)
    format_pattern = models.CharField(max_length=100)  # Ex: "POL-AAAA-NNNNNN"
    description = models.TextField(blank=True, null=True)
    exemple = models.CharField(max_length=50, blank=True, null=True)
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'codes_officiels'
        ordering = ['type_code']
    
    def __str__(self):
        return f"{self.get_type_code_display()} - {self.format_pattern}"

