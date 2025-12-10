"""
Configuration de l'administration Django pour les modèles
"""
from django.contrib import admin
from .models import (
    # Modèles citoyen
    Citoyen, Adresse, Contact, InfoParentale, Conjoint, Enfant,
    Biometrie, EmpreinteDigitale, PhotoIdentite, Signature,
    ReconnaissanceFaciale, Iris, InfoMedicale,
    # Modèles organismes
    Organisme, EcoleFormation, CodeOfficiel,
    # Modèles agents
    Agent, Mission,
    # Modèles véhicules
    Vehicule, PhotoVehicule, PlaqueImmatriculation,
    AssuranceVehicule, GarantieAssurance, PaiementAssurance,
    VisiteTechnique, PointsControleVisiteTechnique,
    GageVehicule, EcheanceGage, GarantieGage,
    TrackingGPS, ZoneGPS, HistoriqueAlerteGPS,
    # Modèles authentification
    Utilisateur, Brigade, CompteRendu, HistoriqueAgent
)


@admin.register(Adresse)
class AdresseAdmin(admin.ModelAdmin):
    list_display = ('quartier', 'commune', 'region', 'pays')
    search_fields = ('quartier', 'commune', 'region')
    list_filter = ('region', 'departement')


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('telephone_principal', 'email', 'contact_urgence_nom')
    search_fields = ('telephone_principal', 'email')


@admin.register(InfoParentale)
class InfoParentaleAdmin(admin.ModelAdmin):
    list_display = ('nom_pere', 'prenom_pere', 'nom_mere', 'prenom_mere')
    search_fields = ('nom_pere', 'nom_mere')


@admin.register(Conjoint)
class ConjointAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'date_naissance', 'numero_cni')
    search_fields = ('nom', 'prenom', 'numero_cni')


@admin.register(Enfant)
class EnfantAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'date_naissance', 'genre')
    search_fields = ('nom', 'prenom')
    list_filter = ('genre',)


@admin.register(EmpreinteDigitale)
class EmpreinteDigitaleAdmin(admin.ModelAdmin):
    list_display = ('doigt', 'format', 'qualite', 'date_capture')
    list_filter = ('format', 'doigt')
    search_fields = ('dispositif_capture',)


@admin.register(PhotoIdentite)
class PhotoIdentiteAdmin(admin.ModelAdmin):
    list_display = ('format', 'resolution', 'date_capture', 'conforme_iso')
    list_filter = ('format', 'conforme_iso')


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ('format', 'type_capture', 'date_capture')
    list_filter = ('format', 'type_capture')


@admin.register(ReconnaissanceFaciale)
class ReconnaissanceFacialeAdmin(admin.ModelAdmin):
    list_display = ('algorithme', 'version', 'qualite_image', 'date_capture')
    list_filter = ('algorithme',)


@admin.register(Iris)
class IrisAdmin(admin.ModelAdmin):
    list_display = ('oeil', 'format', 'qualite', 'date_capture')
    list_filter = ('oeil', 'format')


@admin.register(Biometrie)
class BiometrieAdmin(admin.ModelAdmin):
    list_display = ('date_enrolement', 'conforme_ancec', 'numero_enrolement_ancec')
    search_fields = ('numero_enrolement_ancec', 'lieu_capture')
    list_filter = ('conforme_ancec',)


@admin.register(InfoMedicale)
class InfoMedicaleAdmin(admin.ModelAdmin):
    list_display = ('groupe_sanguin', 'donneur_organes')
    list_filter = ('groupe_sanguin', 'donneur_organes')


class EnfantInline(admin.TabularInline):
    model = Enfant
    extra = 0
    fields = ('nom', 'prenom', 'date_naissance', 'genre', 'numero_cni')


@admin.register(Citoyen)
class CitoyenAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'numero_cni', 'genre', 'statut', 'date_naissance')
    list_filter = ('statut', 'genre', 'situation_matrimoniale', 'nationalite', 'region_naissance')
    search_fields = ('nom', 'prenom', 'numero_cni', 'numero_securite_sociale')
    readonly_fields = ('id', 'date_creation', 'date_modification', 'date_derniere_mise_a_jour')
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('numero_cni', 'nom', 'prenom', 'nom_jeune_fille', 'autres_prenoms',
                      'date_naissance', 'lieu_naissance', 'commune_naissance',
                      'departement_naissance', 'region_naissance', 'pays_naissance')
        }),
        ('Identité', {
            'fields': ('genre', 'nationalite', 'nationalite_origine', 'situation_matrimoniale')
        }),
        ('Profession', {
            'fields': ('profession', 'profession_details', 'employeur', 'numero_securite_sociale')
        }),
        ('Adresse et Contact', {
            'fields': ('adresse_actuelle', 'adresse_originale', 'contact')
        }),
        ('Famille', {
            'fields': ('info_parentale', 'nombre_enfants')
        }),
        ('Biométrie', {
            'fields': ('biometrie',)
        }),
        ('Médical', {
            'fields': ('info_medicale',)
        }),
        ('Statut', {
            'fields': ('statut', 'verification_identite_verifie', 'verification_identite_date',
                      'verification_identite_verifiee_par', 'verification_identite_methode')
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification', 'date_derniere_mise_a_jour',
                      'cree_par', 'modifie_par', 'notes', 'drapeaux')
        }),
    )
    
    inlines = [EnfantInline]


# ==================== ADMIN ORGANISMES ====================

@admin.register(Organisme)
class OrganismeAdmin(admin.ModelAdmin):
    list_display = ('sigle', 'nom', 'ministere', 'actif')
    search_fields = ('nom', 'sigle', 'ministere')
    list_filter = ('actif', 'ministere')
    fieldsets = (
        ('Informations de base', {
            'fields': ('nom', 'sigle', 'ministere', 'role')
        }),
        ('Contact', {
            'fields': ('telephone', 'email', 'site_web', 'adresse')
        }),
        ('Détails', {
            'fields': ('commandement', 'services', 'ecoles')
        }),
        ('Statut', {
            'fields': ('actif',)
        }),
    )


@admin.register(EcoleFormation)
class EcoleFormationAdmin(admin.ModelAdmin):
    list_display = ('nom', 'sigle', 'lieu', 'type_formation', 'organisme')
    search_fields = ('nom', 'sigle', 'lieu')
    list_filter = ('actif', 'organisme')
    fieldsets = (
        ('Informations', {
            'fields': ('nom', 'sigle', 'lieu', 'type_formation', 'organisme')
        }),
        ('Formation', {
            'fields': ('duree_formation', 'admission')
        }),
        ('Statut', {
            'fields': ('actif',)
        }),
    )


@admin.register(CodeOfficiel)
class CodeOfficielAdmin(admin.ModelAdmin):
    list_display = ('type_code', 'format_pattern', 'exemple')
    search_fields = ('type_code', 'format_pattern')
    list_filter = ('type_code',)


# ==================== ADMIN AGENTS ====================

class MissionInline(admin.TabularInline):
    model = Mission
    extra = 0
    fields = ('titre', 'statut', 'date_debut', 'date_fin')
    readonly_fields = ('date_creation',)


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('matricule', 'type_force', 'grade_police', 'grade_gendarmerie', 'grade_pompiers', 'statut', 'unite_affectation')
    search_fields = ('matricule', 'unite_affectation', 'poste')
    list_filter = ('type_force', 'statut', 'ecole_formation')
    readonly_fields = ('niveau_hierarchique', 'categorie_grade', 'date_creation', 'date_modification')
    
    fieldsets = (
        ('Identification', {
            'fields': ('citoyen', 'matricule', 'type_force')
        }),
        ('Grade', {
            'fields': ('grade_police', 'grade_gendarmerie', 'grade_pompiers', 'niveau_hierarchique', 'categorie_grade')
        }),
        ('Affectation', {
            'fields': ('unite_affectation', 'poste', 'date_entree_service', 'date_nomination_grade')
        }),
        ('Formation', {
            'fields': ('ecole_formation', 'annee_formation', 'promotion')
        }),
        ('Compétences', {
            'fields': ('specialites', 'competences')
        }),
        ('Statut', {
            'fields': ('statut',)
        }),
        ('Position', {
            'fields': ('position_latitude', 'position_longitude', 'position_timestamp')
        }),
        ('Statistiques', {
            'fields': ('verifications_effectuees', 'alertes_creees', 'arrestations', 'missions_completes')
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification', 'cree_par', 'modifie_par')
        }),
    )
    
    inlines = [MissionInline]
    
    def niveau_hierarchique(self, obj):
        return obj.niveau_hierarchique
    niveau_hierarchique.short_description = 'Niveau hiérarchique'
    
    def categorie_grade(self, obj):
        return obj.categorie_grade
    categorie_grade.short_description = 'Catégorie'


@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ('titre', 'agent', 'statut', 'date_debut', 'date_fin')
    search_fields = ('titre', 'description', 'lieu')
    list_filter = ('statut', 'date_debut')
    date_hierarchy = 'date_debut'
    
    fieldsets = (
        ('Informations', {
            'fields': ('titre', 'description', 'agent')
        }),
        ('Dates', {
            'fields': ('date_debut', 'date_fin')
        }),
        ('Localisation', {
            'fields': ('lieu', 'latitude', 'longitude')
        }),
        ('Statut', {
            'fields': ('statut',)
        }),
        ('Résultats', {
            'fields': ('resultat', 'notes')
        }),
    )


# ==================== ADMIN VÉHICULES ====================

# ============================================
# Admin pour les Véhicules
# ============================================

@admin.register(PhotoVehicule)
class PhotoVehiculeAdmin(admin.ModelAdmin):
    list_display = ('type', 'vehicule', 'date_capture', 'lieu_capture')
    list_filter = ('type', 'date_capture')
    search_fields = ('vehicule__matricule', 'description', 'lieu_capture')
    readonly_fields = ('id', 'date_creation')


@admin.register(PlaqueImmatriculation)
class PlaqueImmatriculationAdmin(admin.ModelAdmin):
    list_display = ('matricule', 'vehicule', 'region_code', 'date_attribution', 'actif')
    list_filter = ('actif', 'region_code', 'date_attribution')
    search_fields = ('matricule', 'vehicule__matricule')
    readonly_fields = ('id', 'date_creation')


@admin.register(GarantieAssurance)
class GarantieAssuranceAdmin(admin.ModelAdmin):
    list_display = ('type', 'assurance', 'plafond', 'franchise')
    list_filter = ('assurance__compagnie',)
    search_fields = ('type', 'assurance__numero_police')


@admin.register(PaiementAssurance)
class PaiementAssuranceAdmin(admin.ModelAdmin):
    list_display = ('assurance', 'date', 'montant', 'mode_paiement', 'reference_paiement')
    list_filter = ('mode_paiement', 'date')
    search_fields = ('assurance__numero_police', 'reference_paiement')
    readonly_fields = ('id', 'date_creation')


@admin.register(AssuranceVehicule)
class AssuranceVehiculeAdmin(admin.ModelAdmin):
    list_display = ('compagnie', 'numero_police', 'vehicule', 'type_assurance', 'statut', 'date_debut', 'date_fin')
    list_filter = ('statut', 'type_assurance', 'compagnie', 'date_debut', 'date_fin')
    search_fields = ('numero_police', 'numero_attestation', 'vehicule__matricule', 'compagnie')
    readonly_fields = ('id', 'date_creation', 'date_modification')
    fieldsets = (
        ('Informations générales', {
            'fields': ('vehicule', 'compagnie', 'numero_police', 'numero_attestation', 'type_assurance', 'statut')
        }),
        ('Période', {
            'fields': ('date_debut', 'date_fin', 'duree_jours', 'auto_renouvellement', 'prochain_renouvellement')
        }),
        ('Montants (FCFA)', {
            'fields': ('montant_prime', 'montant_accessoires', 'montant_total')
        }),
        ('Assuré', {
            'fields': ('assure_nom', 'assure_prenom', 'assure_numero_identification', 'assure_telephone')
        }),
        ('Documents', {
            'fields': ('attestation_url', 'police_url', 'carte_verte_url')
        }),
        ('Sinistres', {
            'fields': ('nombre_sinistres', 'montant_sinistres')
        }),
        ('Contact Compagnie', {
            'fields': ('contact_compagnie_telephone', 'contact_compagnie_email', 'contact_compagnie_agence', 'contact_compagnie_hotline')
        }),
        ('DTT', {
            'fields': ('declaree_au_dtt', 'date_declaration_dtt')
        }),
    )


@admin.register(PointsControleVisiteTechnique)
class PointsControleVisiteTechniqueAdmin(admin.ModelAdmin):
    list_display = ('type_controle', 'visite_technique', 'conformite')
    list_filter = ('type_controle', 'conformite')
    search_fields = ('type_controle', 'visite_technique__numero_visite', 'observations')


@admin.register(VisiteTechnique)
class VisiteTechniqueAdmin(admin.ModelAdmin):
    list_display = ('numero_visite', 'vehicule', 'centre_controle', 'resultat', 'statut', 'date_visite', 'date_expiration')
    list_filter = ('resultat', 'statut', 'region_centre', 'date_visite')
    search_fields = ('numero_visite', 'numero_proces_verbal', 'vehicule__matricule', 'centre_controle')
    readonly_fields = ('id', 'date_creation', 'date_modification')
    fieldsets = (
        ('Informations générales', {
            'fields': ('vehicule', 'numero_visite', 'numero_proces_verbal', 'resultat', 'statut')
        }),
        ('Dates', {
            'fields': ('date_visite', 'date_expiration', 'prochain_controle', 'date_resultat')
        }),
        ('Centre de Contrôle', {
            'fields': ('centre_controle', 'numero_agrement', 'adresse_centre', 'telephone_centre', 'region_centre')
        }),
        ('Contrôleur', {
            'fields': ('controleur_nom', 'controleur_prenom', 'controleur_numero_agrement', 'controleur_signature_url')
        }),
        ('Kilométrage', {
            'fields': ('kilometrage',)
        }),
        ('Défauts', {
            'fields': ('defauts_constates',)
        }),
        ('Documents', {
            'fields': ('document_url', 'vignette_url')
        }),
        ('DTT', {
            'fields': ('enregistre_au_dtt', 'date_enregistrement_dtt', 'numero_enregistrement_dtt')
        }),
    )


@admin.register(EcheanceGage)
class EcheanceGageAdmin(admin.ModelAdmin):
    list_display = ('gage', 'numero', 'date_echeance', 'montant', 'statut', 'date_paiement')
    list_filter = ('statut', 'date_echeance')
    search_fields = ('gage__numero_contrat', 'reference_paiement')
    readonly_fields = ('id', 'date_creation')
    ordering = ['gage', 'numero']


@admin.register(GarantieGage)
class GarantieGageAdmin(admin.ModelAdmin):
    list_display = ('type', 'gage', 'montant')
    search_fields = ('type', 'gage__numero_contrat', 'description')


@admin.register(GageVehicule)
class GageVehiculeAdmin(admin.ModelAdmin):
    list_display = ('organisme', 'numero_contrat', 'vehicule', 'statut', 'montant_finance', 'date_debut', 'date_fin')
    list_filter = ('statut', 'type_organisme', 'date_debut', 'date_fin')
    search_fields = ('numero_contrat', 'vehicule__matricule', 'organisme')
    readonly_fields = ('id', 'date_creation', 'date_modification')
    fieldsets = (
        ('Informations générales', {
            'fields': ('vehicule', 'organisme', 'type_organisme', 'numero_contrat', 'statut', 'date_statut')
        }),
        ('Montants (FCFA)', {
            'fields': ('montant_finance', 'apport_personnel', 'montant_mensualite', 'nombre_mensualites', 'montant_restant_du')
        }),
        ('Taux', {
            'fields': ('taux_interet', 'taux_assurance')
        }),
        ('Dates', {
            'fields': ('date_debut', 'date_fin', 'date_premiere_echeance', 'date_derniere_echeance')
        }),
        ('Restrictions', {
            'fields': ('restriction_vente', 'restriction_export', 'assurance_obligatoire')
        }),
        ('Inscription Registre', {
            'fields': ('inscrit_registre_gages', 'date_inscription', 'numero_inscription')
        }),
        ('Contact Organisme', {
            'fields': ('contact_organisme_telephone', 'contact_organisme_email', 'contact_organisme_agence',
                      'contact_conseiller_nom', 'contact_conseiller_telephone', 'contact_conseiller_email')
        }),
        ('Documents', {
            'fields': ('contrat_url', 'tableau_amortissement_url')
        }),
    )


@admin.register(ZoneGPS)
class ZoneGPSAdmin(admin.ModelAdmin):
    list_display = ('nom', 'tracking', 'type', 'alerte_entree', 'alerte_sortie')
    list_filter = ('type', 'alerte_entree', 'alerte_sortie')
    search_fields = ('nom', 'tracking__vehicule__matricule')
    readonly_fields = ('id', 'date_creation')


@admin.register(HistoriqueAlerteGPS)
class HistoriqueAlerteGPSAdmin(admin.ModelAdmin):
    list_display = ('tracking', 'type', 'date', 'traite', 'description')
    list_filter = ('type', 'traite', 'date')
    search_fields = ('tracking__vehicule__matricule', 'description')
    readonly_fields = ('id', 'date_creation')
    ordering = ['-date']


@admin.register(TrackingGPS)
class TrackingGPSAdmin(admin.ModelAdmin):
    list_display = ('vehicule', 'dispositif_marque', 'dispositif_modele', 'statut_dispositif', 'dernier_signal', 'niveau_batterie')
    list_filter = ('statut_dispositif', 'dispositif_marque', 'abonnement_statut')
    search_fields = ('vehicule__matricule', 'dispositif_imei', 'dispositif_numero_serie', 'fournisseur_nom')
    readonly_fields = ('id', 'date_creation', 'date_modification')
    fieldsets = (
        ('Véhicule', {
            'fields': ('vehicule',)
        }),
        ('Dispositif', {
            'fields': ('dispositif_marque', 'dispositif_modele', 'dispositif_numero_serie', 'dispositif_imei',
                      'dispositif_numero_carte_sim', 'dispositif_operateur_mobile', 'date_installation',
                      'installe_par', 'emplacement_vehicule')
        }),
        ('Fournisseur', {
            'fields': ('fournisseur_nom', 'fournisseur_contact', 'fournisseur_email', 'fournisseur_url_plateforme')
        }),
        ('Abonnement', {
            'fields': ('abonnement_type', 'abonnement_montant', 'abonnement_date_debut', 'abonnement_date_fin',
                      'abonnement_statut', 'abonnement_auto_renouvellement')
        }),
        ('Position Actuelle', {
            'fields': ('position_actuelle_latitude', 'position_actuelle_longitude', 'position_actuelle_altitude',
                      'position_actuelle_precision', 'position_actuelle_vitesse', 'position_actuelle_direction',
                      'position_actuelle_date', 'position_actuelle_adresse', 'position_actuelle_en_mouvement',
                      'position_actuelle_moteur_allume')
        }),
        ('Statistiques', {
            'fields': ('statistiques_kilometres_parcourus', 'statistiques_temps_moteur_allume',
                      'statistiques_nombre_alertes', 'statistiques_derniere_connexion')
        }),
        ('État', {
            'fields': ('statut_dispositif', 'dernier_signal', 'niveau_batterie')
        }),
        ('Anti-vol', {
            'fields': ('antivol_active', 'antivol_immobilisation_moteur', 'antivol_derniere_immobilisation')
        }),
        ('Alertes', {
            'fields': ('alertes_config',)
        }),
    )


@admin.register(Vehicule)
class VehiculeAdmin(admin.ModelAdmin):
    list_display = ('matricule', 'marque', 'modele', 'annee_fabrication', 'couleur_principale', 'statut', 'proprietaire_nom_complet')
    search_fields = ('matricule', 'numero_carte_grise', 'numero_serie', 'marque', 'modele', 'proprietaire__nom', 'proprietaire__prenom')
    list_filter = ('statut', 'type_vehicule', 'marque', 'carburant', 'usage', 'localisation_region')
    readonly_fields = ('id', 'date_creation', 'date_modification', 'assurance_actuelle', 'visite_technique_actuelle', 'gage_actuel', 'plaque_actuelle')
    raw_id_fields = ('proprietaire',)
    
    fieldsets = (
        ('Immatriculation', {
            'fields': ('matricule', 'numero_carte_grise', 'date_immatriculation')
        }),
        ('Type et Usage', {
            'fields': ('type_vehicule', 'usage')
        }),
        ('Identification', {
            'fields': ('marque', 'modele', 'version', 'annee_modele', 'annee_fabrication', 'numero_serie', 'numero_moteur')
        }),
        ('Apparence', {
            'fields': ('couleur_principale', 'nombre_couleurs', 'signes_distinctifs')
        }),
        ('Caractéristiques', {
            'fields': ('carburant', 'caracteristiques')
        }),
        ('Propriétaire', {
            'fields': ('proprietaire', 'proprietaire_type', 'proprietaire_nom', 'proprietaire_prenom',
                      'proprietaire_numero_identification', 'proprietaire_adresse', 'proprietaire_telephone',
                      'proprietaire_email', 'date_acquisition', 'mode_acquisition', 'prix_achat')
        }),
        ('Carte Grise', {
            'fields': ('carte_grise_numero', 'carte_grise_date_emission', 'carte_grise_document_url')
        }),
        ('Entretien', {
            'fields': ('dernier_entretien', 'kilometrage_actuel')
        }),
        ('Infractions et Sinistres', {
            'fields': ('nombre_infractions', 'infractions_ids', 'sinistres_ids')
        }),
        ('Statut', {
            'fields': ('statut', 'date_statut')
        }),
        ('Localisation', {
            'fields': ('localisation_region', 'localisation_departement', 'localisation_commune',
                      'localisation_adresse', 'localisation_coordonnees_gps', 'localisation_date')
        }),
        ('Équipements', {
            'fields': ('equipements_speciaux',)
        }),
        ('Relations', {
            'fields': ('assurance_actuelle', 'visite_technique_actuelle', 'gage_actuel', 'plaque_actuelle')
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification', 'cree_par', 'modifie_par')
        }),
    )
    
    def proprietaire_nom_complet(self, obj):
        if obj.proprietaire:
            return f"{obj.proprietaire.nom} {obj.proprietaire.prenom}"
        elif obj.proprietaire_nom:
            return f"{obj.proprietaire_nom} {obj.proprietaire_prenom or ''}".strip()
        return "N/A"
    proprietaire_nom_complet.short_description = "Propriétaire"


# ============================================
# Administration - Authentification
# ============================================

@admin.register(Utilisateur)
class UtilisateurAdmin(admin.ModelAdmin):
    list_display = ('numero_identification_unique', 'nom', 'prenom', 'numero_cni', 'telephone', 'email', 'statut_inscription', 'display_roles', 'compte_verrouille')
    list_filter = ('statut_inscription', 'compte_verrouille', 'deux_facteurs_actif', 'date_creation')
    search_fields = ('numero_identification_unique', 'numero_cni', 'nom', 'prenom', 'telephone', 'email')
    readonly_fields = ('id', 'date_creation', 'date_modification', 'derniere_connexion', 'dernier_changement_mot_de_passe', 'date_verrouillage')
    
    fieldsets = (
        ('Identification', {
            'fields': ('numero_identification_unique', 'citoyen_id', 'numero_cni', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'genre')
        }),
        ('Contact & Authentification', {
            'fields': ('telephone', 'telephone_verifie', 'email', 'email_verifie', 'mot_de_passe_hash')
        }),
        ('Rôles & Permissions', {
            'fields': ('roles', 'roles_historique')
        }),
        ('Statut Inscription', {
            'fields': ('statut_inscription', 'date_inscription', 'date_activation', 'etapes_inscription')
        }),
        ('Biométrie', {
            'fields': ('biometrie',)
        }),
        ('Informations Spécifiques', {
            'fields': ('info_agent', 'info_controleur')
        }),
        ('Sécurité', {
            'fields': ('derniere_connexion', 'dernier_changement_mot_de_passe', 'tentatives_connexion_echouees', 'compte_verrouille', 'date_verrouillage', 'deux_facteurs_actif', 'methode_deux_facteurs')
        }),
        ('Préférences', {
            'fields': ('preferences',)
        }),
        ('Audit', {
            'fields': ('date_creation', 'date_modification', 'cree_par', 'modifie_par')
        }),
        ('Tokens de Session', {
            'fields': ('refresh_token', 'refresh_token_expiration')
        }),
    )
    
    def display_roles(self, obj):
        return ", ".join(obj.roles) if obj.roles else "Aucun"
    display_roles.short_description = 'Rôles'


@admin.register(Brigade)
class BrigadeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code', 'type_force', 'region', 'superviseur_nom', 'nombre_agents', 'statut')
    list_filter = ('type_force', 'region', 'statut')
    search_fields = ('nom', 'code', 'superviseur_nom', 'superviseur_prenom')
    readonly_fields = ('id', 'date_creation', 'date_modification')


@admin.register(CompteRendu)
class CompteRenduAdmin(admin.ModelAdmin):
    list_display = ('numero_reference', 'agent', 'destinataire_nom', 'type', 'statut', 'date_envoi')
    list_filter = ('type', 'statut', 'date_envoi')
    search_fields = ('numero_reference', 'agent__matricule', 'destinataire_nom', 'titre')
    readonly_fields = ('id', 'numero_reference', 'date_creation', 'date_modification', 'date_envoi')
    date_hierarchy = 'date_envoi'


@admin.register(HistoriqueAgent)
class HistoriqueAgentAdmin(admin.ModelAdmin):
    list_display = ('agent', 'date_creation', 'date_modification')
    search_fields = ('agent__matricule', 'agent__nom', 'agent__prenom')
    readonly_fields = ('id', 'date_creation', 'date_modification')

