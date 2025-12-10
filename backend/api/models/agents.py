"""
Modèles pour les agents des forces de l'ordre
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from .enums import (
    TypeForceOrdre, GradePolice, GradeGendarmerie, GradePompiers,
    CategorieGrade, HIERARCHIE_POLICE, HIERARCHIE_GENDARMERIE, HIERARCHIE_POMPIERS
)


class Agent(models.Model):
    """Agent des forces de l'ordre (Police, Gendarmerie, Pompiers)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Informations personnelles
    citoyen = models.ForeignKey(
        'api.Citoyen',
        on_delete=models.SET_NULL,
        related_name='agents',
        blank=True,
        null=True
    )
    
    # Identification professionnelle
    matricule = models.CharField(max_length=50, unique=True)
    type_force = models.CharField(max_length=50, choices=TypeForceOrdre.choices)
    
    # Grade
    grade_police = models.CharField(
        max_length=50,
        choices=GradePolice.choices,
        blank=True,
        null=True
    )
    grade_gendarmerie = models.CharField(
        max_length=50,
        choices=GradeGendarmerie.choices,
        blank=True,
        null=True
    )
    grade_pompiers = models.CharField(
        max_length=50,
        choices=GradePompiers.choices,
        blank=True,
        null=True
    )
    
    # Informations professionnelles
    unite_affectation = models.CharField(max_length=200, blank=True, null=True)
    poste = models.CharField(max_length=200, blank=True, null=True)
    date_entree_service = models.DateField(blank=True, null=True)
    date_nomination_grade = models.DateField(blank=True, null=True)
    
    # Formation
    ecole_formation = models.ForeignKey(
        'api.EcoleFormation',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='agents_formes'
    )
    annee_formation = models.IntegerField(blank=True, null=True)
    promotion = models.CharField(max_length=100, blank=True, null=True)
    
    # Statut
    STATUT_CHOICES = [
        ('ACTIF', 'Actif'),
        ('EN_SERVICE', 'En Service'),
        ('EN_MISSION', 'En Mission'),
        ('CONGE', 'En Congé'),
        ('SUSPENDU', 'Suspendu'),
        ('RETRAITE', 'Retraité'),
        ('DECEDE', 'Décédé'),
    ]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='ACTIF')
    
    # Compétences et spécialités
    specialites = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    competences = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    
    # Équipements et véhicules
    equipements_ids = ArrayField(models.UUIDField(), blank=True, default=list)
    vehicule_affecte = models.CharField(max_length=100, blank=True, null=True)
    
    # Position géographique actuelle
    position_latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    position_longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    position_timestamp = models.DateTimeField(blank=True, null=True)
    
    # Statistiques
    verifications_effectuees = models.IntegerField(default=0)
    alertes_creees = models.IntegerField(default=0)
    arrestations = models.IntegerField(default=0)
    missions_completes = models.IntegerField(default=0)
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    cree_par = models.UUIDField(blank=True, null=True)
    modifie_par = models.UUIDField(blank=True, null=True)
    
    class Meta:
        db_table = 'agents'
        indexes = [
            models.Index(fields=['matricule']),
            models.Index(fields=['type_force', 'statut']),
        ]
    
    def __str__(self):
        return f"{self.matricule} - {self.get_type_force_display()}"
    
    @property
    def grade(self):
        """Retourne le grade selon le type de force"""
        if self.type_force == TypeForceOrdre.POLICE_NATIONALE:
            return self.grade_police
        elif self.type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
            return self.grade_gendarmerie
        elif self.type_force == TypeForceOrdre.SAPEURS_POMPIERS:
            return self.grade_pompiers
        return None
    
    @property
    def niveau_hierarchique(self):
        """Retourne le niveau hiérarchique du grade"""
        grade = self.grade
        if not grade:
            return 0
        
        if self.type_force == TypeForceOrdre.POLICE_NATIONALE:
            return HIERARCHIE_POLICE.get(grade, 0)
        elif self.type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
            return HIERARCHIE_GENDARMERIE.get(grade, 0)
        elif self.type_force == TypeForceOrdre.SAPEURS_POMPIERS:
            return HIERARCHIE_POMPIERS.get(grade, 0)
        return 0
    
    @property
    def categorie_grade(self):
        """Retourne la catégorie du grade"""
        niveau = self.niveau_hierarchique
        
        if self.type_force == TypeForceOrdre.POLICE_NATIONALE:
            if niveau <= 4:
                return CategorieGrade.SOUS_OFFICIER
            elif niveau <= 7:
                return CategorieGrade.OFFICIER_SUBALTERNE
            elif niveau <= 10:
                return CategorieGrade.OFFICIER_SUPERIEUR
            else:
                return CategorieGrade.HAUT_OFFICIER
        
        elif self.type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
            if niveau <= 2:
                return CategorieGrade.HOMME_DU_RANG
            elif niveau <= 7:
                return CategorieGrade.SOUS_OFFICIER
            elif niveau <= 10:
                return CategorieGrade.OFFICIER_SUBALTERNE
            elif niveau <= 13:
                return CategorieGrade.OFFICIER_SUPERIEUR
            else:
                return CategorieGrade.OFFICIER_GENERAL
        
        elif self.type_force == TypeForceOrdre.SAPEURS_POMPIERS:
            if niveau <= 2:
                return CategorieGrade.HOMME_DU_RANG
            elif niveau <= 8:
                return CategorieGrade.SOUS_OFFICIER
            elif niveau <= 11:
                return CategorieGrade.OFFICIER_SUBALTERNE
            elif niveau <= 14:
                return CategorieGrade.OFFICIER_SUPERIEUR
            else:
                return CategorieGrade.HAUT_COMMANDEMENT
        
        return CategorieGrade.INCONNU
    
    def est_grade_superieur(self, autre_agent):
        """Vérifie si cet agent a un grade supérieur à un autre"""
        if self.type_force != autre_agent.type_force:
            return False
        return self.niveau_hierarchique > autre_agent.niveau_hierarchique
    
    def peut_commander(self, autre_agent):
        """Vérifie si cet agent peut commander un autre agent"""
        return self.est_grade_superieur(autre_agent)


class Mission(models.Model):
    """Mission assignée à un agent"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Informations de base
    titre = models.CharField(max_length=200)
    description = models.TextField()
    
    # Agent assigné
    agent = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
        related_name='missions'
    )
    
    # Dates
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    # Statut
    STATUT_CHOICES = [
        ('EN_ATTENTE', 'En Attente'),
        ('EN_COURS', 'En Cours'),
        ('TERMINEE', 'Terminée'),
        ('ANNULEE', 'Annulée'),
    ]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='EN_ATTENTE')
    
    # Localisation
    lieu = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    # Résultats
    resultat = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'missions'
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.titre} - {self.agent.matricule}"

