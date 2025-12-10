"""
Enums pour les modèles
"""
from django.db import models


# ============================================
# Enums pour les citoyens
# ============================================

class Genre(models.TextChoices):
    MASCULIN = 'M', 'Masculin'
    FEMININ = 'F', 'Féminin'
    AUTRE = 'A', 'Autre'


class SituationMatrimoniale(models.TextChoices):
    CELIBATAIRE = 'CELIBATAIRE', 'Célibataire'
    MARIE = 'MARIE', 'Marié(e)'
    DIVORCE = 'DIVORCE', 'Divorcé(e)'
    VEUF = 'VEUF', 'Veuf(ve)'
    CONCUBINAGE = 'CONCUBINAGE', 'En concubinage'
    SEPARE = 'SEPARE', 'Séparé(e)'


class GroupeSanguin(models.TextChoices):
    A_POSITIF = 'A+', 'A+'
    A_NEGATIF = 'A-', 'A-'
    B_POSITIF = 'B+', 'B+'
    B_NEGATIF = 'B-', 'B-'
    AB_POSITIF = 'AB+', 'AB+'
    AB_NEGATIF = 'AB-', 'AB-'
    O_POSITIF = 'O+', 'O+'
    O_NEGATIF = 'O-', 'O-'


class RegionSenegal(models.TextChoices):
    DAKAR = 'DAKAR', 'Dakar'
    THIES = 'THIES', 'Thiès'
    SAINT_LOUIS = 'SAINT_LOUIS', 'Saint-Louis'
    LOUGA = 'LOUGA', 'Louga'
    MATAM = 'MATAM', 'Matam'
    TAMBACOUNDA = 'TAMBACOUNDA', 'Tambacounda'
    KEDOUGOU = 'KEDOUGOU', 'Kédougou'
    KOLDA = 'KOLDA', 'Kolda'
    SEDHIOU = 'SEDHIOU', 'Sédhiou'
    ZIGUINCHOR = 'ZIGUINCHOR', 'Ziguinchor'
    KAOLACK = 'KAOLACK', 'Kaolack'
    FATICK = 'FATICK', 'Fatick'
    DIOURBEL = 'DIOURBEL', 'Diourbel'


class DepartementSenegal(models.TextChoices):
    # Dakar
    DAKAR = 'DAKAR', 'Dakar'
    PIKINE = 'PIKINE', 'Pikine'
    RUFISQUE = 'RUFISQUE', 'Rufisque'
    GUEDIAWAYE = 'GUEDIAWAYE', 'Guédiawaye'
    # Autres départements
    THIES = 'THIES', 'Thiès'
    MBOUR = 'MBOUR', 'Mbour'
    TIVAOUANE = 'TIVAOUANE', 'Tivaouane'
    AUTRE = 'AUTRE', 'Autre'


class Nationalite(models.TextChoices):
    SENEGALAISE = 'SENEGALAISE', 'Sénégalaise'
    FRANCAISE = 'FRANCAISE', 'Française'
    MAURITANIENNE = 'MAURITANIENNE', 'Mauritanienne'
    MALIENNE = 'MALIENNE', 'Malienne'
    GUINEENNE = 'GUINEENNE', 'Guinéenne'
    GAMBIENNE = 'GAMBIENNE', 'Gambienne'
    AUTRE = 'AUTRE', 'Autre'


class Profession(models.TextChoices):
    FONCTIONNAIRE = 'FONCTIONNAIRE', 'Fonctionnaire'
    COMMERÇANT = 'COMMERÇANT', 'Commerçant'
    ETUDIANT = 'ETUDIANT', 'Étudiant'
    ELEVE = 'ELEVE', 'Élève'
    CHOMEUR = 'CHOMEUR', 'Chômeur'
    RETRAITE = 'RETRAITE', 'Retraité'
    AGRICULTEUR = 'AGRICULTEUR', 'Agriculteur'
    ELEVEUR = 'ELEVEUR', 'Éleveur'
    ARTISAN = 'ARTISAN', 'Artisan'
    MEDECIN = 'MEDECIN', 'Médecin'
    INFIRMIER = 'INFIRMIER', 'Infirmier'
    ENSEIGNANT = 'ENSEIGNANT', 'Enseignant'
    AUTRE = 'AUTRE', 'Autre'


class StatutCitoyen(models.TextChoices):
    ACTIF = 'ACTIF', 'Actif'
    DECEDE = 'DECEDE', 'Décédé'
    EXPATRIE = 'EXPATRIE', 'Expatrié'
    SUSPENDU = 'SUSPENDU', 'Suspendu'
    INCONNU = 'INCONNU', 'Inconnu'


class Doigt(models.TextChoices):
    POUCE_GAUCHE = 'POUCE_GAUCHE', 'Pouce gauche'
    INDEX_GAUCHE = 'INDEX_GAUCHE', 'Index gauche'
    MAJEUR_GAUCHE = 'MAJEUR_GAUCHE', 'Majeur gauche'
    ANNULAIRE_GAUCHE = 'ANNULAIRE_GAUCHE', 'Annulaire gauche'
    AURICULAIRE_GAUCHE = 'AURICULAIRE_GAUCHE', 'Auriculaire gauche'
    POUCE_DROIT = 'POUCE_DROIT', 'Pouce droit'
    INDEX_DROIT = 'INDEX_DROIT', 'Index droit'
    MAJEUR_DROIT = 'MAJEUR_DROIT', 'Majeur droit'
    ANNULAIRE_DROIT = 'ANNULAIRE_DROIT', 'Annulaire droit'
    AURICULAIRE_DROIT = 'AURICULAIRE_DROIT', 'Auriculaire droit'


class FormatEmpreinte(models.TextChoices):
    WSQ = 'WSQ', 'WSQ'
    ANSI_NIST = 'ANSI_NIST', 'ANSI/NIST'
    ISO_19794_2 = 'ISO_19794_2', 'ISO/IEC 19794-2'


class FormatPhoto(models.TextChoices):
    JPEG = 'JPEG', 'JPEG'
    PNG = 'PNG', 'PNG'
    JPEG2000 = 'JPEG2000', 'JPEG2000'


class FormatSignature(models.TextChoices):
    PNG = 'PNG', 'PNG'
    SVG = 'SVG', 'SVG'
    JPEG = 'JPEG', 'JPEG'


class TypeCaptureSignature(models.TextChoices):
    NUMERISEE = 'NUMERISEE', 'Numérisée'
    TABLETTE = 'TABLETTE', 'Tablette'
    ECRAN_TACTILE = 'ECRAN_TACTILE', 'Écran tactile'


class AlgorithmeReconnaissance(models.TextChoices):
    FACENET = 'FACENET', 'FaceNet'
    DLIB = 'DLIB', 'dlib'
    ARCFACE = 'ARCFACE', 'ArcFace'
    DEEPFACE = 'DEEPFACE', 'DeepFace'


class FormatIris(models.TextChoices):
    ISO_19794_6 = 'ISO_19794_6', 'ISO/IEC 19794-6'


class Oeil(models.TextChoices):
    GAUCHE = 'GAUCHE', 'Gauche'
    DROIT = 'DROIT', 'Droit'


class TypeVerificationBiometrique(models.TextChoices):
    UNE_A_UNE = 'UNE_A_UNE', '1:1 (Vérification)'
    UNE_A_N = 'UNE_A_N', '1:N (Identification)'


class ResultatVerification(models.TextChoices):
    MATCH = 'MATCH', 'Correspondance'
    NO_MATCH = 'NO_MATCH', 'Pas de correspondance'
    ERREUR = 'ERREUR', 'Erreur'


class StatutPersonnel(models.TextChoices):
    ACTIF = 'ACTIF', 'Actif'
    RETRAITE = 'RETRAITE', 'Retraité'
    DEMISSIONNAIRE = 'DEMISSIONNAIRE', 'Démissionnaire'
    SUSPENDU = 'SUSPENDU', 'Suspendu'
    DECEDE = 'DECEDE', 'Décédé'


class TypeUnite(models.TextChoices):
    BRIGADE = 'BRIGADE', 'Brigade'
    SECTION = 'SECTION', 'Section'
    COMPAGNIE = 'COMPAGNIE', 'Compagnie'
    BATAILLON = 'BATAILLON', 'Bataillon'
    REGIMENT = 'REGIMENT', 'Régiment'


# ============================================
# Enums pour les forces de l'ordre
# ============================================

class TypeForceOrdre(models.TextChoices):
    """Type de force de l'ordre"""
    POLICE_NATIONALE = 'POLICE_NATIONALE', 'Police Nationale'
    GENDARMERIE_NATIONALE = 'GENDARMERIE_NATIONALE', 'Gendarmerie Nationale'
    SAPEURS_POMPIERS = 'SAPEURS_POMPIERS', 'Sapeurs-Pompiers'


class GradePolice(models.TextChoices):
    """Grades de la Police Nationale"""
    GARDIEN_PAIX = 'GARDIEN_PAIX', 'Gardien de la Paix'
    BRIGADIER = 'BRIGADIER', 'Brigadier'
    BRIGADIER_CHEF = 'BRIGADIER_CHEF', 'Brigadier-Chef'
    MAJOR_DE_POLICE = 'MAJOR_DE_POLICE', 'Major de Police'
    SOUS_LIEUTENANT = 'SOUS_LIEUTENANT', 'Sous-Lieutenant'
    LIEUTENANT = 'LIEUTENANT', 'Lieutenant'
    CAPITAINE = 'CAPITAINE', 'Capitaine'
    COMMANDANT = 'COMMANDANT', 'Commandant'
    LIEUTENANT_COLONEL = 'LIEUTENANT_COLONEL', 'Lieutenant-Colonel'
    COLONEL = 'COLONEL', 'Colonel'
    CONTROLEUR_GENERAL = 'CONTROLEUR_GENERAL', 'Contrôleur Général'
    INSPECTEUR_GENERAL = 'INSPECTEUR_GENERAL', 'Inspecteur Général'
    DIRECTEUR_GENERAL = 'DIRECTEUR_GENERAL', 'Directeur Général'


class GradeGendarmerie(models.TextChoices):
    """Grades de la Gendarmerie Nationale"""
    GENDARME = 'GENDARME', 'Gendarme'
    GENDARME_CHEF = 'GENDARME_CHEF', 'Gendarme-Chef'
    MARECHAL_LOGIS = 'MARECHAL_LOGIS', 'Maréchal des Logis'
    MARECHAL_LOGIS_CHEF = 'MARECHAL_LOGIS_CHEF', 'Maréchal des Logis-Chef'
    ADJUDANT = 'ADJUDANT', 'Adjudant'
    ADJUDANT_CHEF = 'ADJUDANT_CHEF', 'Adjudant-Chef'
    MAJOR = 'MAJOR', 'Major'
    SOUS_LIEUTENANT = 'SOUS_LIEUTENANT', 'Sous-Lieutenant'
    LIEUTENANT = 'LIEUTENANT', 'Lieutenant'
    CAPITAINE = 'CAPITAINE', 'Capitaine'
    CHEF_ESCADRON = 'CHEF_ESCADRON', 'Chef d\'Escadron'
    LIEUTENANT_COLONEL = 'LIEUTENANT_COLONEL', 'Lieutenant-Colonel'
    COLONEL = 'COLONEL', 'Colonel'
    GENERAL_DE_BRIGADE = 'GENERAL_DE_BRIGADE', 'Général de Brigade'
    GENERAL_DE_DIVISION = 'GENERAL_DE_DIVISION', 'Général de Division'
    GENERAL_DE_CORPS_ARMEE = 'GENERAL_DE_CORPS_ARMEE', 'Général de Corps d\'Armée'
    HAUT_COMMANDANT = 'HAUT_COMMANDANT', 'Haut-Commandant'


class GradePompiers(models.TextChoices):
    """Grades des Sapeurs-Pompiers"""
    SAPEUR = 'SAPEUR', 'Sapeur'
    SAPEUR_CHEF = 'SAPEUR_CHEF', 'Sapeur-Chef'
    CAPORAL = 'CAPORAL', 'Caporal'
    CAPORAL_CHEF = 'CAPORAL_CHEF', 'Caporal-Chef'
    SERGENT = 'SERGENT', 'Sergent'
    SERGENT_CHEF = 'SERGENT_CHEF', 'Sergent-Chef'
    ADJUDANT = 'ADJUDANT', 'Adjudant'
    ADJUDANT_CHEF = 'ADJUDANT_CHEF', 'Adjudant-Chef'
    SOUS_LIEUTENANT = 'SOUS_LIEUTENANT', 'Sous-Lieutenant'
    LIEUTENANT = 'LIEUTENANT', 'Lieutenant'
    CAPITAINE = 'CAPITAINE', 'Capitaine'
    COMMANDANT = 'COMMANDANT', 'Commandant'
    LIEUTENANT_COLONEL = 'LIEUTENANT_COLONEL', 'Lieutenant-Colonel'
    COLONEL = 'COLONEL', 'Colonel'
    DIRECTEUR_NATIONAL = 'DIRECTEUR_NATIONAL', 'Directeur National'


class CategorieGrade(models.TextChoices):
    """Catégories de grades"""
    HOMME_DU_RANG = 'HOMME_DU_RANG', 'Homme du Rang'
    SOUS_OFFICIER = 'SOUS_OFFICIER', 'Sous-Officier'
    OFFICIER_SUBALTERNE = 'OFFICIER_SUBALTERNE', 'Officier Subalterne'
    OFFICIER_SUPERIEUR = 'OFFICIER_SUPERIEUR', 'Officier Supérieur'
    OFFICIER_GENERAL = 'OFFICIER_GENERAL', 'Officier Général'
    HAUT_OFFICIER = 'HAUT_OFFICIER', 'Haut Officier'
    HAUT_COMMANDEMENT = 'HAUT_COMMANDEMENT', 'Haut Commandement'
    INCONNU = 'INCONNU', 'Inconnu'


# Constantes pour les hiérarchies
HIERARCHIE_POLICE = {
    GradePolice.GARDIEN_PAIX: 1,
    GradePolice.BRIGADIER: 2,
    GradePolice.BRIGADIER_CHEF: 3,
    GradePolice.MAJOR_DE_POLICE: 4,
    GradePolice.SOUS_LIEUTENANT: 5,
    GradePolice.LIEUTENANT: 6,
    GradePolice.CAPITAINE: 7,
    GradePolice.COMMANDANT: 8,
    GradePolice.LIEUTENANT_COLONEL: 9,
    GradePolice.COLONEL: 10,
    GradePolice.CONTROLEUR_GENERAL: 11,
    GradePolice.INSPECTEUR_GENERAL: 12,
    GradePolice.DIRECTEUR_GENERAL: 13,
}

HIERARCHIE_GENDARMERIE = {
    GradeGendarmerie.GENDARME: 1,
    GradeGendarmerie.GENDARME_CHEF: 2,
    GradeGendarmerie.MARECHAL_LOGIS: 3,
    GradeGendarmerie.MARECHAL_LOGIS_CHEF: 4,
    GradeGendarmerie.ADJUDANT: 5,
    GradeGendarmerie.ADJUDANT_CHEF: 6,
    GradeGendarmerie.MAJOR: 7,
    GradeGendarmerie.SOUS_LIEUTENANT: 8,
    GradeGendarmerie.LIEUTENANT: 9,
    GradeGendarmerie.CAPITAINE: 10,
    GradeGendarmerie.CHEF_ESCADRON: 11,
    GradeGendarmerie.LIEUTENANT_COLONEL: 12,
    GradeGendarmerie.COLONEL: 13,
    GradeGendarmerie.GENERAL_DE_BRIGADE: 14,
    GradeGendarmerie.GENERAL_DE_DIVISION: 15,
    GradeGendarmerie.GENERAL_DE_CORPS_ARMEE: 16,
    GradeGendarmerie.HAUT_COMMANDANT: 17,
}

HIERARCHIE_POMPIERS = {
    GradePompiers.SAPEUR: 1,
    GradePompiers.SAPEUR_CHEF: 2,
    GradePompiers.CAPORAL: 3,
    GradePompiers.CAPORAL_CHEF: 4,
    GradePompiers.SERGENT: 5,
    GradePompiers.SERGENT_CHEF: 6,
    GradePompiers.ADJUDANT: 7,
    GradePompiers.ADJUDANT_CHEF: 8,
    GradePompiers.SOUS_LIEUTENANT: 9,
    GradePompiers.LIEUTENANT: 10,
    GradePompiers.CAPITAINE: 11,
    GradePompiers.COMMANDANT: 12,
    GradePompiers.LIEUTENANT_COLONEL: 13,
    GradePompiers.COLONEL: 14,
    GradePompiers.DIRECTEUR_NATIONAL: 15,
}


# ============================================
# Enums pour les véhicules
# ============================================

class MarqueVehicule(models.TextChoices):
    """Marques de véhicules courantes au Sénégal"""
    TOYOTA = 'TOYOTA', 'Toyota'
    MERCEDES = 'MERCEDES', 'Mercedes-Benz'
    PEUGEOT = 'PEUGEOT', 'Peugeot'
    RENAULT = 'RENAULT', 'Renault'
    NISSAN = 'NISSAN', 'Nissan'
    HYUNDAI = 'HYUNDAI', 'Hyundai'
    KIA = 'KIA', 'Kia'
    SUZUKI = 'SUZUKI', 'Suzuki'
    FORD = 'FORD', 'Ford'
    VOLKSWAGEN = 'VOLKSWAGEN', 'Volkswagen'
    AUTRE = 'AUTRE', 'Autre'


class TypeVehicule(models.TextChoices):
    """Types de véhicules"""
    VOITURE_PARTICULIERE = 'VOITURE_PARTICULIERE', 'Voiture Particulière'
    MOTO = 'MOTO', 'Moto'
    CAMION = 'CAMION', 'Camion'
    BUS = 'BUS', 'Bus'
    TAXI = 'TAXI', 'Taxi'
    CAMIONNETTE = 'CAMIONNETTE', 'Camionnette'
    AUTRE = 'AUTRE', 'Autre'


class CouleurVehicule(models.TextChoices):
    """Couleurs de véhicules"""
    BLANC = 'BLANC', 'Blanc'
    NOIR = 'NOIR', 'Noir'
    GRIS = 'GRIS', 'Gris'
    ARGENT = 'ARGENT', 'Argent'
    ROUGE = 'ROUGE', 'Rouge'
    BLEU = 'BLEU', 'Bleu'
    VERT = 'VERT', 'Vert'
    JAUNE = 'JAUNE', 'Jaune'
    ORANGE = 'ORANGE', 'Orange'
    BEIGE = 'BEIGE', 'Beige'
    MARRON = 'MARRON', 'Marron'
    AUTRE = 'AUTRE', 'Autre'


class TypeCarburant(models.TextChoices):
    """Types de carburant"""
    ESSENCE = 'ESSENCE', 'Essence'
    DIESEL = 'DIESEL', 'Diesel'
    GAZ = 'GAZ', 'Gaz (GPL)'
    ELECTRIQUE = 'ELECTRIQUE', 'Électrique'
    HYBRIDE = 'HYBRIDE', 'Hybride'
    HYBRIDE_RECHARGEABLE = 'HYBRIDE_RECHARGEABLE', 'Hybride Rechargeable'
    AUTRE = 'AUTRE', 'Autre'


class TypePhotoVehicule(models.TextChoices):
    """Types de photos de véhicule"""
    AVANT = 'AVANT', 'Vue Avant'
    ARRIERE = 'ARRIERE', 'Vue Arrière'
    COTE_GAUCHE = 'COTE_GAUCHE', 'Côté Gauche'
    COTE_DROIT = 'COTE_DROIT', 'Côté Droit'
    PLAQUE = 'PLAQUE', 'Plaque d\'Immatriculation'
    TABLEAU_BORD = 'TABLEAU_BORD', 'Tableau de Bord'
    CHASSIS = 'CHASSIS', 'Numéro de Châssis'
    MOTEUR = 'MOTEUR', 'Moteur'
    INTERIEUR = 'INTERIEUR', 'Intérieur'
    AUTRE = 'AUTRE', 'Autre'


class TypeAssurance(models.TextChoices):
    """Types d'assurance véhicule"""
    RESPONSABILITE_CIVILE = 'RESPONSABILITE_CIVILE', 'Responsabilité Civile'
    TOUS_RISQUES = 'TOUS_RISQUES', 'Tous Risques'
    TIERS_COLLISION = 'TIERS_COLLISION', 'Tiers Collision'
    TIERS_SIMPLE = 'TIERS_SIMPLE', 'Tiers Simple'


class StatutAssurance(models.TextChoices):
    """Statut de l'assurance"""
    VALIDE = 'VALIDE', 'Valide'
    EXPIREE = 'EXPIREE', 'Expirée'
    RESILIEE = 'RESILIEE', 'Résiliée'
    SUSPENDUE = 'SUSPENDUE', 'Suspendue'


class ResultatVisiteTechnique(models.TextChoices):
    """Résultat de la visite technique"""
    FAVORABLE = 'FAVORABLE', 'Favorable'
    DEFAVORABLE = 'DEFAVORABLE', 'Défavorable'
    SOUS_RESERVE = 'SOUS_RESERVE', 'Sous Réserve'


class StatutVisiteTechnique(models.TextChoices):
    """Statut de la visite technique"""
    VALIDE = 'VALIDE', 'Valide'
    EXPIREE = 'EXPIREE', 'Expirée'
    ANNULEE = 'ANNULEE', 'Annulée'


class TypeOrganismeGage(models.TextChoices):
    """Type d'organisme pour le gage"""
    BANQUE = 'BANQUE', 'Banque'
    INSTITUTION_FINANCIERE = 'INSTITUTION_FINANCIERE', 'Institution Financière'
    CREDIT_AUTO = 'CREDIT_AUTO', 'Crédit Auto'
    LEASING = 'LEASING', 'Leasing'
    AUTRE = 'AUTRE', 'Autre'


class StatutGage(models.TextChoices):
    """Statut du gage"""
    ACTIF = 'ACTIF', 'Actif'
    SOLDE = 'SOLDE', 'Soldé'
    EN_DEFAUT = 'EN_DEFAUT', 'En Défaut'
    RESILIE = 'RESILIE', 'Résilié'


class StatutEcheance(models.TextChoices):
    """Statut d'une échéance"""
    EN_ATTENTE = 'EN_ATTENTE', 'En Attente'
    PAYEE = 'PAYEE', 'Payée'
    EN_RETARD = 'EN_RETARD', 'En Retard'
    IMPAYEE = 'IMPAYEE', 'Impayée'


class TypeZoneGPS(models.TextChoices):
    """Type de zone GPS"""
    AUTORISEE = 'AUTORISEE', 'Autorisée'
    INTERDITE = 'INTERDITE', 'Interdite'
    ALERTE = 'ALERTE', 'Alerte'


class TypeAlerteGPS(models.TextChoices):
    """Types d'alertes GPS"""
    VITESSE = 'VITESSE', 'Vitesse Excessive'
    DEPLACEMENT = 'DEPLACEMENT', 'Déplacement Non Autorisé'
    BATTERIE = 'BATTERIE', 'Batterie Faible'
    COUPURE_ALIMENTATION = 'COUPURE_ALIMENTATION', 'Coupure d\'Alimentation'
    REMORQUAGE = 'REMORQUAGE', 'Remorquage Détecté'
    ZONE = 'ZONE', 'Entrée/Sortie de Zone'
    MOTEUR = 'MOTEUR', 'Moteur Allumé/Éteint'


class TypeUsageVehicule(models.TextChoices):
    """Usage du véhicule"""
    PARTICULIER = 'PARTICULIER', 'Particulier'
    PROFESSIONNEL = 'PROFESSIONNEL', 'Professionnel'
    COMMERCIAL = 'COMMERCIAL', 'Commercial'
    TAXI = 'TAXI', 'Taxi'
    LOCATION = 'LOCATION', 'Location'
    AUTRE = 'AUTRE', 'Autre'


class ModeAcquisition(models.TextChoices):
    """Mode d'acquisition du véhicule"""
    ACHAT_NEUF = 'ACHAT_NEUF', 'Achat Neuf'
    ACHAT_OCCASION = 'ACHAT_OCCASION', 'Achat d\'Occasion'
    DONATION = 'DONATION', 'Donation'
    HERITAGE = 'HERITAGE', 'Héritage'
    LOCATION_LONGUE_DUREE = 'LOCATION_LONGUE_DUREE', 'Location Longue Durée'
    AUTRE = 'AUTRE', 'Autre'


class StatutVehicule(models.TextChoices):
    """Statut du véhicule (étendu)"""
    ACTIF = 'ACTIF', 'Actif'
    EN_CIRCULATION = 'EN_CIRCULATION', 'En Circulation'
    HORS_CIRCULATION = 'HORS_CIRCULATION', 'Hors Circulation'
    VOLE = 'VOLE', 'Volé'
    RETIRE = 'RETIRE', 'Retiré'
    EN_REPARATION = 'EN_REPARATION', 'En Réparation'
    FOURRIERE = 'FOURRIERE', 'En Fourrière'
    SAISIE = 'SAISIE', 'Saisi'
    DETRUIT = 'DETRUIT', 'Détruit'


# ============================================
# Enums pour l'authentification et les rôles
# ============================================

class RoleUtilisateur(models.TextChoices):
    """Rôles disponibles dans le système"""
    CITOYEN = 'CITOYEN', 'Citoyen'
    AGENT_TERRAIN = 'AGENT_TERRAIN', 'Agent de Terrain'
    AGENT_BRIGADIER = 'AGENT_BRIGADIER', 'Agent Brigadier'
    SUPERVISEUR_BRIGADE = 'SUPERVISEUR_BRIGADE', 'Superviseur de Brigade'
    CONTROLEUR_REGIONAL = 'CONTROLEUR_REGIONAL', 'Contrôleur Régional'
    CONTROLEUR_NATIONAL = 'CONTROLEUR_NATIONAL', 'Contrôleur National'
    ADMIN_SYSTEME = 'ADMIN_SYSTEME', 'Administrateur Système'
    ADMIN_FONCTIONNEL = 'ADMIN_FONCTIONNEL', 'Administrateur Fonctionnel'


class Permission(models.TextChoices):
    """Permissions granulaires du système"""
    # Permissions Citoyen
    CONSULTER_PROPRE_PROFIL = 'consulter_propre_profil', 'Consulter son propre profil'
    MODIFIER_PROPRE_PROFIL = 'modifier_propre_profil', 'Modifier son propre profil'
    CONSULTER_PROPRES_DOCUMENTS = 'consulter_propres_documents', 'Consulter ses propres documents'
    CREER_DENONCIATION = 'creer_denonciation', 'Créer une dénonciation'
    CREER_PLAINTE = 'creer_plainte', 'Créer une plainte'
    CONSULTER_PROPRES_REVENUS = 'consulter_propres_revenus', 'Consulter ses propres revenus'
    EFFECTUER_TRANSFERT = 'effectuer_transfert', 'Effectuer un transfert'
    
    # Permissions Agent Terrain
    VERIFIER_IDENTITE = 'verifier_identite', 'Vérifier identité'
    CONSULTER_CITOYEN = 'consulter_citoyen', 'Consulter citoyen'
    CREER_ALERTE = 'creer_alerte', 'Créer une alerte'
    RECEVOIR_ALERTE = 'recevoir_alerte', 'Recevoir une alerte'
    CREER_AMENDE = 'creer_amende', 'Créer une amende'
    DEMANDER_ARRESTATION = 'demander_arrestation', 'Demander une arrestation'
    CONSULTER_PROPRES_STATS = 'consulter_propres_stats', 'Consulter ses propres statistiques'
    METTRE_A_JOUR_POSITION = 'mettre_a_jour_position', 'Mettre à jour sa position'
    ACTIVER_DESACTIVER_SERVICE = 'activer_desactiver_service', 'Activer/Désactiver service'
    
    # Permissions Superviseur Brigade
    CONSULTER_AGENTS_BRIGADE = 'consulter_agents_brigade', 'Consulter les agents de sa brigade'
    CONSULTER_STATS_AGENTS = 'consulter_stats_agents', 'Consulter les statistiques des agents'
    CONSULTER_HISTORIQUE_AGENT = 'consulter_historique_agent', 'Consulter l\'historique d\'un agent'
    RECEVOIR_COMPTE_RENDU = 'recevoir_compte_rendu', 'Recevoir un compte rendu'
    VALIDER_COMPTE_RENDU = 'valider_compte_rendu', 'Valider un compte rendu'
    ASSIGNER_MISSION_AGENT = 'assigner_mission_agent', 'Assigner une mission à un agent'
    MODIFIER_STATUT_AGENT = 'modifier_statut_agent', 'Modifier le statut d\'un agent'
    
    # Permissions Contrôleur Régional
    CONSULTER_BRIGADES_REGION = 'consulter_brigades_region', 'Consulter les brigades de sa région'
    CONSULTER_STATS_REGION = 'consulter_stats_region', 'Consulter les statistiques régionales'
    ASSIGNER_MISSION_BRIGADE = 'assigner_mission_brigade', 'Assigner une mission à une brigade'
    GERER_ALERTES_REGION = 'gerer_alertes_region', 'Gérer les alertes régionales'
    CONSULTER_SURVEILLANCE_VIDEO = 'consulter_surveillance_video', 'Consulter la surveillance vidéo'
    ANALYSER_DONNEES_IA = 'analyser_donnees_ia', 'Analyser les données IA'
    
    # Permissions Contrôleur National
    CONSULTER_TOUTES_REGIONS = 'consulter_toutes_regions', 'Consulter toutes les régions'
    CONSULTER_STATS_NATIONALES = 'consulter_stats_nationales', 'Consulter les statistiques nationales'
    GERER_ALERTES_NATIONALES = 'gerer_alertes_nationales', 'Gérer les alertes nationales'
    GENERER_RAPPORTS_NATIONAUX = 'generer_rapports_nationaux', 'Générer des rapports nationaux'
    
    # Permissions Admin
    GERER_UTILISATEURS = 'gerer_utilisateurs', 'Gérer les utilisateurs'
    GERER_ROLES = 'gerer_roles', 'Gérer les rôles'
    GERER_PERMISSIONS = 'gerer_permissions', 'Gérer les permissions'
    GERER_BRIGADES = 'gerer_brigades', 'Gérer les brigades'
    CONSULTER_AUDIT = 'consulter_audit', 'Consulter l\'audit'
    CONFIGURER_SYSTEME = 'configurer_systeme', 'Configurer le système'


class StatutInscription(models.TextChoices):
    """Statut du processus d'inscription"""
    ETAPE_1_INFORMATIONS_BASE = 'ETAPE_1_INFORMATIONS_BASE', 'Étape 1: Informations de base'
    ETAPE_1_EN_VERIFICATION = 'ETAPE_1_EN_VERIFICATION', 'Étape 1: En vérification'
    ETAPE_1_VALIDEE = 'ETAPE_1_VALIDEE', 'Étape 1: Validée'
    ETAPE_1_REJETEE = 'ETAPE_1_REJETEE', 'Étape 1: Rejetée'
    
    ETAPE_2_AUTHENTIFICATION = 'ETAPE_2_AUTHENTIFICATION', 'Étape 2: Authentification'
    ETAPE_2_OTP_ENVOYE = 'ETAPE_2_OTP_ENVOYE', 'Étape 2: OTP envoyé'
    ETAPE_2_OTP_VALIDE = 'ETAPE_2_OTP_VALIDE', 'Étape 2: OTP validé'
    ETAPE_2_NUMERO_ATTRIBUE = 'ETAPE_2_NUMERO_ATTRIBUE', 'Étape 2: Numéro unique attribué'
    
    ETAPE_3_BIOMETRIE = 'ETAPE_3_BIOMETRIE', 'Étape 3: Biométrie'
    ETAPE_3_PHOTO_UPLOADEE = 'ETAPE_3_PHOTO_UPLOADEE', 'Étape 3: Photo uploadée'
    ETAPE_3_EMPREINTE_ENREGISTREE = 'ETAPE_3_EMPREINTE_ENREGISTREE', 'Étape 3: Empreinte enregistrée'
    
    INSCRIPTION_COMPLETE = 'INSCRIPTION_COMPLETE', 'Inscription Complète'
    COMPTE_ACTIF = 'COMPTE_ACTIF', 'Compte Actif'
    COMPTE_SUSPENDU = 'COMPTE_SUSPENDU', 'Compte Suspendu'
    COMPTE_DESACTIVE = 'COMPTE_DESACTIVE', 'Compte Désactivé'


# Mapping des permissions par rôle
PERMISSIONS_PAR_ROLE = {
    RoleUtilisateur.CITOYEN: [
        Permission.CONSULTER_PROPRE_PROFIL,
        Permission.MODIFIER_PROPRE_PROFIL,
        Permission.CONSULTER_PROPRES_DOCUMENTS,
        Permission.CREER_DENONCIATION,
        Permission.CREER_PLAINTE,
        Permission.CONSULTER_PROPRES_REVENUS,
        Permission.EFFECTUER_TRANSFERT,
    ],
    RoleUtilisateur.AGENT_TERRAIN: [
        # Hérite des permissions citoyen
        Permission.CONSULTER_PROPRE_PROFIL,
        Permission.MODIFIER_PROPRE_PROFIL,
        Permission.CONSULTER_PROPRES_DOCUMENTS,
        Permission.CREER_DENONCIATION,
        Permission.CREER_PLAINTE,
        Permission.CONSULTER_PROPRES_REVENUS,
        Permission.EFFECTUER_TRANSFERT,
        # + Permissions spécifiques agent
        Permission.VERIFIER_IDENTITE,
        Permission.CONSULTER_CITOYEN,
        Permission.CREER_ALERTE,
        Permission.RECEVOIR_ALERTE,
        Permission.CREER_AMENDE,
        Permission.DEMANDER_ARRESTATION,
        Permission.CONSULTER_PROPRES_STATS,
        Permission.METTRE_A_JOUR_POSITION,
        Permission.ACTIVER_DESACTIVER_SERVICE,
    ],
    RoleUtilisateur.AGENT_BRIGADIER: [
        # Hérite des permissions agent terrain (copie directe)
        Permission.CONSULTER_PROPRE_PROFIL,
        Permission.MODIFIER_PROPRE_PROFIL,
        Permission.CONSULTER_PROPRES_DOCUMENTS,
        Permission.CREER_DENONCIATION,
        Permission.CREER_PLAINTE,
        Permission.CONSULTER_PROPRES_REVENUS,
        Permission.EFFECTUER_TRANSFERT,
        Permission.VERIFIER_IDENTITE,
        Permission.CONSULTER_CITOYEN,
        Permission.CREER_ALERTE,
        Permission.RECEVOIR_ALERTE,
        Permission.CREER_AMENDE,
        Permission.DEMANDER_ARRESTATION,
        Permission.CONSULTER_PROPRES_STATS,
        Permission.METTRE_A_JOUR_POSITION,
        Permission.ACTIVER_DESACTIVER_SERVICE,
        # + Permissions chef d'équipe
        Permission.ASSIGNER_MISSION_AGENT,
    ],
    RoleUtilisateur.SUPERVISEUR_BRIGADE: [
        # Hérite des permissions brigadier (copie directe)
        Permission.CONSULTER_PROPRE_PROFIL,
        Permission.MODIFIER_PROPRE_PROFIL,
        Permission.CONSULTER_PROPRES_DOCUMENTS,
        Permission.CREER_DENONCIATION,
        Permission.CREER_PLAINTE,
        Permission.CONSULTER_PROPRES_REVENUS,
        Permission.EFFECTUER_TRANSFERT,
        Permission.VERIFIER_IDENTITE,
        Permission.CONSULTER_CITOYEN,
        Permission.CREER_ALERTE,
        Permission.RECEVOIR_ALERTE,
        Permission.CREER_AMENDE,
        Permission.DEMANDER_ARRESTATION,
        Permission.CONSULTER_PROPRES_STATS,
        Permission.METTRE_A_JOUR_POSITION,
        Permission.ACTIVER_DESACTIVER_SERVICE,
        Permission.ASSIGNER_MISSION_AGENT,
        # + Permissions supervision
        Permission.CONSULTER_AGENTS_BRIGADE,
        Permission.CONSULTER_STATS_AGENTS,
        Permission.CONSULTER_HISTORIQUE_AGENT,
        Permission.RECEVOIR_COMPTE_RENDU,
        Permission.VALIDER_COMPTE_RENDU,
        Permission.MODIFIER_STATUT_AGENT,
    ],
    RoleUtilisateur.CONTROLEUR_REGIONAL: [
        Permission.CONSULTER_BRIGADES_REGION,
        Permission.CONSULTER_STATS_REGION,
        Permission.ASSIGNER_MISSION_BRIGADE,
        Permission.GERER_ALERTES_REGION,
        Permission.CONSULTER_SURVEILLANCE_VIDEO,
        Permission.ANALYSER_DONNEES_IA,
        Permission.CONSULTER_AGENTS_BRIGADE,
        Permission.CONSULTER_HISTORIQUE_AGENT,
    ],
    RoleUtilisateur.CONTROLEUR_NATIONAL: [
        Permission.CONSULTER_TOUTES_REGIONS,
        Permission.CONSULTER_STATS_NATIONALES,
        Permission.GERER_ALERTES_NATIONALES,
        Permission.GENERER_RAPPORTS_NATIONAUX,
        Permission.CONSULTER_SURVEILLANCE_VIDEO,
        Permission.ANALYSER_DONNEES_IA,
    ],
    RoleUtilisateur.ADMIN_SYSTEME: [
        # Toutes les permissions
        Permission.CONSULTER_PROPRE_PROFIL,
        Permission.MODIFIER_PROPRE_PROFIL,
        Permission.CONSULTER_PROPRES_DOCUMENTS,
        Permission.CREER_DENONCIATION,
        Permission.CREER_PLAINTE,
        Permission.CONSULTER_PROPRES_REVENUS,
        Permission.EFFECTUER_TRANSFERT,
        Permission.VERIFIER_IDENTITE,
        Permission.CONSULTER_CITOYEN,
        Permission.CREER_ALERTE,
        Permission.RECEVOIR_ALERTE,
        Permission.CREER_AMENDE,
        Permission.DEMANDER_ARRESTATION,
        Permission.CONSULTER_PROPRES_STATS,
        Permission.METTRE_A_JOUR_POSITION,
        Permission.ACTIVER_DESACTIVER_SERVICE,
        Permission.ASSIGNER_MISSION_AGENT,
        Permission.CONSULTER_AGENTS_BRIGADE,
        Permission.CONSULTER_STATS_AGENTS,
        Permission.CONSULTER_HISTORIQUE_AGENT,
        Permission.RECEVOIR_COMPTE_RENDU,
        Permission.VALIDER_COMPTE_RENDU,
        Permission.MODIFIER_STATUT_AGENT,
        Permission.CONSULTER_BRIGADES_REGION,
        Permission.CONSULTER_STATS_REGION,
        Permission.ASSIGNER_MISSION_BRIGADE,
        Permission.GERER_ALERTES_REGION,
        Permission.CONSULTER_SURVEILLANCE_VIDEO,
        Permission.ANALYSER_DONNEES_IA,
        Permission.CONSULTER_TOUTES_REGIONS,
        Permission.CONSULTER_STATS_NATIONALES,
        Permission.GERER_ALERTES_NATIONALES,
        Permission.GENERER_RAPPORTS_NATIONAUX,
        Permission.GERER_UTILISATEURS,
        Permission.GERER_ROLES,
        Permission.GERER_PERMISSIONS,
        Permission.GERER_BRIGADES,
        Permission.CONSULTER_AUDIT,
        Permission.CONFIGURER_SYSTEME,
    ],
    RoleUtilisateur.ADMIN_FONCTIONNEL: [
        Permission.GERER_UTILISATEURS,
        Permission.GERER_BRIGADES,
        Permission.CONSULTER_AUDIT,
        Permission.CONSULTER_TOUTES_REGIONS,
        Permission.CONSULTER_STATS_NATIONALES,
    ],
}

