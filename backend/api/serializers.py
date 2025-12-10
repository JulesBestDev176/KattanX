from rest_framework import serializers
from .models import (
    Citoyen, Adresse, Contact, InfoParentale, Conjoint, Enfant,
    Biometrie, EmpreinteDigitale, PhotoIdentite, Signature,
    ReconnaissanceFaciale, Iris, InfoMedicale,
    # Véhicules
    Vehicule, PhotoVehicule, PlaqueImmatriculation,
    AssuranceVehicule, GarantieAssurance, PaiementAssurance,
    VisiteTechnique, PointsControleVisiteTechnique,
    GageVehicule, EcheanceGage, GarantieGage,
    TrackingGPS, ZoneGPS, HistoriqueAlerteGPS,
    # Authentification
    Utilisateur, Brigade, CompteRendu, HistoriqueAgent,
    # Services citoyens
    Document, Denonciation, Plainte, Transaction, Revenu, AlerteUrgence
)
from .models.enums import RoleUtilisateur


class AdresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adresse
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class InfoParentaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoParentale
        fields = '__all__'


class ConjointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conjoint
        fields = '__all__'


class EnfantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enfant
        fields = '__all__'


class EmpreinteDigitaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpreinteDigitale
        fields = '__all__'


class PhotoIdentiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoIdentite
        fields = '__all__'


class SignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signature
        fields = '__all__'


class ReconnaissanceFacialeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReconnaissanceFaciale
        fields = '__all__'


class IrisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Iris
        fields = '__all__'


class BiometrieSerializer(serializers.ModelSerializer):
    photo_identite = PhotoIdentiteSerializer(read_only=True)
    signature = SignatureSerializer(read_only=True)
    reconnaissance_faciale = ReconnaissanceFacialeSerializer(read_only=True)
    
    class Meta:
        model = Biometrie
        fields = '__all__'


class InfoMedicaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoMedicale
        fields = '__all__'


class CitoyenSerializer(serializers.ModelSerializer):
    """Sérialiseur principal pour Citoyen avec relations imbriquées"""
    adresse_actuelle = AdresseSerializer(read_only=True)
    adresse_originale = AdresseSerializer(read_only=True)
    contact = ContactSerializer(read_only=True)
    info_parentale = InfoParentaleSerializer(read_only=True)
    biometrie = BiometrieSerializer(read_only=True)
    info_medicale = InfoMedicaleSerializer(read_only=True)
    enfants = EnfantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Citoyen
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification', 'date_derniere_mise_a_jour')


class CitoyenCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour créer un citoyen avec relations"""
    adresse_actuelle = AdresseSerializer()
    adresse_originale = AdresseSerializer(required=False, allow_null=True)
    contact = ContactSerializer()
    info_parentale = InfoParentaleSerializer(required=False, allow_null=True)
    info_medicale = InfoMedicaleSerializer(required=False, allow_null=True)
    enfants = EnfantSerializer(many=True, required=False)
    
    class Meta:
        model = Citoyen
        exclude = ('biometrie',)  # La biométrie sera créée séparément
    
    def create(self, validated_data):
        # Extraire les données des relations
        adresse_actuelle_data = validated_data.pop('adresse_actuelle')
        contact_data = validated_data.pop('contact')
        adresse_originale_data = validated_data.pop('adresse_originale', None)
        info_parentale_data = validated_data.pop('info_parentale', None)
        info_medicale_data = validated_data.pop('info_medicale', None)
        enfants_data = validated_data.pop('enfants', [])
        
        # Créer les objets liés
        adresse_actuelle = Adresse.objects.create(**adresse_actuelle_data)
        contact = Contact.objects.create(**contact_data)
        
        adresse_originale = None
        if adresse_originale_data:
            adresse_originale = Adresse.objects.create(**adresse_originale_data)
        
        info_parentale = None
        if info_parentale_data:
            info_parentale = InfoParentale.objects.create(**info_parentale_data)
        
        info_medicale = None
        if info_medicale_data:
            info_medicale = InfoMedicale.objects.create(**info_medicale_data)
        
        # Créer le citoyen
        citoyen = Citoyen.objects.create(
            adresse_actuelle=adresse_actuelle,
            adresse_originale=adresse_originale,
            contact=contact,
            info_parentale=info_parentale,
            info_medicale=info_medicale,
            **validated_data
        )
        
        # Créer les enfants
        for enfant_data in enfants_data:
            Enfant.objects.create(citoyen=citoyen, **enfant_data)
        
        return citoyen


class PrestationSerializer(serializers.Serializer):
    """Serializer for prestation messages"""
    messageType = serializers.CharField(max_length=100)
    organismId = serializers.CharField(max_length=50)
    organismName = serializers.CharField(max_length=200)
    action = serializers.CharField(max_length=50)
    data = serializers.DictField()
    origin = serializers.CharField(max_length=100, required=False)
    claims = serializers.DictField(required=False)


# ============================================
# Serializers pour les Véhicules
# ============================================

class PhotoVehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoVehicule
        fields = '__all__'


class PlaqueImmatriculationSerializer(serializers.ModelSerializer):
    photo_plaque = PhotoVehiculeSerializer(read_only=True)
    
    class Meta:
        model = PlaqueImmatriculation
        fields = '__all__'


class GarantieAssuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarantieAssurance
        fields = '__all__'


class PaiementAssuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementAssurance
        fields = '__all__'


class AssuranceVehiculeSerializer(serializers.ModelSerializer):
    garanties = GarantieAssuranceSerializer(many=True, read_only=True)
    paiements = PaiementAssuranceSerializer(many=True, read_only=True)
    
    class Meta:
        model = AssuranceVehicule
        fields = '__all__'


class PointsControleVisiteTechniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsControleVisiteTechnique
        fields = '__all__'


class VisiteTechniqueSerializer(serializers.ModelSerializer):
    points_controle = PointsControleVisiteTechniqueSerializer(many=True, read_only=True)
    
    class Meta:
        model = VisiteTechnique
        fields = '__all__'


class EcheanceGageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcheanceGage
        fields = '__all__'


class GarantieGageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarantieGage
        fields = '__all__'


class GageVehiculeSerializer(serializers.ModelSerializer):
    echeances = EcheanceGageSerializer(many=True, read_only=True)
    garanties = GarantieGageSerializer(many=True, read_only=True)
    
    class Meta:
        model = GageVehicule
        fields = '__all__'


class ZoneGPSSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoneGPS
        fields = '__all__'


class HistoriqueAlerteGPSSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueAlerteGPS
        fields = '__all__'


class TrackingGPSSerializer(serializers.ModelSerializer):
    zones = ZoneGPSSerializer(many=True, read_only=True)
    historique_alertes = HistoriqueAlerteGPSSerializer(many=True, read_only=True)
    
    class Meta:
        model = TrackingGPS
        fields = '__all__'


class VehiculeSerializer(serializers.ModelSerializer):
    """Sérialiseur principal pour Véhicule avec relations imbriquées"""
    photos = PhotoVehiculeSerializer(many=True, read_only=True)
    plaques = PlaqueImmatriculationSerializer(many=True, read_only=True)
    assurances = AssuranceVehiculeSerializer(many=True, read_only=True)
    visites_techniques = VisiteTechniqueSerializer(many=True, read_only=True)
    gages = GageVehiculeSerializer(many=True, read_only=True)
    tracking_gps = TrackingGPSSerializer(read_only=True)
    proprietaire_nom_complet = serializers.SerializerMethodField()
    assurance_actuelle = serializers.SerializerMethodField()
    visite_technique_actuelle = serializers.SerializerMethodField()
    gage_actuel = serializers.SerializerMethodField()
    plaque_actuelle = serializers.SerializerMethodField()
    
    class Meta:
        model = Vehicule
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')
    
    def get_proprietaire_nom_complet(self, obj):
        if obj.proprietaire:
            return f"{obj.proprietaire.nom} {obj.proprietaire.prenom}"
        elif obj.proprietaire_nom:
            return f"{obj.proprietaire_nom} {obj.proprietaire_prenom or ''}".strip()
        return None
    
    def get_assurance_actuelle(self, obj):
        assurance = obj.assurance_actuelle
        if assurance:
            return AssuranceVehiculeSerializer(assurance).data
        return None
    
    def get_visite_technique_actuelle(self, obj):
        visite = obj.visite_technique_actuelle
        if visite:
            return VisiteTechniqueSerializer(visite).data
        return None
    
    def get_gage_actuel(self, obj):
        gage = obj.gage_actuel
        if gage:
            return GageVehiculeSerializer(gage).data
        return None
    
    def get_plaque_actuelle(self, obj):
        plaque = obj.plaque_actuelle
        if plaque:
            return PlaqueImmatriculationSerializer(plaque).data
        return None


# ============================================
# Serializers pour l'authentification
# ============================================

class BrigadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brigade
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')


class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer pour Utilisateur (lecture)"""
    roles = serializers.ListField(
        child=serializers.ChoiceField(choices=[(r.value, r.label) for r in RoleUtilisateur]),
        required=False
    )
    
    class Meta:
        model = Utilisateur
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification', 'numero_identification_unique')
        extra_kwargs = {
            'mot_de_passe_hash': {'write_only': True}
        }


class UtilisateurCreateSerializer(serializers.ModelSerializer):
    """Serializer pour création d'utilisateur (avec mot de passe en clair)"""
    mot_de_passe = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Utilisateur
        fields = (
            'nom', 'prenom', 'numero_cni', 'date_naissance', 'lieu_naissance', 'genre',
            'telephone', 'email', 'mot_de_passe', 'roles'
        )
    
    def create(self, validated_data):
        mot_de_passe = validated_data.pop('mot_de_passe')
        utilisateur = Utilisateur.objects.create(**validated_data)
        utilisateur.set_password(mot_de_passe)
        utilisateur.save()
        return utilisateur


class InscriptionEtape1Serializer(serializers.Serializer):
    """Serializer pour l'étape 1 d'inscription"""
    nom = serializers.CharField(max_length=100)
    prenom = serializers.CharField(max_length=100)
    numero_cni = serializers.CharField(max_length=13, min_length=13)
    date_naissance = serializers.DateField()
    lieu_naissance = serializers.CharField(max_length=100)
    matricule = serializers.CharField(max_length=20, required=False)  # Pour les agents


class InscriptionEtape2Serializer(serializers.Serializer):
    """Serializer pour l'étape 2 d'inscription"""
    telephone = serializers.CharField(max_length=15)
    email = serializers.EmailField(required=False)
    mot_de_passe = serializers.CharField(min_length=8, write_only=True)
    confirmation_mot_de_passe = serializers.CharField(min_length=8, write_only=True)
    code_otp = serializers.CharField(max_length=6, min_length=6)
    
    def validate(self, data):
        if data['mot_de_passe'] != data['confirmation_mot_de_passe']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data


class InscriptionEtape3Serializer(serializers.Serializer):
    """Serializer pour l'étape 3 d'inscription (biométrie)"""
    session_id = serializers.CharField(required=False)
    photo_id = serializers.CharField(required=False)
    photo_url = serializers.CharField(required=False)
    empreinte_id = serializers.CharField(required=False)
    
    # Champs optionnels pour compatibilité
    photo_base64 = serializers.CharField(required=False)
    photo_uri = serializers.CharField(required=False)
    empreinte_doigt = serializers.CharField(required=False)
    empreinte_template = serializers.CharField(required=False)
    empreinte_qualite = serializers.IntegerField(min_value=0, max_value=100, required=False)
    
    # Données des étapes précédentes
    donnees_etape1 = serializers.DictField(required=True, allow_empty=False)
    donnees_etape2 = serializers.DictField(required=True, allow_empty=False)
    
    def validate(self, data):
        """Valider qu'au moins photo_id ou photo_url est fourni, et que empreinte_id est fourni"""
        # Vérifier photo
        if not data.get('photo_id') and not data.get('photo_url') and not data.get('photo_uri'):
            raise serializers.ValidationError({
                'photo': "photo_id, photo_url ou photo_uri est requis"
            })
        
        # Vérifier empreinte
        if not data.get('empreinte_id') and not data.get('empreinte_doigt'):
            raise serializers.ValidationError({
                'empreinte': "empreinte_id est requis (ou empreinte_doigt pour compatibilité)"
            })
        
        return data


class LoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    identifiant = serializers.CharField()  # Email, téléphone ou numéro unique
    mot_de_passe = serializers.CharField(write_only=True)
    type_utilisateur = serializers.ChoiceField(
        choices=[('CITOYEN', 'Citoyen'), ('AGENT', 'Agent'), ('CONTROLEUR', 'Contrôleur')],
        required=False
    )


class CompteRenduSerializer(serializers.ModelSerializer):
    agent_nom_complet = serializers.SerializerMethodField()
    
    class Meta:
        model = CompteRendu
        fields = '__all__'
        read_only_fields = ('id', 'numero_reference', 'date_creation', 'date_modification', 'date_envoi')
    
    def get_agent_nom_complet(self, obj):
        return f"{obj.agent.nom} {obj.agent.prenom}" if hasattr(obj.agent, 'nom') else obj.agent.matricule


# ============================================
# Serializers pour services citoyens
# ============================================

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')


class DenonciationSerializer(serializers.ModelSerializer):
    citoyen_nom = serializers.SerializerMethodField()
    
    class Meta:
        model = Denonciation
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')
    
    def get_citoyen_nom(self, obj):
        return f"{obj.citoyen.nom} {obj.citoyen.prenom}"


class PlainteSerializer(serializers.ModelSerializer):
    citoyen_nom = serializers.SerializerMethodField()
    
    class Meta:
        model = Plainte
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')
    
    def get_citoyen_nom(self, obj):
        return f"{obj.citoyen.nom} {obj.citoyen.prenom}"


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'date', 'date_completion')


class RevenuSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True, source='citoyen.transactions')
    
    class Meta:
        model = Revenu
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')


class AlerteUrgenceSerializer(serializers.ModelSerializer):
    citoyen_nom = serializers.SerializerMethodField()
    
    class Meta:
        model = AlerteUrgence
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_prise_en_charge', 'date_resolution')
    
    def get_citoyen_nom(self, obj):
        return f"{obj.citoyen.nom} {obj.citoyen.prenom}"


class HistoriqueAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueAgent
        fields = '__all__'
        read_only_fields = ('id', 'date_creation', 'date_modification')
