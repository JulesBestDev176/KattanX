"""
Modèles Django pour l'authentification et la gestion des utilisateurs
Système unifié gérant Citoyens, Agents et Contrôleurs
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.contrib.auth.hashers import make_password, check_password
import uuid
from .enums import (
    Genre, RegionSenegal, DepartementSenegal, TypeForceOrdre,
    GradePolice, GradeGendarmerie, GradePompiers, StatutPersonnel,
    RoleUtilisateur, StatutInscription, Permission, PERMISSIONS_PAR_ROLE
)


class Brigade(models.Model):
    """Brigade (commissariat, gendarmerie, caserne)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    nom = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    type_force = models.CharField(max_length=50, choices=TypeForceOrdre.choices)
    
    region = models.CharField(max_length=50, choices=RegionSenegal.choices)
    departement = models.CharField(max_length=50, choices=DepartementSenegal.choices)
    commune = models.CharField(max_length=200)
    adresse = models.CharField(max_length=255)
    coordonnees_gps = JSONField(blank=True, null=True)  # {latitude, longitude}
    
    telephone = models.CharField(max_length=50)
    email = models.EmailField(max_length=255, blank=True, null=True)
    numero_urgence = models.CharField(max_length=20, blank=True, null=True)
    
    # Superviseur (peut être un Utilisateur avec le rôle SUPERVISEUR_BRIGADE)
    superviseur_id = models.CharField(max_length=50, blank=True, null=True)  # ID de l'utilisateur superviseur
    superviseur_nom = models.CharField(max_length=200, blank=True, null=True)
    superviseur_prenom = models.CharField(max_length=200, blank=True, null=True)
    superviseur_grade = models.CharField(max_length=50, blank=True, null=True)
    superviseur_matricule = models.CharField(max_length=50, blank=True, null=True)
    
    nombre_agents = models.IntegerField(default=0)
    agents_ids = ArrayField(models.CharField(max_length=50), blank=True, default=list)  # IDs des Utilisateurs agents
    
    equipes = JSONField(blank=True, null=True)  # Array of {id, nom, chefEquipeId, membresIds, horaire}
    
    statistiques = JSONField(blank=True, null=True)  # {verificationsEffectuees, alertesTraitees, arrestations, missionsCompletes}
    
    statut = models.CharField(max_length=20, choices=[('ACTIF', 'Actif'), ('INACTIF', 'Inactif'), ('MAINTENANCE', 'Maintenance')], default='ACTIF')
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'brigades'
        verbose_name = "Brigade"
        verbose_name_plural = "Brigades"
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['type_force', 'region']),
        ]

    def __str__(self):
        return f"{self.nom} ({self.code})"


class Utilisateur(models.Model):
    """Modèle Utilisateur unifié (Citoyen + Agent + Contrôleur)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_identification_unique = models.CharField(max_length=20, unique=True, blank=True, null=True)
    
    # Informations citoyennes de base
    citoyen_id = models.CharField(max_length=50, blank=True, null=True)  # Lien vers le profil Citoyen complet
    numero_cni = models.CharField(max_length=13, unique=True, blank=True, null=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=100)
    genre = models.CharField(max_length=10, choices=Genre.choices)
    
    # Contact et Authentification
    telephone = models.CharField(max_length=15, unique=True)
    telephone_verifie = models.BooleanField(default=False)
    email = models.EmailField(max_length=100, unique=True, blank=True, null=True)
    email_verifie = models.BooleanField(default=False)
    mot_de_passe_hash = models.CharField(max_length=255)
    
    # Rôles et Permissions
    roles = ArrayField(models.CharField(max_length=50), default=list)  # Liste des rôles actifs
    roles_historique = JSONField(blank=True, null=True)  # Array of {role, dateDebut, dateFin, motif}
    
    # Statut d'inscription
    statut_inscription = models.CharField(max_length=50, choices=StatutInscription.choices, default=StatutInscription.ETAPE_1_INFORMATIONS_BASE)
    date_inscription = models.DateTimeField(auto_now_add=True)
    date_activation = models.DateTimeField(blank=True, null=True)
    etapes_inscription = JSONField(blank=True, null=True)  # {etape1: {completee, ...}, etape2: {...}, etape3: {...}}
    
    # Biométrie
    biometrie = JSONField(blank=True, null=True)  # {photoProfilURL, empreinteDigitaleIds, reconnaissanceFacialeId, biometrieValidee, dateValidation}
    
    # Informations Agent (si applicable)
    info_agent = JSONField(blank=True, null=True)  # InfoAgent interface
    
    # Informations Contrôleur (si applicable)
    info_controleur = JSONField(blank=True, null=True)  # InfoControleur interface
    
    # Sécurité
    derniere_connexion = models.DateTimeField(blank=True, null=True)
    dernier_changement_mot_de_passe = models.DateTimeField(blank=True, null=True)
    tentatives_connexion_echouees = models.IntegerField(default=0)
    compte_verrouille = models.BooleanField(default=False)
    date_verrouillage = models.DateTimeField(blank=True, null=True)
    deux_facteurs_actif = models.BooleanField(default=False)
    methode_deux_facteurs = models.CharField(max_length=20, blank=True, null=True, choices=[('SMS', 'SMS'), ('EMAIL', 'Email'), ('AUTHENTICATOR', 'Authenticator')])
    
    # Préférences
    preferences = JSONField(blank=True, null=True)  # {langue, notifications, theme}
    
    # Audit
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    cree_par = models.CharField(max_length=50, blank=True, null=True)
    modifie_par = models.CharField(max_length=50, blank=True, null=True)
    
    # Tokens de session (pour gestion interne, non stockés directement en JWT)
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    refresh_token_expiration = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'utilisateurs'
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        indexes = [
            models.Index(fields=['numero_identification_unique']),
            models.Index(fields=['numero_cni']),
            models.Index(fields=['telephone']),
            models.Index(fields=['email']),
            models.Index(fields=['statut_inscription']),
        ]

    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.numero_identification_unique or self.numero_cni or self.telephone})"

    def set_password(self, raw_password):
        """Hash et stocke le mot de passe"""
        from django.utils import timezone
        self.mot_de_passe_hash = make_password(raw_password)
        self.dernier_changement_mot_de_passe = timezone.now()
        self.save(update_fields=['mot_de_passe_hash', 'dernier_changement_mot_de_passe'])

    def check_password(self, raw_password):
        """Vérifie le mot de passe"""
        return check_password(raw_password, self.mot_de_passe_hash)

    def has_permission(self, permission: str) -> bool:
        """Vérifie si l'utilisateur a une permission donnée."""
        for role in self.roles:
            role_permissions = PERMISSIONS_PAR_ROLE.get(role, [])
            if permission in [p.value for p in role_permissions]:
                return True
        return False

    def has_role(self, role: str) -> bool:
        """Vérifie si l'utilisateur a un rôle donné"""
        return role in self.roles

    def add_role(self, role: str, motif: str = None):
        """Ajoute un rôle à l'utilisateur et met à jour l'historique."""
        if role not in self.roles:
            self.roles.append(role)
            if self.roles_historique is None:
                self.roles_historique = []
            from django.utils import timezone
            self.roles_historique.append({
                'role': role,
                'dateDebut': timezone.now().isoformat(),
                'motif': motif
            })
            self.save(update_fields=['roles', 'roles_historique'])

    def remove_role(self, role: str, motif: str = None):
        """Retire un rôle de l'utilisateur et met à jour l'historique."""
        if role in self.roles:
            self.roles.remove(role)
            if self.roles_historique:
                from django.utils import timezone
                for entry in self.roles_historique:
                    if entry.get('role') == role and 'dateFin' not in entry:
                        entry['dateFin'] = timezone.now().isoformat()
                        entry['motif'] = motif
                        break
            self.save(update_fields=['roles', 'roles_historique'])

    def incrementer_tentatives_echouees(self):
        """Incrémente les tentatives échouées et verrouille si nécessaire"""
        self.tentatives_connexion_echouees += 1
        if self.tentatives_connexion_echouees >= 3:
            self.compte_verrouille = True
            from django.utils import timezone
            self.date_verrouillage = timezone.now()
        self.save(update_fields=['tentatives_connexion_echouees', 'compte_verrouille', 'date_verrouillage'])

    def reinitialiser_tentatives(self):
        """Réinitialise les tentatives échouées"""
        self.tentatives_connexion_echouees = 0
        self.compte_verrouille = False
        self.date_verrouillage = None
        self.save(update_fields=['tentatives_connexion_echouees', 'compte_verrouille', 'date_verrouillage'])


class CompteRendu(models.Model):
    """Compte rendu d'un agent à son supérieur"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    numero_reference = models.CharField(max_length=100, unique=True)
    
    agent = models.ForeignKey(
        'api.Agent',
        on_delete=models.CASCADE,
        related_name='comptes_rendus_emis'
    )
    
    destinataire_id = models.CharField(max_length=50)  # ID de l'utilisateur supérieur
    destinataire_nom = models.CharField(max_length=200)
    destinataire_grade = models.CharField(max_length=50)
    
    type = models.CharField(max_length=50, choices=[
        ('QUOTIDIEN', 'Quotidien'),
        ('INCIDENT', 'Incident'),
        ('MISSION', 'Mission'),
        ('PERIODIQUE', 'Périodique'),
        ('EXCEPTIONNEL', 'Exceptionnel'),
    ])
    
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    
    titre = models.CharField(max_length=255)
    description = models.TextField()
    
    activites = JSONField(blank=True, null=True)  # Array of {type, description, date, lieu, resultat, preuves}
    statistiques = JSONField(blank=True, null=True)  # {verificationsEffectuees, alertesTraitees, arrestations, missionsCompletes, heuresService, kilometresParcourus}
    
    observations = models.TextField(blank=True, null=True)
    recommandations = models.TextField(blank=True, null=True)
    difficultes = models.TextField(blank=True, null=True)
    
    documents_joints = JSONField(blank=True, null=True)  # Array of {nom, type, url, taille}
    
    statut = models.CharField(max_length=50, choices=[
        ('EN_ATTENTE', 'En Attente'),
        ('VU', 'Vu'),
        ('VALIDE', 'Validé'),
        ('REJETE', 'Rejeté'),
        ('COMPLEMENTAIRE_REQUIS', 'Complémentaire Requis'),
    ], default='EN_ATTENTE')
    date_envoi = models.DateTimeField(auto_now_add=True)
    date_lecture = models.DateTimeField(blank=True, null=True)
    date_validation = models.DateTimeField(blank=True, null=True)
    
    reponse_superieur = JSONField(blank=True, null=True)  # {date, commentaire, validation, complementsRequis}
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comptes_rendus'
        verbose_name = "Compte Rendu"
        verbose_name_plural = "Comptes Rendus"
        ordering = ['-date_envoi']
        indexes = [
            models.Index(fields=['agent', 'statut']),
            models.Index(fields=['destinataire_id', 'statut']),
        ]

    def __str__(self):
        return f"CR {self.numero_reference} par {self.agent.matricule} ({self.statut})"


class HistoriqueAgent(models.Model):
    """Historique complet des actions d'un agent"""
    agent = models.OneToOneField(
        'api.Agent',
        on_delete=models.CASCADE,
        related_name='historique_complet'
    )
    
    verifications = JSONField(blank=True, null=True)  # Array of {id, date, type, citoyenId, citoyenNom, resultat, actionsSuivies, localisation}
    alertes = JSONField(blank=True, null=True)  # Array of {id, date, type, alerteId, description, statut}
    missions = JSONField(blank=True, null=True)  # Array of {id, dateAssignation, dateCompletion, titre, priorite, statut, resultat}
    arrestations = JSONField(blank=True, null=True)  # Array of {id, date, citoyenId, citoyenNom, motif, lieu, validee}
    periodes_service = JSONField(blank=True, null=True)  # Array of {dateDebut, dateFin, heures, type}
    comptes_rendus = JSONField(blank=True, null=True)  # Array of {id, date, type, statut, destinataire}
    formations = JSONField(blank=True, null=True)  # Array of {date, intitule, duree, organisme, diplome}
    evaluations = JSONField(blank=True, null=True)  # Array of {date, evaluateur, note, commentaire}
    sanctions = JSONField(blank=True, null=True)  # Array of {date, type, motif, duree}
    recompenses = JSONField(blank=True, null=True)  # Array of {date, type, motif}
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'historiques_agents'
        verbose_name = "Historique Agent"
        verbose_name_plural = "Historiques Agents"

    def __str__(self):
        return f"Historique de {self.agent.matricule}"

