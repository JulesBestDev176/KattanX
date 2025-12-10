# 🏛️ Documentation Citoyen - Citizen Portal

## Vue d'ensemble

Ce document décrit en détail toutes les fonctionnalités, modèles de données, processus et responsabilités des **Citoyens** dans le système Citizen Portal.

---

## 📱 Application Mobile Citoyen

### Technologie
- **Framework** : React Native / Expo SDK 54.0.0
- **Package** : `com.kattanx.citizenportal`
- **Version** : 1.0.0
- **Base URL API** : `https://sufmgjdutkglfsliecaz.supabase.co/functions/v1/make-server-7f5fa16e`

### Écrans Disponibles

```
citoyen/src/screens/
├── AuthScreen.tsx              - Authentification et inscription
├── HomeScreen.tsx               - Accueil avec menu services
├── ProfileScreen.tsx            - Profil avec édition
├── DossierScreen.tsx            - Documents administratifs
├── DenonciationsScreen.tsx      - Dénonciations
├── PlaintesScreen.tsx           - Plaintes
└── RevenusScreen.tsx            - Revenus et transferts
```

---

## 🔐 Authentification et Inscription

### Processus d'Inscription (3 Étapes)

#### ÉTAPE 1: Informations de Base + Vérification ANCEC

**Interface** : `AuthScreen.tsx` - Formulaire d'inscription

**Champs requis** :
```typescript
{
  nom: string;                    // Nom de famille
  prenom: string;                 // Prénom
  numeroCNI: string;              // 13 chiffres (format: AAAAMMJJNNNNN)
  dateNaissance: Date;            // Format: YYYY-MM-DD
  lieuNaissance: string;          // Ville/commune
}
```

**Processus** :
1. Utilisateur saisit les informations
2. Clic sur "Suivant"
3. Affichage "Vérification en cours..."
4. Appel API backend pour vérification ANCEC
5. Si succès → Passage étape 2
6. Si échec → Message d'erreur explicite

**Vérifications ANCEC** (via backend) :
- ✅ CNI existe dans la base ANCEC
- ✅ Nom et prénom correspondent
- ✅ Date de naissance cohérente
- ✅ CNI valide (non expirée, non suspendue)
- ✅ Âge minimum 18 ans

**Codes d'erreur possibles** :
- `CNI_INTROUVABLE` : Ce numéro CNI n'existe pas
- `INFORMATIONS_INCOHERENTES` : Les informations ne correspondent pas
- `CNI_EXPIREE` : Votre CNI a expiré
- `AGE_INSUFFISANT` : Vous devez avoir au moins 18 ans

**Endpoint Backend** :
```
POST /api/auth/register/citoyen/etape1
Content-Type: application/json

{
  "nom": "FALL",
  "prenom": "Souleymane",
  "numeroCNI": "1663200000432",
  "dateNaissance": "2000-10-10",
  "lieuNaissance": "Dakar"
}

Réponse:
{
  "success": true,
  "etat": {
    "sessionId": "SESSION-1234567890",
    "statutActuel": "ETAPE_1_VALIDEE",
    "progression": 33
  },
  "verificationANCEC": {
    "succes": true,
    "verifications": {
      "cniExiste": true,
      "informationsCoherentes": true,
      "dateNaissanceCorrecte": true,
      "cniValide": true,
      "ageMinimum": true
    },
    "donneesANCEC": {
      "numeroCNI": "1663200000432",
      "nom": "FALL",
      "prenom": "Souleymane",
      "dateNaissance": "2000-10-10",
      "lieuNaissance": "Dakar",
      "genre": "MASCULIN",
      "photo": "https://storage.ancec.sn/photos/..."
    }
  }
}
```

#### ÉTAPE 2: Authentification + OTP + Numéro Unique

**Interface** : `AuthScreen.tsx` - Écran OTP

**Champs requis** :
```typescript
{
  telephone: string;              // Format: +221XXXXXXXXX
  email?: string;                 // Optionnel
  motDePasse: string;             // Minimum 8 caractères
  confirmationMotDePasse: string;
  codeOTP: string;                // 6 chiffres
}
```

**Processus** :
1. Utilisateur saisit téléphone et email (optionnel)
2. Clic sur "Envoyer code OTP"
3. Code OTP envoyé par WhatsApp via Supabase Function
4. Utilisateur saisit le code reçu (6 chiffres)
5. Validation du code (validité 10 minutes, 3 tentatives max)
6. Saisie du mot de passe et confirmation
7. Génération automatique du numéro unique
8. Affichage: "Votre numéro: CIT-2024-123456"
9. Passage étape 3

**OTP Configuration** :
- **Format** : 6 chiffres
- **Méthode** : WhatsApp (via Supabase Function `send-whatsapp`)
- **Validité** : 10 minutes
- **Tentatives** : 3 maximum
- **Message** : "Votre code Citizen Portal: 123456. Valide 10 minutes."

**Numéro unique d'identification** :
- **Format** : `CIT-AAAA-NNNNNN`
- **Exemple** : `CIT-2024-001234`
- **Utilité** : Identifiant permanent du citoyen dans le système
- **Génération** : Automatique après validation OTP

**Endpoints** :
```
# Envoi OTP
POST /functions/v1/send-whatsapp
{
  "telephone": "+221775551234",
  "type": "OTP_INSCRIPTION"
}

# Validation OTP et génération numéro
POST /api/auth/register/citoyen/etape2
{
  "telephone": "+221775551234",
  "email": "souleymane.fall@example.com",
  "motDePasse": "MotDePasse123!",
  "confirmationMotDePasse": "MotDePasse123!",
  "codeOTP": "123456"
}

Réponse:
{
  "success": true,
  "numeroUnique": {
    "numero": "CIT-2024-001234",
    "type": "CITOYEN",
    "annee": 2024,
    "sequence": 1234,
    "dateGeneration": "2024-12-01T10:30:00Z"
  },
  "etat": {
    "progression": 66,
    "statutActuel": "ETAPE_2_NUMERO_ATTRIBUE"
  }
}
```

#### ÉTAPE 3: Biométrie (Photo + Empreinte)

**Interface** : `AuthScreen.tsx` - Écran capture biométrie

**Actions** :

1. **Capture Photo** :
   ```
   - Bouton "Prendre une photo" ou "Choisir depuis galerie"
   - Affichage caméra ou galerie
   - Aperçu de la photo
   - Validation "Utiliser cette photo"
   ```

2. **Enregistrement Empreinte** :
   ```
   - Instruction: "Placez votre pouce sur le capteur"
   - Animation du capteur
   - Affichage progression (0-100%)
   - Message: "Empreinte enregistrée"
   ```

**Validation Photo** (backend) :
- Format : JPEG ou PNG
- Taille max : 5 MB
- Résolution min : 300x400 pixels
- Visage détecté : Oui (via analyse IA)
- Qualité : > 80/100
- Conformité ISO/IEC 19794-5

**Validation Empreinte** (backend) :
- Qualité : > 80/100
- Lisibilité : Oui
- Doigt : Au moins 1 (recommandé : 2 pouces)
- Format : WSQ ou ANSI/NIST
- Résolution : 500 DPI minimum

**Endpoints** :
```
# Upload et validation photo
POST /api/images/upload-photo/
Content-Type: multipart/form-data

{
  "photo": File,
  "citoyen_id": "uuid",
  "type": "PROFIL"
}

Réponse:
{
  "success": true,
  "photo": {
    "id": "uuid",
    "url": "https://storage.minio.../photos/...",
    "format": "JPEG",
    "resolution": "300x400",
    "qualite_score": 92,
    "conforme_iso": true
  }
}

# Enregistrement empreinte
POST /api/biometrie/enregistrer-empreinte/
{
  "citoyen_id": "uuid",
  "doigt": "POUCE_DROIT",
  "template": "WSQ_TEMPLATE_BASE64...",
  "qualite": 88,
  "dispositif": "Capteur téléphone"
}

# Finalisation inscription
POST /api/auth/register/citoyen/etape3
{
  "sessionId": "SESSION-1234567890",
  "photo_id": "uuid",
  "empreinte_id": "uuid"
}

Réponse:
{
  "success": true,
  "utilisateur": {
    "id": "USER-123",
    "numeroIdentificationUnique": "CIT-2024-001234",
    "numeroCNI": "1663200000432",
    "nom": "FALL",
    "prenom": "Souleymane",
    "telephone": "+221775551234",
    "roles": ["CITOYEN"],
    "statutInscription": "INSCRIPTION_COMPLETE"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Fin d'inscription** :
```
✅ Inscription complète !

Votre compte est maintenant actif.

Numéro d'identification: CIT-2024-001234

[Commencer à utiliser l'application]
```

### Connexion

**Interface** : `AuthScreen.tsx` - Écran de connexion

**Méthodes de connexion** :
1. **Email + Mot de passe**
2. **Téléphone + Mot de passe**
3. **Numéro unique + Mot de passe**

**Endpoint** :
```
POST /api/auth/login
{
  "identifiant": "email@example.com" | "+221775551234" | "CIT-2024-001234",
  "motDePasse": "********",
  "typeUtilisateur": "CITOYEN"
}

Réponse:
{
  "success": true,
  "utilisateur": {
    "id": "USER-123",
    "numeroIdentificationUnique": "CIT-2024-001234",
    "nom": "FALL",
    "prenom": "Souleymane",
    "email": "souleymane.fall@example.com",
    "telephone": "+221775551234",
    "roles": ["CITOYEN"],
    "photo": "https://storage.../photos/..."
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Stockage Local** (AsyncStorage) :
- `kattanx_user` - Données utilisateur
- `kattanx_token` - Token d'authentification
- `kattanx_refresh_token` - Refresh token

---

## 👤 Gestion du Profil Personnel

### Modèle de Données

**Backend Django** : `api/models/citoyen.py` - `Citoyen`

```python
class Citoyen(models.Model):
    # Identification
    id = UUIDField(primary_key=True)
    numero_cni = CharField(max_length=50, unique=True)
    nom = CharField(max_length=200)
    prenom = CharField(max_length=200)
    nom_jeune_fille = CharField(max_length=200, blank=True, null=True)
    autres_prenoms = ArrayField(CharField(max_length=200))
    
    # Naissance
    date_naissance = DateField()
    lieu_naissance = CharField(max_length=200)
    commune_naissance = CharField(max_length=200)
    departement_naissance = CharField(choices=DepartementSenegal.choices)
    region_naissance = CharField(choices=RegionSenegal.choices)
    pays_naissance = CharField(max_length=100, default='Sénégal')
    
    # Identité
    genre = CharField(choices=Genre.choices)  # M/F/A
    nationalite = CharField(choices=Nationalite.choices)
    situation_matrimoniale = CharField(choices=SituationMatrimoniale.choices)
    
    # Profession
    profession = CharField(choices=Profession.choices)
    profession_details = CharField(max_length=200)
    employeur = CharField(max_length=200)
    numero_securite_sociale = CharField(max_length=50)
    
    # Relations
    adresse_actuelle = ForeignKey(Adresse)
    adresse_originale = ForeignKey(Adresse)
    contact = OneToOneField(Contact)
    info_parentale = OneToOneField(InfoParentale)
    biometrie = OneToOneField(Biometrie)
    info_medicale = OneToOneField(InfoMedicale)
    
    # Documents et véhicules
    documents_ids = ArrayField(UUIDField())
    vehicules_ids = ArrayField(UUIDField())
    
    # Casier judiciaire
    casier_judiciaire_vierge = BooleanField(default=True)
    casier_judiciaire_condamnations = JSONField()
    
    # Statut
    statut = CharField(choices=StatutCitoyen.choices, default='ACTIF')
    
    # Métadonnées
    date_creation = DateTimeField(auto_now_add=True)
    date_modification = DateTimeField(auto_now=True)
```

**Frontend TypeScript** : `citoyen/src/types/index.ts`

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  cni: string;
  tel: string;
  photo?: string;
}
```

### Fonctionnalités

#### 1. Consulter le Profil

**Écran** : `ProfileScreen.tsx`

**Affichage** :
- Photo de profil (depuis DAF/ANCEC - lecture seule)
- Nom complet
- CNI
- Téléphone
- Email
- Date de naissance
- Lieu de naissance
- Adresse actuelle

**Endpoint** :
```
GET /api/citoyens/{id}/
Authorization: Bearer {token}

Réponse:
{
  "id": "uuid",
  "numero_cni": "1663200000432",
  "nom": "FALL",
  "prenom": "Souleymane",
  "date_naissance": "2000-10-10",
  "lieu_naissance": "Dakar",
  "genre": "M",
  "contact": {
    "telephone_principal": "+221775551234",
    "email": "souleymane.fall@example.com"
  },
  "adresse_actuelle": {
    "quartier": "Plateau",
    "commune": "Dakar-Plateau",
    "region": "DAKAR"
  },
  "biometrie": {
    "photo_identite": {
      "url": "https://storage.../photos/...",
      "image_url": "https://storage.../photos/..."
    }
  }
}
```

#### 2. Modifier le Profil

**Écran** : `ProfileScreen.tsx` - Mode édition

**Champs modifiables** :
- ✅ Nom (modifiable)
- ✅ Téléphone (modifiable)
- ❌ CNI (non modifiable - réservé ANCEC)
- ❌ Date de naissance (non modifiable)
- ❌ Photo (non modifiable - réservé ANCEC)

**Validation** :
- Nom : Minimum 2 caractères
- Téléphone : Format `+221XXXXXXXXX`

**Endpoint** :
```
PATCH /api/citoyens/{id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "nom": "FALL",
  "contact": {
    "telephone_principal": "+221775551234"
  }
}

Réponse:
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "citoyen": {
    "id": "uuid",
    "nom": "FALL",
    "contact": {
      "telephone_principal": "+221775551234"
    }
  }
}
```

---

## 📄 Gestion des Documents

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Dossier {
  id: string;
  type: 'cni' | 'passeport' | 'extrait_naissance' | 'casier_judiciaire' |
        'acte_mariage' | 'acte_deces' | 'certificat_residence' |
        'permis_conduire' | 'carte_sejour' | 'autre';
  numero: string;
  dateEmission: string;
  dateExpiration?: string;
  statut?: 'valide' | 'expire' | 'en_attente';
  documentURL?: string;
}
```

### Fonctionnalités

#### 1. Consulter le Dossier

**Écran** : `DossierScreen.tsx`

**Affichage** :
- Liste de tous les documents
- Type de document avec icône
- Numéro du document
- Date d'émission
- Date d'expiration (si applicable)
- Statut (valide, expiré, en attente)
- Badge d'alerte pour documents expirés ou proches expiration

**Types de documents** :
1. **CNI** (Carte Nationale d'Identité)
2. **Passeport**
3. **Acte de naissance**
4. **Casier judiciaire**
5. **Acte de mariage**
6. **Acte de décès**
7. **Certificat de résidence**
8. **Permis de conduire**
9. **Carte de séjour**
10. **Autre**

**Endpoint** :
```
GET /api/citoyens/{id}/documents/
Authorization: Bearer {token}

Réponse:
{
  "documents": [
    {
      "id": "uuid",
      "type": "cni",
      "numero": "1663200000432",
      "dateEmission": "2020-10-10",
      "dateExpiration": "2030-10-10",
      "statut": "valide",
      "documentURL": "https://storage.../documents/cni.pdf"
    },
    {
      "id": "uuid",
      "type": "permis_conduire",
      "numero": "PC-2020-123456",
      "dateEmission": "2020-05-15",
      "dateExpiration": "2025-05-15",
      "statut": "valide"
    }
  ]
}
```

#### 2. Visualiser un Document

**Composant** : `DocumentViewer.tsx`

**Fonctionnalités** :
- Visionneuse de documents dédiée
- Format spécial pour la CNI sénégalaise
- Zoom et navigation
- Téléchargement du document
- Partage (si autorisé)

**Format CNI Sénégalaise** :
- Affichage recto/verso
- Informations structurées
- Photo d'identité intégrée
- QR Code de vérification

**Endpoint** :
```
GET /api/documents/{document_id}/view/
Authorization: Bearer {token}

Réponse:
{
  "document": {
    "id": "uuid",
    "type": "cni",
    "url": "https://storage.../documents/cni.pdf",
    "format": "PDF",
    "taille": 2048000
  },
  "signedUrl": "https://storage.../documents/cni.pdf?signature=..."
}
```

---

## 🚨 Signalement et Dénonciations

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Denonciation {
  id: string;
  type: string;                    // Type d'incident
  description: string;              // Description détaillée
  localisation: string;             // Adresse ou lieu
  preuveType: string;               // 'image' | 'audio' | 'video' | 'aucun'
  preuveURL?: string;               // URL de la preuve
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  reponse?: string;                 // Réponse des autorités
}
```

### Fonctionnalités

#### 1. Soumettre une Dénonciation

**Écran** : `DenonciationsScreen.tsx` - Modal formulaire

**Formulaire** :
- **Type d'incident** (sélecteur) :
  - Vol
  - Agression
  - Accident
  - Incendie
  - Autre
- **Description** (textarea) : Description détaillée
- **Localisation** (input) : Adresse ou lieu
- **Preuve** (optionnel) :
  - Image (caméra/galerie)
  - Audio (enregistrement)
  - Vidéo (caméra/galerie)
- **Bouton** : "Soumettre la dénonciation"

**Processus** :
1. Remplir le formulaire
2. Attacher une preuve (optionnel)
3. Clic sur "Soumettre"
4. Confirmation : "Dénonciation soumise avec succès"
5. Statut initial : `pending`

**Endpoint** :
```
POST /api/denonciations/
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "type": "vol",
  "description": "Vol de téléphone au marché Sandaga",
  "localisation": "Marché Sandaga, Dakar",
  "preuveType": "image",
  "preuve": File (image)
}

Réponse:
{
  "success": true,
  "denonciation": {
    "id": "uuid",
    "type": "vol",
    "description": "Vol de téléphone au marché Sandaga",
    "localisation": "Marché Sandaga, Dakar",
    "preuveType": "image",
    "preuveURL": "https://storage.../denonciations/...",
    "status": "pending",
    "createdAt": "2024-12-01T10:30:00Z"
  }
}
```

#### 2. Consulter l'Historique

**Écran** : `DenonciationsScreen.tsx` - Liste

**Affichage** :
- Liste de toutes les dénonciations
- Badge de statut (pending/verified/rejected)
- Date de création
- Type d'incident
- Description (tronquée)
- Bouton "Voir détails"

**Filtres** :
- Toutes
- En attente (pending)
- Vérifiées (verified)
- Rejetées (rejected)

**Endpoint** :
```
GET /api/denonciations/
Authorization: Bearer {token}
Query params: ?status=pending

Réponse:
{
  "denonciations": [
    {
      "id": "uuid",
      "type": "vol",
      "description": "Vol de téléphone...",
      "status": "pending",
      "createdAt": "2024-12-01T10:30:00Z"
    }
  ],
  "total": 5,
  "pending": 2,
  "verified": 2,
  "rejected": 1
}
```

#### 3. Visualiser les Détails

**Modal** : Détails d'une dénonciation

**Affichage** :
- Type d'incident
- Description complète
- Localisation
- Date et heure
- Preuve (image/audio/vidéo)
- Statut actuel
- Réponse des autorités (si disponible)

**Endpoint** :
```
GET /api/denonciations/{id}/
Authorization: Bearer {token}

Réponse:
{
  "id": "uuid",
  "type": "vol",
  "description": "Vol de téléphone au marché Sandaga...",
  "localisation": "Marché Sandaga, Dakar",
  "preuveType": "image",
  "preuveURL": "https://storage.../denonciations/...",
  "status": "verified",
  "createdAt": "2024-12-01T10:30:00Z",
  "updatedAt": "2024-12-02T14:20:00Z",
  "reponse": "Votre dénonciation a été prise en compte. Une enquête est en cours."
}
```

---

## 📝 Gestion des Plaintes

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Plainte {
  id: string;
  type: 'reçue' | 'déposée';
  objet: string;
  description: string;
  commissariat?: string;
  amende?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Fonctionnalités

#### 1. Déposer une Plainte

**Écran** : `PlaintesScreen.tsx` - Modal formulaire

**Formulaire** :
- **Objet** (input) : Objet de la plainte
- **Description** (textarea) : Description détaillée
- **Commissariat** (sélecteur) :
  - Sélection manuelle
  - Auto-sélection du plus proche (basé sur GPS)
- **Bouton** : "Déposer la plainte"

**Processus** :
1. Remplir objet et description
2. Choisir commissariat (ou auto-sélection)
3. Clic sur "Déposer"
4. Confirmation : "Plainte déposée avec succès"
5. Plainte enregistrée dans le système

**Endpoint** :
```
POST /api/plaintes/
Authorization: Bearer {token}
Content-Type: application/json

{
  "objet": "Vol de véhicule",
  "description": "Mon véhicule a été volé hier soir...",
  "commissariat": "Commissariat Central Dakar",
  "localisation": {
    "latitude": 14.6928,
    "longitude": -17.4467
  }
}

Réponse:
{
  "success": true,
  "plainte": {
    "id": "uuid",
    "type": "déposée",
    "objet": "Vol de véhicule",
    "description": "Mon véhicule a été volé...",
    "commissariat": "Commissariat Central Dakar",
    "status": "en_cours",
    "createdAt": "2024-12-01T10:30:00Z"
  }
}
```

#### 2. Consulter les Plaintes

**Écran** : `PlaintesScreen.tsx` - Liste

**Affichage** :
- Liste des plaintes reçues et déposées
- Badge de type (reçue/déposée)
- Objet
- Statut
- Date
- Amende (si applicable)
- Bouton "Voir détails"

**Filtres** :
- Toutes
- Reçues
- Déposées
- En cours
- Résolues

**Endpoint** :
```
GET /api/plaintes/
Authorization: Bearer {token}
Query params: ?type=déposée&status=en_cours

Réponse:
{
  "plaintes": [
    {
      "id": "uuid",
      "type": "déposée",
      "objet": "Vol de véhicule",
      "status": "en_cours",
      "createdAt": "2024-12-01T10:30:00Z",
      "amende": null
    }
  ],
  "total": 3,
  "reçues": 1,
  "déposées": 2
}
```

---

## 💰 Gestion des Revenus

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Revenu {
  solde: number;                   // Solde disponible en FCFA
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'gain' | 'transfert' | 'retrait';
  montant: number;
  date: string;
  statut: 'en_attente' | 'complete' | 'echec';
  description?: string;
  destinataire?: string;
}
```

### Fonctionnalités

#### 1. Consulter le Solde

**Écran** : `RevenusScreen.tsx`

**Affichage** :
- Solde disponible en FCFA (grand format)
- Historique des transactions
- Statistiques (gains totaux, transferts, etc.)

**Endpoint** :
```
GET /api/revenus/
Authorization: Bearer {token}

Réponse:
{
  "solde": 50000,                  // FCFA
  "transactions": [
    {
      "id": "uuid",
      "type": "gain",
      "montant": 10000,
      "date": "2024-11-28T10:30:00Z",
      "statut": "complete",
      "description": "Gain alerte vérifiée"
    }
  ],
  "statistiques": {
    "gainsTotaux": 50000,
    "transferts": 20000,
    "retraits": 10000
  }
}
```

#### 2. Effectuer un Transfert

**Écran** : `RevenusScreen.tsx` - Modal transfert

**Formulaire** :
- **Type** (sélecteur) :
  - Mobile Money (numéro téléphone)
  - Banque (numéro compte)
- **Destinataire** (input) : Numéro téléphone ou compte
- **Montant** (input) : Montant en FCFA
- **Bouton** : "Effectuer le transfert"

**Validation** :
- Montant > 0
- Montant <= solde disponible
- Numéro destinataire valide

**Endpoint** :
```
POST /api/transfer/
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "mobile_money",
  "destinataire": "+221776543210",
  "montant": 10000
}

Réponse:
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "type": "transfert",
    "montant": 10000,
    "destinataire": "+221776543210",
    "statut": "en_attente",
    "date": "2024-12-01T10:30:00Z"
  },
  "nouveauSolde": 40000
}
```

---

## 🔐 Permissions et Limitations

### ✅ Peut faire

- Consulter ses propres informations
- Mettre à jour ses informations de contact (nom, téléphone)
- Consulter ses documents
- Signaler des incidents (dénonciations)
- Déposer des plaintes
- Consulter ses revenus
- Effectuer des transferts
- Gérer sa session

### ❌ Ne peut pas faire

- Modifier ses informations biométriques (réservé aux organismes officiels ANCEC)
- Accéder aux informations d'autres citoyens
- Modifier son numéro CNI
- Modifier sa date de naissance
- Accéder aux données des agents
- Modifier les données administratives officielles
- Supprimer des documents
- Accéder au portail de contrôle

---

## 📊 Modèles Backend Complets

### Modèle Citoyen (Django)

**Fichier** : `backend/api/models/citoyen.py`

**Relations** :
- `Adresse` (OneToOne) - Adresse actuelle et originale
- `Contact` (OneToOne) - Informations de contact
- `InfoParentale` (OneToOne) - Informations parentales
- `Biometrie` (OneToOne) - Données biométriques
- `InfoMedicale` (OneToOne) - Informations médicales
- `Conjoint` (ForeignKey) - Conjoint(s)
- `Enfant` (ForeignKey) - Enfants
- `Vehicule` (ForeignKey) - Véhicules possédés

**Champs importants** :
```python
# Identification
numero_cni = CharField(max_length=50, unique=True)  # 13 chiffres
nom = CharField(max_length=200)
prenom = CharField(max_length=200)

# Naissance
date_naissance = DateField()
lieu_naissance = CharField(max_length=200)
region_naissance = CharField(choices=RegionSenegal.choices)

# Profession
profession = CharField(choices=Profession.choices)
numero_securite_sociale = CharField(max_length=50)

# Documents et véhicules
documents_ids = ArrayField(UUIDField())
vehicules_ids = ArrayField(UUIDField())

# Casier judiciaire
casier_judiciaire_vierge = BooleanField(default=True)
casier_judiciaire_condamnations = JSONField()

# Statut
statut = CharField(choices=StatutCitoyen.choices, default='ACTIF')
```

### Modèle Adresse

```python
class Adresse(models.Model):
    quartier = CharField(max_length=200)
    commune = CharField(max_length=200)
    departement = CharField(choices=DepartementSenegal.choices)
    region = CharField(choices=RegionSenegal.choices)
    pays = CharField(max_length=100, default='Sénégal')
    latitude = DecimalField(max_digits=9, decimal_places=6)
    longitude = DecimalField(max_digits=9, decimal_places=6)
```

### Modèle Contact

```python
class Contact(models.Model):
    telephone_principal = CharField(max_length=50)
    telephone_secondaire = CharField(max_length=50, blank=True)
    email = EmailField(blank=True)
    telephone_urgence = CharField(max_length=50)
    contact_urgence_nom = CharField(max_length=200)
    contact_urgence_relation = CharField(max_length=50)
```

### Modèle Biométrie

```python
class Biometrie(models.Model):
    # Relations
    photo_identite = OneToOneField(PhotoIdentite)
    signature = OneToOneField(Signature)
    reconnaissance_faciale = OneToOneField(ReconnaissanceFaciale)
    empreintes = ManyToManyField(EmpreinteDigitale)
    
    # Métadonnées
    lieu_capture = CharField(max_length=200)
    operateur_capture = CharField(max_length=100)
    date_enrolement = DateTimeField()
    conforme_ancec = BooleanField(default=False)
    numero_enrolement_ancec = CharField(max_length=100)
```

---

## 🔗 Endpoints API Complets

### Authentification

```
POST   /api/auth/register/citoyen/etape1      - Inscription étape 1
POST   /api/auth/register/citoyen/etape2      - Inscription étape 2
POST   /api/auth/register/citoyen/etape3      - Inscription étape 3
POST   /api/auth/login                         - Connexion
POST   /api/auth/token/refresh/                - Rafraîchir token
POST   /api/auth/logout                        - Déconnexion
```

### Profil

```
GET    /api/citoyens/{id}/                     - Consulter profil
PATCH  /api/citoyens/{id}/                     - Modifier profil
GET    /api/citoyens/{id}/biometrie/           - Consulter biométrie
```

### Documents

```
GET    /api/citoyens/{id}/documents/            - Liste documents
GET    /api/documents/{id}/view/                - Visualiser document
GET    /api/documents/{id}/download/            - Télécharger document
```

### Dénonciations

```
GET    /api/denonciations/                      - Liste dénonciations
POST   /api/denonciations/                      - Créer dénonciation
GET    /api/denonciations/{id}/                 - Détails dénonciation
PATCH  /api/denonciations/{id}/                 - Mettre à jour
```

### Plaintes

```
GET    /api/plaintes/                           - Liste plaintes
POST   /api/plaintes/                           - Déposer plainte
GET    /api/plaintes/{id}/                      - Détails plainte
PATCH  /api/plaintes/{id}/                      - Mettre à jour
```

### Revenus

```
GET    /api/revenus/                            - Consulter solde
POST   /api/transfer/                           - Effectuer transfert
GET    /api/transactions/                        - Historique transactions
```

### Images

```
POST   /api/images/upload-photo/                - Uploader photo
POST   /api/images/upload-signature/            - Uploader signature
POST   /api/images/validate/                    - Valider image
```

---

## 📱 Interfaces Utilisateur

### Écran d'Accueil

**Fichier** : `citoyen/src/screens/HomeScreen.tsx`

**Menu Services** :
1. **Profil** - Gérer vos informations
2. **Dossier** - Documents administratifs
3. **Plaintes** - Plaintes reçues et déposées
4. **Dénonciations** - Signaler des incidents
5. **Revenus** - Solde et transferts

### Écran Profil

**Fichier** : `citoyen/src/screens/ProfileScreen.tsx`

**Sections** :
- Informations personnelles (lecture seule)
- Informations de contact (éditables)
- Photo de profil (lecture seule)
- Bouton "Modifier"
- Bouton "Déconnexion"

### Écran Dossier

**Fichier** : `citoyen/src/screens/DossierScreen.tsx`

**Fonctionnalités** :
- Liste des documents avec icônes
- Filtres par type
- Recherche
- Visionneuse de documents
- Alertes expiration

### Écran Dénonciations

**Fichier** : `citoyen/src/screens/DenonciationsScreen.tsx`

**Fonctionnalités** :
- Liste des dénonciations
- Filtres par statut
- Modal formulaire création
- Upload de preuves
- Détails complets

### Écran Plaintes

**Fichier** : `citoyen/src/screens/PlaintesScreen.tsx`

**Fonctionnalités** :
- Liste des plaintes
- Séparation reçues/déposées
- Modal formulaire dépôt
- Auto-sélection commissariat
- Suivi statut

### Écran Revenus

**Fichier** : `citoyen/src/screens/RevenusScreen.tsx`

**Fonctionnalités** :
- Affichage solde
- Historique transactions
- Modal transfert
- Choix Mobile Money/Banque
- Statistiques

---

## 🔄 Flux de Données

### Inscription Complète

```
1. ÉTAPE 1: Informations de base
   → POST /api/auth/register/citoyen/etape1
   → Vérification ANCEC
   → ✅ Étape 1 validée

2. ÉTAPE 2: Authentification
   → POST /functions/v1/send-whatsapp (OTP)
   → POST /api/auth/register/citoyen/etape2
   → Validation OTP
   → Génération numéro unique (CIT-2024-123456)
   → ✅ Étape 2 validée

3. ÉTAPE 3: Biométrie
   → POST /api/images/upload-photo/
   → POST /api/biometrie/enregistrer-empreinte/
   → POST /api/auth/register/citoyen/etape3
   → Création compte utilisateur
   → ✅ Inscription complète
```

### Connexion

```
1. Saisie identifiant (email/téléphone/numéro unique)
2. Saisie mot de passe
3. POST /api/auth/login
4. Réception tokens (access + refresh)
5. Stockage local (AsyncStorage)
6. Redirection vers HomeScreen
```

### Modification Profil

```
1. Ouverture ProfileScreen
2. Clic "Modifier"
3. Édition nom/téléphone
4. PATCH /api/citoyens/{id}/
5. Mise à jour locale
6. Affichage confirmation
```

### Dépôt Dénonciation

```
1. Ouverture DenonciationsScreen
2. Clic "Nouvelle dénonciation"
3. Remplissage formulaire
4. Upload preuve (optionnel)
5. POST /api/denonciations/
6. Confirmation
7. Statut: pending
```

---

## 📊 Statistiques et Métriques

### Données Trackées

- Nombre de dénonciations soumises
- Nombre de plaintes déposées
- Solde total des revenus
- Nombre de documents
- Date dernière connexion

---

## 🔗 Références

- [Documentation Backend](../backend/docs/README.md)
- [Intégration Organismes Officiels](../backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)
- [Responsabilités des Acteurs](./RESPONSABILITES_ACTEURS.md)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Citizen Portal

