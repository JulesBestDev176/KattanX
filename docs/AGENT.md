# 👮 Documentation Agent - Citizen Portal

## Vue d'ensemble

Ce document décrit en détail toutes les fonctionnalités, modèles de données, processus et responsabilités des **Agents des Forces de l'Ordre** dans le système Citizen Portal.

---

## 📱 Application Mobile Agent

### Technologie
- **Framework** : React Native / Expo
- **Package** : `com.kattanx.agentportal`
- **Version** : 1.0.0
- **Base URL API** : `https://sufmgjdutkglfsliecaz.supabase.co`

### Écrans Disponibles

```
agent/src/screens/
├── AuthScreen.tsx              - Authentification et inscription agent
├── HomeScreen.tsx               - Dashboard avec toggle service + GPS
├── VerificationScreen.tsx       - Vérification identité (3 méthodes)
├── AlertsScreen.tsx             - Alertes temps réel
├── ProfileScreen.tsx            - Profil avec statistiques
└── MissionsScreen.tsx           - Missions assignées (à venir)
```

---

## 🔐 Authentification et Inscription Agent

### Principe Fondamental

> **Un agent est d'abord un citoyen.**

Tous les agents ont le rôle `CITOYEN` en base, plus le rôle `AGENT_TERRAIN` (ou supérieur selon le grade).

### Processus d'Inscription (3 Étapes + Matricule)

#### ÉTAPE 1: Informations de Base + Matricule + Vérification ANCEC et Agent

**Interface** : `AuthScreen.tsx` - Formulaire d'inscription agent

**Champs requis** :
```typescript
{
  nom: string;                    // Nom de famille
  prenom: string;                 // Prénom
  numeroCNI: string;              // 13 chiffres (format: AAAAMMJJNNNNN)
  dateNaissance: Date;            // Format: YYYY-MM-DD
  lieuNaissance: string;          // Ville/commune
  matricule: string;              // Format: POL/GEN/POM-AAAA-NNNNNN ⚠️ NOUVEAU
}
```

**Processus** :
1. Utilisateur saisit les informations (nom, prénom, CNI, naissance, lieu)
2. **Saisie du matricule** (champ supplémentaire pour agents)
3. Clic sur "Suivant"
4. Affichage "Vérification en cours..."
5. **Double vérification** :
   - Appel API ANCEC (vérification citoyen)
   - Appel API DGPN/HCGN/DNPC (vérification matricule)
6. Si succès → Passage étape 2
7. Si échec → Message d'erreur explicite

**Vérifications ANCEC** (comme citoyen) :
- ✅ CNI existe dans la base ANCEC
- ✅ Nom et prénom correspondent
- ✅ Date de naissance cohérente
- ✅ CNI valide (non expirée, non suspendue)
- ✅ Âge minimum 18 ans

**Vérifications Agent** (supplémentaires) :
- ✅ Matricule existe dans la base agents (DGPN/HCGN/DNPC)
- ✅ Format valide (POL/GEN/POM-AAAA-NNNNNN)
- ✅ Agent en service actif
- ✅ CNI correspond au matricule
- ✅ Grade et brigade récupérés

**Codes d'erreur possibles** :
- `CNI_INTROUVABLE` : Ce numéro CNI n'existe pas
- `MATRICULE_INTROUVABLE` : Ce matricule n'existe pas
- `MATRICULE_FORMAT_INVALIDE` : Format attendu: POL-AAAA-NNNNNN
- `AGENT_INACTIF` : Cet agent n'est plus en service
- `CNI_MATRICULE_INCOHERENT` : Le CNI ne correspond pas au matricule

**Endpoint Backend** :
```
POST /api/auth/register/agent/etape1
Content-Type: application/json

{
  "nom": "SARR",
  "prenom": "Mamadou",
  "numeroCNI": "1995032512345",
  "dateNaissance": "1995-03-25",
  "lieuNaissance": "Thiès",
  "matricule": "POL-2020-001234"
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
    }
  },
  "verificationAgent": {
    "succes": true,
    "verifications": {
      "matriculeExiste": true,
      "matriculeFormatValide": true,
      "agentActif": true,
      "correspondanceCNI": true
    },
    "donneesAgent": {
      "matricule": "POL-2020-001234",
      "typeForce": "POLICE_NATIONALE",
      "grade": "Gardien de la Paix",
      "brigadeId": "BRG-DK-001",
      "brigadeNom": "Commissariat Central Dakar",
      "dateRecrutement": "2020-01-15",
      "statut": "ACTIF"
    }
  }
}
```

#### ÉTAPE 2: Authentification + OTP + Numéro Unique

**Identique au processus citoyen**, mais :
- Numéro généré : `AGT-2024-001234` (au lieu de `CIT-2024-001234`)
- Rôles attribués : `[CITOYEN, AGENT_TERRAIN]`

**Endpoint** :
```
POST /api/auth/register/agent/etape2
{
  "telephone": "+221775551234",
  "email": "mamadou.sarr@police.sn",
  "motDePasse": "MotDePasse123!",
  "confirmationMotDePasse": "MotDePasse123!",
  "codeOTP": "123456"
}

Réponse:
{
  "success": true,
  "numeroUnique": {
    "numero": "AGT-2024-001234",
    "type": "AGENT",
    "annee": 2024,
    "sequence": 1234
  },
  "etat": {
    "progression": 66,
    "statutActuel": "ETAPE_2_NUMERO_ATTRIBUE"
  }
}
```

#### ÉTAPE 3: Biométrie (Photo + Empreinte)

**Identique au processus citoyen**

**Endpoint** :
```
POST /api/auth/register/agent/etape3
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
    "numeroIdentificationUnique": "AGT-2024-001234",
    "numeroCNI": "1995032512345",
    "nom": "SARR",
    "prenom": "Mamadou",
    "telephone": "+221775551234",
    "roles": ["CITOYEN", "AGENT_TERRAIN"],
    "infoAgent": {
      "matricule": "POL-2020-001234",
      "typeForce": "POLICE_NATIONALE",
      "grade": "Gardien de la Paix",
      "brigadeId": "BRG-DK-001",
      "brigadeNom": "Commissariat Central Dakar"
    },
    "statutInscription": "INSCRIPTION_COMPLETE"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### Connexion Agent

**Interface** : `AuthScreen.tsx` - Écran de connexion

**Méthodes de connexion** :
1. **Matricule + Mot de passe**
2. **Email + Mot de passe**
3. **Téléphone + Mot de passe**
4. **Numéro unique + Mot de passe**

**Endpoint** :
```
POST /api/auth/login
{
  "identifiant": "POL-2020-001234" | "email@example.com" | "+221775551234" | "AGT-2024-001234",
  "motDePasse": "********",
  "typeUtilisateur": "AGENT"
}

Réponse:
{
  "success": true,
  "utilisateur": {
    "id": "USER-123",
    "numeroIdentificationUnique": "AGT-2024-001234",
    "nom": "SARR",
    "prenom": "Mamadou",
    "matricule": "POL-2020-001234",
    "roles": ["CITOYEN", "AGENT_TERRAIN"],
    "infoAgent": {
      "matricule": "POL-2020-001234",
      "typeForce": "POLICE_NATIONALE",
      "grade": "Gardien de la Paix",
      "brigadeId": "BRG-DK-001",
      "brigadeNom": "Commissariat Central Dakar",
      "statutProfessionnel": "ACTIF"
    }
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Stockage Local** (AsyncStorage) :
- `kattanx_agent` - Données de l'agent
- `kattanx_agent_token` - Token d'authentification
- `kattanx_service_status` - Statut du service (true/false)
- `kattanx_temp_agent_id` - ID temporaire
- `kattanx_temp_otp` - Code OTP temporaire

---

## 🎯 Gestion du Service

### Modèle de Données

**Backend Django** : `api/models/agents.py` - `Agent`

```python
class Agent(models.Model):
    # Identification
    id = UUIDField(primary_key=True)
    citoyen = ForeignKey('citoyen.Citoyen')  # Lien vers profil citoyen
    matricule = CharField(max_length=50, unique=True)  # POL-2020-001234
    
    # Force et grade
    type_force = CharField(choices=TypeForceOrdre.choices)  # POLICE_NATIONALE, etc.
    grade_police = CharField(choices=GradePolice.choices)
    grade_gendarmerie = CharField(choices=GradeGendarmerie.choices)
    grade_pompiers = CharField(choices=GradePompiers.choices)
    
    # Affectation
    unite_affectation = CharField(max_length=200)  # Brigade
    poste = CharField(max_length=200)
    date_entree_service = DateField()
    
    # Statut
    statut = CharField(choices=STATUT_CHOICES, default='ACTIF')
    # ACTIF, EN_SERVICE, EN_MISSION, CONGE, SUSPENDU, RETRAITE, DECEDE
    
    # Position GPS
    position_latitude = DecimalField(max_digits=9, decimal_places=6)
    position_longitude = DecimalField(max_digits=9, decimal_places=6)
    position_timestamp = DateTimeField()
    
    # Statistiques
    verifications_effectuees = IntegerField(default=0)
    alertes_creees = IntegerField(default=0)
    arrestations = IntegerField(default=0)
    missions_completes = IntegerField(default=0)
```

**Frontend TypeScript** : `agent/src/types/index.ts`

```typescript
interface Agent {
  id: string;
  email: string;
  name: string;
  prenom: string;
  nom: string;
  cni: string;
  tel: string;
  corps: 'Police' | 'Gendarmerie' | 'Douane' | 'Armée' | 'Autre';
  matricule: string;
  photo?: string;
  position?: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
  enService: boolean;
  stats?: {
    verificationsEffectuees: number;
    alertesCreees: number;
    arrestations: number;
  };
}
```

### Fonctionnalités

#### 1. Activer/Désactiver le Service

**Écran** : `HomeScreen.tsx` - Toggle service

**Interface** :
- Toggle switch "En Service" / "Hors Service"
- Badge de statut (vert: En Service / gris: Hors Service)
- Sauvegarde automatique dans AsyncStorage

**Processus** :
1. Agent ouvre l'application
2. Toggle service sur "En Service"
3. **Démarrage automatique du tracking GPS** (foreground + background)
4. Mise à jour position toutes les 30 secondes
5. Statut sauvegardé localement et synchronisé avec backend

**Endpoint** :
```
PATCH /api/agents/{id}/service/
Authorization: Bearer {token}
Content-Type: application/json

{
  "enService": true
}

Réponse:
{
  "success": true,
  "agent": {
    "id": "uuid",
    "matricule": "POL-2020-001234",
    "statut": "EN_SERVICE",
    "position": {
      "latitude": 14.6928,
      "longitude": -17.4467,
      "timestamp": "2024-12-01T10:30:00Z"
    }
  }
}
```

#### 2. Mise à Jour Position GPS

**Automatique** lorsque le service est activé

**Permissions requises** :
- Location (foreground)
- Location (background)

**Fréquence** : Toutes les 30 secondes en service

**Endpoint** :
```
POST /api/agents/{id}/position/
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 14.6928,
  "longitude": -17.4467,
  "timestamp": "2024-12-01T10:30:00Z"
}

Réponse:
{
  "success": true,
  "position": {
    "latitude": 14.6928,
    "longitude": -17.4467,
    "timestamp": "2024-12-01T10:30:00Z",
    "adresse": "Avenue Léopold Sédar Senghor, Dakar"
  }
}
```

---

## 🔍 Vérification d'Identité (3 Méthodes)

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface VerificationResult {
  citoyen?: {
    id: string;
    nom: string;
    prenom: string;
    cni: string;
    dateNaissance: string;
    telephone: string;
    adresse: string;
    photo?: string;
  };
  badges?: {
    recherche: boolean;      // Badge RECHERCHE (rouge)
    amendes: boolean;        // Badge AMENDES (orange)
    casierJudiciaire: boolean; // Badge CASIER JUDICIAIRE (violet)
  };
  amendes?: Array<{
    id: string;
    montant: number;
    motif: string;
    date: string;
    statut: string;
  }>;
  casierJudiciaire?: Array<{
    type: 'condamnation' | 'plainte' | 'garde_a_vue';
    description: string;
    date: string;
    lieu: string;
    peine?: string;
  }>;
  vehicules?: Array<{
    matricule: string;
    marque: string;
    modele: string;
    couleur: string;
    annee: number;
  }>;
}
```

### Méthode 1: Vérification par CNI

**Écran** : `VerificationScreen.tsx` - Onglet "CNI"

**Processus** :
1. Agent saisit le numéro CNI (13 chiffres)
2. Validation du format (backend)
3. Recherche dans la base de données
4. Affichage des résultats complets

**Validation Format** :
- Format : 13 chiffres (AAAAMMJJNNNNN)
- Validation : `ServiceVerification.valider_format_cni()`

**Endpoint** :
```
POST /api/verification/valider-cni/
Content-Type: application/json

{
  "numeroCNI": "1663200000432"
}

Réponse:
{
  "valide": true,
  "format": "AAAAMMJJNNNNN",
  "annee": 2000,
  "mois": 10,
  "jour": 10,
  "sequence": 432
}
```

**Recherche Citoyen** :
```
GET /api/citoyens/search/?q=1663200000432
Authorization: Bearer {token}

Réponse:
{
  "citoyens": [
    {
      "id": "uuid",
      "numero_cni": "1663200000432",
      "nom": "FALL",
      "prenom": "Souleymane",
      "date_naissance": "2000-10-10",
      "contact": {
        "telephone_principal": "+221775551234"
      },
      "adresse_actuelle": {
        "quartier": "Plateau",
        "commune": "Dakar-Plateau"
      },
      "biometrie": {
        "photo_identite": {
          "url": "https://storage.../photos/..."
        }
      },
      "casier_judiciaire_vierge": false,
      "casier_judiciaire_condamnations": [
        {
          "type": "condamnation",
          "description": "Vol simple",
          "date": "2023-05-15",
          "lieu": "Tribunal de Dakar",
          "peine": "6 mois avec sursis"
        }
      ]
    }
  ]
}
```

**Enregistrement Vérification** :
```
POST /api/agents/{id}/verifications/
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "CNI",
  "citoyen_id": "uuid",
  "resultat": "TROUVE",
  "localisation": {
    "latitude": 14.6928,
    "longitude": -17.4467,
    "adresse": "Avenue Pompidou, Dakar"
  }
}

Réponse:
{
  "success": true,
  "verification": {
    "id": "uuid",
    "date": "2024-12-01T10:30:00Z",
    "type": "CNI",
    "resultat": "TROUVE"
  },
  "statistiques": {
    "verifications_effectuees": 146  // Incrémenté automatiquement
  }
}
```

### Méthode 2: Vérification par Matricule Véhicule

**Écran** : `VerificationScreen.tsx` - Onglet "Matricule"

**Processus** :
1. Agent saisit la plaque d'immatriculation (ex: DK-1234-AB)
2. Validation du format (backend)
3. Recherche du véhicule et de son propriétaire
4. Affichage des résultats

**Validation Format** :
- Format : `RR-NNNN-LL` (Région-Numéro-Lettres)
- Exemples : `DK-1234-AB`, `TH-5678-CD`

**Endpoint** :
```
POST /api/verification/valider-matricule/
Content-Type: application/json

{
  "matricule": "DK-1234-AB"
}

Réponse:
{
  "valide": true,
  "format": "RR-NNNN-LL",
  "region": "DK",
  "numero": 1234,
  "lettres": "AB"
}
```

**Recherche Véhicule** :
```
GET /api/vehicules/search/?matricule=DK-1234-AB
Authorization: Bearer {token}

Réponse:
{
  "vehicule": {
    "id": "uuid",
    "matricule": "DK-1234-AB",
    "marque": "TOYOTA",
    "modele": "Corolla",
    "couleur_principale": "BLANC",
    "annee_modele": 2020,
    "proprietaire_actuel": {
      "id": "uuid",
      "nom": "FALL",
      "prenom": "Souleymane",
      "numero_cni": "1663200000432",
      "contact": {
        "telephone_principal": "+221775551234"
      }
    },
    "assurance_actuelle": {
      "statut": "VALIDE",
      "date_fin": "2025-06-30"
    },
    "visite_technique_actuelle": {
      "statut": "VALIDE",
      "date_expiration": "2025-03-31"
    },
    "statut": "EN_CIRCULATION"
  }
}
```

### Méthode 3: Vérification par Photo (Reconnaissance Faciale IA)

**Écran** : `VerificationScreen.tsx` - Onglet "Photo"

**Processus** :
1. Agent ouvre la caméra ou choisit une photo depuis la galerie
2. Capture/selection de la photo
3. Envoi à l'API backend pour analyse IA (Gemini)
4. Comparaison avec la base de données (reconnaissance faciale)
5. Affichage des résultats avec score de confiance

**Composant** : `CameraCapture.tsx`

**Analyse IA** :
- Service : Google Gemini AI
- Détection de visage
- Extraction des caractéristiques faciales
- Comparaison avec base de données

**Endpoint** :
```
POST /api/biometrie/verifier-faciale/
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "photo": File,
  "localisation": {
    "latitude": 14.6928,
    "longitude": -17.4467
  }
}

Réponse:
{
  "success": true,
  "resultats": [
    {
      "citoyen_id": "uuid",
      "nom": "FALL",
      "prenom": "Souleymane",
      "score_confiance": 0.95,
      "photo_reference": "https://storage.../photos/..."
    }
  ],
  "analyse_ia": {
    "visage_detecte": true,
    "qualite_image": 92,
    "recommandations": "Photo de bonne qualité, visage clairement visible"
  }
}
```

**Utilitaire** : `agent/src/utils/imageAnalysis.ts`
```typescript
// Mode démo - Analyse photo avec IA
export async function analyserPhoto(photoUri: string): Promise<VerificationResult> {
  // Envoi à l'API backend
  // Analyse avec Gemini AI
  // Retour des résultats
}
```

### Affichage des Résultats

**Composant** : `IndividuCard.tsx`

**Informations affichées** :
- Photo d'identité
- Nom complet
- CNI
- Date de naissance
- Téléphone
- Adresse

**Badges de statut** :
- 🔴 **RECHERCHE** (rouge) - Si individu recherché
- 🟠 **AMENDES** (orange) - Si amendes impayées
- 🟣 **CASIER JUDICIAIRE** (violet) - Si casier non vierge

**Liste des amendes** :
- Montant
- Motif
- Date
- Statut (impayée/payée)

**Casier judiciaire détaillé** :
- Type (condamnation/plainte/garde_à_vue)
- Description
- Date
- Lieu
- Peine (si applicable)

**Véhicules enregistrés** :
- Matricule
- Marque
- Modèle
- Couleur
- Année

**Actions disponibles** :
- **Demander une arrestation** (si badge RECHERCHE)
- **Créer une amende**
- **Partager une alerte**

---

## 🚨 Gestion des Alertes

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Alerte {
  id: string;
  type: 'fugitif' | 'vol' | 'incident' | 'autre';
  titre: string;
  description: string;
  suspect?: Suspect;
  localisation: {
    latitude: number;
    longitude: number;
    adresse: string;
  };
  images?: string[];
  createdBy: string;
  createdByName: string;
  status: 'active' | 'resolue' | 'annulee';
  distance?: number;  // Distance depuis position agent
}
```

### Fonctionnalités

#### 1. Recevoir des Alertes en Temps Réel

**Écran** : `AlertsScreen.tsx`

**Processus** :
- Rafraîchissement automatique toutes les 5 secondes (mode démo)
- Notifications sonores et vibrations pour nouvelles alertes
- Calcul automatique de la distance depuis la position de l'agent

**Types d'alertes** :
- **Fugitif** - Personne recherchée
- **Vol de véhicule** - Véhicule volé
- **Incident** - Autre type d'incident

**Composant** : `AlertCard.tsx`

**Affichage** :
- Type d'alerte avec icône
- Titre
- Description
- Distance depuis agent (calculée avec formule Haversine)
- Localisation
- Images (si disponibles)
- Nom du créateur
- Bouton "Je vais vérifier"

**Calcul Distance** : `agent/src/utils/location.ts`
```typescript
// Formule Haversine pour calculer la distance entre deux points GPS
export function calculerDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Retourne la distance en kilomètres
}
```

**Endpoint** :
```
GET /api/alertes/
Authorization: Bearer {token}
Query params: ?status=active&latitude=14.6928&longitude=-17.4467

Réponse:
{
  "alertes": [
    {
      "id": "uuid",
      "type": "fugitif",
      "titre": "Recherche personne",
      "description": "Suspect recherché pour vol...",
      "localisation": {
        "latitude": 14.7000,
        "longitude": -17.4500,
        "adresse": "Marché Sandaga, Dakar"
      },
      "suspect": {
        "nom": "DIOP",
        "prenom": "Amadou",
        "cni": "1990012312345",
        "photo": "https://storage.../photos/...",
        "vehicule": {
          "matricule": "DK-5678-EF",
          "marque": "TOYOTA",
          "modele": "Corolla",
          "couleur": "NOIR"
        }
      },
      "images": ["https://storage.../alertes/..."],
      "createdBy": "USER-456",
      "createdByName": "Agent NDIAYE",
      "status": "active",
      "distance": 2.5  // km depuis position agent
    }
  ],
  "total": 5
}
```

#### 2. Créer une Alerte

**Processus** :
1. Agent vérifie un individu suspect
2. Clic sur "Partager une alerte" dans les résultats de vérification
3. Formulaire modal :
   - Type d'alerte
   - Description
   - Localisation (auto-remplie depuis GPS)
   - Images (optionnel)
4. Envoi de l'alerte
5. Alerte visible par tous les agents

**Endpoint** :
```
POST /api/alertes/
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "type": "fugitif",
  "titre": "Recherche personne",
  "description": "Suspect recherché pour vol...",
  "citoyen_id": "uuid",
  "localisation": {
    "latitude": 14.6928,
    "longitude": -17.4467,
    "adresse": "Avenue Pompidou, Dakar"
  },
  "images": [File, File]
}

Réponse:
{
  "success": true,
  "alerte": {
    "id": "uuid",
    "type": "fugitif",
    "titre": "Recherche personne",
    "status": "active",
    "createdBy": "USER-123",
    "createdByName": "Agent SARR",
    "createdAt": "2024-12-01T10:30:00Z"
  },
  "statistiques": {
    "alertes_creees": 24  // Incrémenté automatiquement
  }
}
```

#### 3. Traiter une Alerte

**Action** : "Je vais vérifier"

**Processus** :
1. Agent clique sur "Je vais vérifier"
2. Mise à jour du statut de l'alerte
3. Notification aux autres agents
4. Suivi de l'intervention

**Endpoint** :
```
PATCH /api/alertes/{id}/traiter/
Authorization: Bearer {token}
Content-Type: application/json

{
  "agent_id": "uuid",
  "action": "en_route"
}

Réponse:
{
  "success": true,
  "alerte": {
    "id": "uuid",
    "status": "en_traitement",
    "agent_traitant": {
      "id": "uuid",
      "nom": "SARR",
      "prenom": "Mamadou",
      "matricule": "POL-2020-001234"
    }
  }
}
```

---

## 📋 Gestion des Missions

### Modèle de Données

**Backend Django** : `api/models/agents.py` - `Mission`

```python
class Mission(models.Model):
    id = UUIDField(primary_key=True)
    titre = CharField(max_length=200)
    description = TextField()
    
    # Agent assigné
    agent = ForeignKey(Agent, related_name='missions')
    
    # Dates
    date_debut = DateTimeField()
    date_fin = DateTimeField(blank=True, null=True)
    date_creation = DateTimeField(auto_now_add=True)
    
    # Statut
    statut = CharField(choices=STATUT_CHOICES, default='EN_ATTENTE')
    # EN_ATTENTE, EN_COURS, TERMINEE, ANNULEE
    
    # Localisation
    lieu = CharField(max_length=200)
    latitude = DecimalField(max_digits=9, decimal_places=6)
    longitude = DecimalField(max_digits=9, decimal_places=6)
    
    # Résultats
    resultat = TextField(blank=True, null=True)
    notes = TextField(blank=True, null=True)
```

**Frontend TypeScript** :
```typescript
interface Mission {
  id: string;
  titre: string;
  description: string;
  priorite: 'faible' | 'moyenne' | 'elevee' | 'urgente';
  localisation: {
    lat: number;
    lng: number;
    address: string;
  };
  statut: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  completedAt?: string;
  alertId?: string;  // Si liée à une alerte
}
```

### Fonctionnalités

#### 1. Recevoir des Missions

**Écran** : `MissionsScreen.tsx` (à venir)

**Processus** :
1. Contrôleur assigne une mission via le portail web
2. Agent reçoit une notification push
3. Mission visible dans la liste des missions
4. Agent peut accepter ou consulter les détails

**Endpoint** :
```
GET /api/agents/{id}/missions/
Authorization: Bearer {token}
Query params: ?statut=assigned

Réponse:
{
  "missions": [
    {
      "id": "uuid",
      "titre": "Intervention vol de véhicule",
      "description": "Intervenir sur un vol de véhicule signalé...",
      "priorite": "urgente",
      "localisation": {
        "lat": 14.7000,
        "lng": -17.4500,
        "address": "Marché Sandaga, Dakar"
      },
      "statut": "assigned",
      "assignedAt": "2024-12-01T10:30:00Z",
      "alertId": "uuid"
    }
  ],
  "total": 3
}
```

#### 2. Mettre à Jour le Statut d'une Mission

**Actions** :
- **Accepter** : `assigned` → `in_progress`
- **Terminer** : `in_progress` → `completed`
- **Annuler** : `assigned` → `cancelled`

**Endpoint** :
```
PATCH /api/missions/{id}/statut/
Authorization: Bearer {token}
Content-Type: application/json

{
  "statut": "in_progress",
  "notes": "Mission acceptée, en route vers le lieu"
}

Réponse:
{
  "success": true,
  "mission": {
    "id": "uuid",
    "statut": "in_progress",
    "notes": "Mission acceptée, en route vers le lieu"
  },
  "statistiques": {
    "missions_completes": 57  // Incrémenté si terminée
  }
}
```

---

## 📊 Gestion du Profil Professionnel

### Fonctionnalités

#### 1. Consulter le Profil

**Écran** : `ProfileScreen.tsx`

**Informations affichées** :
- **Personnelles** :
  - CNI
  - Email
  - Téléphone
- **Professionnelles** :
  - Corps (Police/Gendarmerie/Pompiers)
  - Matricule
  - Grade
  - Brigade
- **Statistiques** :
  - Vérifications effectuées
  - Alertes créées
  - Arrestations effectuées
  - Missions complétées

**Endpoint** :
```
GET /api/agents/{id}/
Authorization: Bearer {token}

Réponse:
{
  "id": "uuid",
  "matricule": "POL-2020-001234",
  "type_force": "POLICE_NATIONALE",
  "grade_police": "GARDIEN_PAIX",
  "unite_affectation": "Commissariat Central Dakar",
  "statut": "EN_SERVICE",
  "citoyen": {
    "id": "uuid",
    "numero_cni": "1995032512345",
    "nom": "SARR",
    "prenom": "Mamadou",
    "contact": {
      "email": "mamadou.sarr@police.sn",
      "telephone_principal": "+221775551234"
    }
  },
  "statistiques": {
    "verifications_effectuees": 145,
    "alertes_creees": 23,
    "arrestations": 7,
    "missions_completes": 56
  }
}
```

---

## 🎖️ Hiérarchie et Grades

### Types de Forces

#### 1. Police Nationale

**Grades** :
- Gardien de la Paix
- Brigadier
- Brigadier-Chef
- Major
- Major-Chef
- Lieutenant
- Capitaine
- Commandant
- Lieutenant-Colonel
- Colonel
- Général de Brigade
- Général de Division

**Matricule** : Format `POL-AAAA-NNNNNN`
- POL : Code Police
- AAAA : Année d'entrée en service
- NNNNNN : Numéro séquentiel

**Écoles** :
- **ENP** (École Nationale de Police) : Formation sous-officiers (12 mois)
- **ENOP** (École Nationale des Officiers de Police) : Formation officiers (24 mois)

#### 2. Gendarmerie Nationale

**Grades** :
- Gendarme
- Gendarme-Chef
- Maréchal des Logis
- Maréchal des Logis-Chef
- Adjudant
- Adjudant-Chef
- Major
- Lieutenant
- Capitaine
- Chef d'Escadron
- Lieutenant-Colonel
- Colonel
- Général de Brigade
- Général de Division

**Matricule** : Format `GEN-AAAA-NNNNNN`

**Écoles** :
- **École de Gendarmerie de Ouakam** : Formation gendarmes (12-18 mois)
- **EOGN** (École des Officiers de la Gendarmerie) : Formation officiers (24 mois)

#### 3. Sapeurs-Pompiers

**Grades** :
- Sapeur
- Sapeur-Chef
- Caporal
- Caporal-Chef
- Sergent
- Sergent-Chef
- Adjudant
- Adjudant-Chef
- Major
- Lieutenant
- Capitaine
- Commandant
- Lieutenant-Colonel
- Colonel

**Matricule** : Format `POM-AAAA-NNNNNN`

**École** :
- **ENSP** (École Nationale des Sapeurs-Pompiers)

### Catégories de Grades

**Backend** : `api/models/enums.py`

```python
class CategorieGrade(models.TextChoices):
    HOMME_DU_RANG = 'HOMME_DU_RANG', 'Homme du Rang'
    SOUS_OFFICIER = 'SOUS_OFFICIER', 'Sous-Officier'
    OFFICIER_SUBALTERNE = 'OFFICIER_SUBALTERNE', 'Officier Subalterne'
    OFFICIER_SUPERIEUR = 'OFFICIER_SUPERIEUR', 'Officier Supérieur'
    OFFICIER_GENERAL = 'OFFICIER_GENERAL', 'Officier Général'
    HAUT_OFFICIER = 'HAUT_OFFICIER', 'Haut Officier'
    HAUT_COMMANDEMENT = 'HAUT_COMMANDEMENT', 'Haut Commandement'
    INCONNU = 'INCONNU', 'Inconnu'
```

**Méthodes Agent** :
```python
@property
def niveau_hierarchique(self):
    """Retourne le niveau hiérarchique du grade"""
    # Utilise HIERARCHIE_POLICE, HIERARCHIE_GENDARMERIE, HIERARCHIE_POMPIERS

@property
def categorie_grade(self):
    """Retourne la catégorie du grade"""
    # Retourne CategorieGrade selon le niveau

def est_grade_superieur(self, autre_agent):
    """Vérifie si cet agent a un grade supérieur"""

def peut_commander(self, autre_agent):
    """Vérifie si cet agent peut commander un autre agent"""
```

---

## 🏢 Gestion des Brigades

### Modèle de Données

**TypeScript** (système d'authentification) :
```typescript
interface Brigade {
  id: string;
  nom: string;                    // Ex: "Commissariat Central Dakar"
  code: string;                   // Ex: "CC-DK-001"
  typeForce: TypeForceOrdre;
  
  // Localisation
  region: RegionSenegal;
  departement: DepartementSenegal;
  commune: string;
  adresse: string;
  coordonneesGPS: {
    latitude: number;
    longitude: number;
  };
  
  // Supervision
  superviseur: {
    utilisateurId: string;
    nom: string;
    prenom: string;
    grade: string;
    matricule: string;
  };
  
  // Agents
  nombreAgents: number;
  agentsIds: string[];
  
  // Équipes/Patrouilles
  equipes?: Array<{
    id: string;
    nom: string;                  // Ex: "Patrouille A"
    chefEquipeId: string;
    membresIds: string[];
    horaire?: string;
  }>;
  
  // Statistiques
  statistiques?: {
    verificationsEffectuees: number;
    alertesTraitees: number;
    arrestations: number;
    missionsCompletes: number;
  };
}
```

### Structure Hiérarchique

```
Commissariat Central Dakar
│
├── Superviseur (Commandant FALL)
│   │
│   ├── Patrouille A
│   │   ├── Chef (Brigadier DIOP)
│   │   ├── Agent NDIAYE
│   │   ├── Agent SARR
│   │   └── Agent BA
│   │
│   ├── Patrouille B
│   │   ├── Chef (Brigadier SECK)
│   │   ├── Agent GUEYE
│   │   └── Agent MBAYE
│   │
│   └── Service Administratif
│       └── ...
```

---

## 📄 Comptes Rendus

### Modèle de Données

**TypeScript** (système d'authentification) :
```typescript
interface CompteRendu {
  id: string;
  numeroReference: string;        // Ex: "CR-2024-12-001234"
  
  // Émetteur (Agent)
  agentId: string;
  agentNom: string;
  agentPrenom: string;
  agentMatricule: string;
  brigadeId: string;
  
  // Destinataire (Supérieur)
  destinataireId: string;
  destinataireNom: string;
  destinataireGrade: string;
  
  // Type
  type: 'QUOTIDIEN' | 'INCIDENT' | 'MISSION' | 'PERIODIQUE' | 'EXCEPTIONNEL';
  
  // Période
  dateDebut: Date;
  dateFin: Date;
  
  // Contenu
  titre: string;
  description: string;
  
  // Activités
  activites?: Array<{
    type: 'VERIFICATION' | 'ALERTE' | 'ARRESTATION' | 'MISSION' | 'PATROUILLE' | 'AUTRE';
    description: string;
    date: Date;
    lieu?: string;
    resultat?: string;
  }>;
  
  // Statistiques
  statistiques?: {
    verificationsEffectuees: number;
    alertesTraitees: number;
    arrestations: number;
    missionsCompletes: number;
    heuresService: number;
    kilometresParcourus?: number;
  };
  
  // Observations
  observations?: string;
  recommandations?: string;
  
  // Statut
  statut: 'EN_ATTENTE' | 'VU' | 'VALIDE' | 'REJETE' | 'COMPLEMENTAIRE_REQUIS';
  dateEnvoi: Date;
  dateValidation?: Date;
}
```

### Fonctionnalités

#### 1. Créer un Compte Rendu

**Processus** :
1. Agent ouvre la section "Comptes Rendus"
2. Clic sur "Nouveau compte rendu"
3. Formulaire :
   - Type (Quotidien/Incident/Mission/...)
   - Période (date début/fin)
   - Titre
   - Description
   - Activités (liste)
   - Statistiques
   - Observations
   - Recommandations
4. Sélection du destinataire (Brigadier/Superviseur)
5. Envoi

**Endpoint** :
```
POST /api/comptes-rendus/
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "QUOTIDIEN",
  "dateDebut": "2024-12-01T08:00:00Z",
  "dateFin": "2024-12-01T16:00:00Z",
  "titre": "Rapport de service - Patrouille A",
  "description": "Patrouille de jour dans le secteur Plateau-Médina.",
  "activites": [
    {
      "type": "VERIFICATION",
      "description": "Contrôle d'identité - 15 personnes vérifiées",
      "date": "2024-12-01T10:30:00Z",
      "lieu": "Avenue Pompidou",
      "resultat": "Aucune anomalie"
    }
  ],
  "statistiques": {
    "verificationsEffectuees": 15,
    "alertesTraitees": 1,
    "arrestations": 1,
    "heuresService": 8
  },
  "observations": "Augmentation de l'activité de pickpockets...",
  "recommandations": "Renforcer la patrouille...",
  "destinataireId": "uuid"
}

Réponse:
{
  "success": true,
  "compteRendu": {
    "id": "uuid",
    "numeroReference": "CR-2024-12-001234",
    "statut": "EN_ATTENTE",
    "dateEnvoi": "2024-12-01T16:15:00Z"
  }
}
```

#### 2. Consulter l'Historique des Comptes Rendus

**Endpoint** :
```
GET /api/comptes-rendus/agent/{agentId}/
Authorization: Bearer {token}

Réponse:
{
  "comptesRendus": [
    {
      "id": "uuid",
      "numeroReference": "CR-2024-12-001234",
      "type": "QUOTIDIEN",
      "statut": "VALIDE",
      "dateEnvoi": "2024-12-01T16:15:00Z",
      "dateValidation": "2024-12-01T17:00:00Z",
      "destinataire": "Brigadier DIOP"
    }
  ],
  "total": 89
}
```

---

## 🔐 Permissions et Limitations

### ✅ Peut faire

- Vérifier l'identité de n'importe quel citoyen (CNI/Matricule/Photo)
- Consulter les informations complètes des citoyens
- Créer et traiter des alertes
- Recevoir et exécuter des missions
- Mettre à jour sa position GPS
- Enregistrer des vérifications
- Créer des amendes
- Demander des arrestations (si individu recherché)
- Activer/désactiver son service
- Consulter ses propres statistiques
- Envoyer des comptes rendus à son supérieur
- **Tout ce qu'un CITOYEN peut faire** (accès app citoyen)

### ❌ Ne peut pas faire

- Modifier les informations des citoyens
- Supprimer des données
- Accéder aux informations des autres agents (sauf si supérieur hiérarchique)
- Assigner des missions à d'autres agents (réservé aux contrôleurs/superviseurs)
- Modifier les données biométriques
- Consulter l'historique d'autres agents (sauf si superviseur)
- Accéder au portail de contrôle web (sauf si superviseur)

---

## 📊 Modèles Backend Complets

### Modèle Agent (Django)

**Fichier** : `backend/api/models/agents.py`

**Relations** :
- `Citoyen` (ForeignKey) - Lien vers profil citoyen
- `EcoleFormation` (ForeignKey) - École de formation
- `Mission` (ForeignKey via related_name) - Missions assignées

**Champs importants** :
```python
# Identification
matricule = CharField(max_length=50, unique=True)  # POL-2020-001234
type_force = CharField(choices=TypeForceOrdre.choices)

# Grade (selon type de force)
grade_police = CharField(choices=GradePolice.choices)
grade_gendarmerie = CharField(choices=GradeGendarmerie.choices)
grade_pompiers = CharField(choices=GradePompiers.choices)

# Affectation
unite_affectation = CharField(max_length=200)  # Brigade
poste = CharField(max_length=200)
date_entree_service = DateField()

# Statut
statut = CharField(choices=STATUT_CHOICES, default='ACTIF')

# Position GPS
position_latitude = DecimalField(max_digits=9, decimal_places=6)
position_longitude = DecimalField(max_digits=9, decimal_places=6)
position_timestamp = DateTimeField()

# Statistiques
verifications_effectuees = IntegerField(default=0)
alertes_creees = IntegerField(default=0)
arrestations = IntegerField(default=0)
missions_completes = IntegerField(default=0)
```

**Propriétés** :
```python
@property
def grade(self):
    """Retourne le grade selon le type de force"""

@property
def niveau_hierarchique(self):
    """Retourne le niveau hiérarchique du grade"""

@property
def categorie_grade(self):
    """Retourne la catégorie du grade"""

def est_grade_superieur(self, autre_agent):
    """Vérifie si cet agent a un grade supérieur"""

def peut_commander(self, autre_agent):
    """Vérifie si cet agent peut commander un autre agent"""
```

### Modèle Mission (Django)

**Fichier** : `backend/api/models/agents.py`

```python
class Mission(models.Model):
    id = UUIDField(primary_key=True)
    titre = CharField(max_length=200)
    description = TextField()
    
    # Agent assigné
    agent = ForeignKey(Agent, related_name='missions')
    
    # Dates
    date_debut = DateTimeField()
    date_fin = DateTimeField(blank=True, null=True)
    date_creation = DateTimeField(auto_now_add=True)
    
    # Statut
    statut = CharField(choices=STATUT_CHOICES, default='EN_ATTENTE')
    # EN_ATTENTE, EN_COURS, TERMINEE, ANNULEE
    
    # Localisation
    lieu = CharField(max_length=200)
    latitude = DecimalField(max_digits=9, decimal_places=6)
    longitude = DecimalField(max_digits=9, decimal_places=6)
    
    # Résultats
    resultat = TextField(blank=True, null=True)
    notes = TextField(blank=True, null=True)
```

---

## 🔗 Endpoints API Complets

### Authentification

```
POST   /api/auth/register/agent/etape1      - Inscription étape 1 (avec matricule)
POST   /api/auth/register/agent/etape2      - Inscription étape 2
POST   /api/auth/register/agent/etape3       - Inscription étape 3
POST   /api/auth/login                       - Connexion agent
POST   /api/auth/token/refresh/              - Rafraîchir token
POST   /api/auth/logout                      - Déconnexion
```

### Service

```
PATCH  /api/agents/{id}/service/             - Activer/désactiver service
POST   /api/agents/{id}/position/            - Mettre à jour position GPS
GET    /api/agents/{id}/                     - Consulter profil agent
```

### Vérification Identité

```
POST   /api/biometrie/verifier-empreinte/    - Vérification 1:1 par empreinte
POST   /api/biometrie/identifier-personne/    - Identification 1:N par empreinte
POST   /api/biometrie/verifier-faciale/       - Vérification par reconnaissance faciale
POST   /api/verification/valider-cni/         - Valider format CNI (13 chiffres)
POST   /api/verification/valider-matricule/   - Valider format matricule véhicule
GET    /api/citoyens/{id}/                    - Consulter un citoyen
GET    /api/citoyens/search/?q={query}        - Rechercher un citoyen
POST   /api/agents/{id}/verifications/        - Enregistrer une vérification
```

### Alertes

```
GET    /api/alertes/                          - Liste des alertes
POST   /api/alertes/                          - Créer une alerte
GET    /api/alertes/{id}/                     - Détails d'une alerte
PATCH  /api/alertes/{id}/traiter/             - Traiter une alerte
```

### Missions

```
GET    /api/agents/{id}/missions/             - Liste des missions
GET    /api/missions/{id}/                    - Détails d'une mission
PATCH  /api/missions/{id}/statut/             - Mettre à jour le statut
```

### Comptes Rendus

```
POST   /api/comptes-rendus/                   - Créer un compte rendu
GET    /api/comptes-rendus/agent/{agentId}/   - Historique comptes rendus
GET    /api/comptes-rendus/{id}/               - Détails d'un compte rendu
```

### Gemini AI (Analyse photo)

```
POST   /api/gemini/chat/                      - Chat avec IA
POST   /api/gemini/analyze-prestation/        - Analyser une prestation
```

### Images

```
POST   /api/images/upload-photo/               - Uploader une photo
POST   /api/images/upload-signature/          - Uploader une signature
POST   /api/images/validate/                  - Valider une image
```

---

## 📱 Interfaces Utilisateur

### Écran d'Accueil

**Fichier** : `agent/src/screens/HomeScreen.tsx`

**Fonctionnalités** :
- Toggle service (En Service / Hors Service)
- Badge de statut (vert/gris)
- Démarrage automatique GPS tracking
- Statistiques rapides
- Accès rapide aux vérifications

### Écran Vérification

**Fichier** : `agent/src/screens/VerificationScreen.tsx`

**Composants** :
- `VerificationMethodSelector.tsx` - Sélection méthode (CNI/Matricule/Photo)
- `IndividuCard.tsx` - Affichage résultats avec badges
- `CameraCapture.tsx` - Capture photo ou galerie

**Méthodes** :
1. **Par CNI** - Saisie numéro CNI
2. **Par Matricule** - Saisie plaque véhicule
3. **Par Photo** - Reconnaissance faciale IA

### Écran Alertes

**Fichier** : `agent/src/screens/AlertsScreen.tsx`

**Composants** :
- `AlertCard.tsx` - Carte d'alerte avec calcul distance
- Rafraîchissement automatique (5 secondes)
- Notifications sonores et vibrations

**Utilitaires** :
- `location.ts` - GPS tracking, calcul distance (formule Haversine)
- `imageAnalysis.ts` - Analyse photo IA (mode démo)

### Écran Profil

**Fichier** : `agent/src/screens/ProfileScreen.tsx`

**Affichage** :
- Informations personnelles
- Informations professionnelles
- Statistiques d'activité
- Bouton déconnexion

---

## 🔄 Flux de Données

### Inscription Agent Complète

```
1. ÉTAPE 1: Informations de base + Matricule
   → POST /api/auth/register/agent/etape1
   → Vérification ANCEC
   → Vérification Agent (matricule)
   → ✅ Étape 1 validée

2. ÉTAPE 2: Authentification
   → POST /functions/v1/send-whatsapp (OTP)
   → POST /api/auth/register/agent/etape2
   → Validation OTP
   → Génération numéro unique (AGT-2024-123456)
   → ✅ Étape 2 validée

3. ÉTAPE 3: Biométrie
   → POST /api/images/upload-photo/
   → POST /api/biometrie/enregistrer-empreinte/
   → POST /api/auth/register/agent/etape3
   → Création compte utilisateur
   → Rôles: [CITOYEN, AGENT_TERRAIN]
   → ✅ Inscription complète
```

### Vérification d'Identité

```
1. Agent sélectionne méthode (CNI/Matricule/Photo)
2. Saisie/capture des données
3. Validation format (backend)
4. Recherche dans base de données
5. Affichage résultats complets
6. POST /api/agents/{id}/verifications/
7. Incrémentation statistiques
```

### Gestion Service

```
1. Agent active toggle service
2. PATCH /api/agents/{id}/service/
3. Démarrage GPS tracking automatique
4. POST /api/agents/{id}/position/ (toutes les 30s)
5. Statut sauvegardé localement
```

---

## 📊 Statistiques et Métriques

### Données Trackées

- **verifications_effectuees** : Nombre de vérifications d'identité effectuées
- **alertes_creees** : Nombre d'alertes créées
- **arrestations** : Nombre d'arrestations effectuées
- **missions_completes** : Nombre de missions complétées
- **comptes_rendus_envoyes** : Nombre de comptes rendus envoyés

### Mise à Jour Automatique

Les statistiques sont **automatiquement incrémentées** lors des actions :
- Vérification effectuée → `verifications_effectuees++`
- Alerte créée → `alertes_creees++`
- Arrestation demandée → `arrestations++`
- Mission terminée → `missions_completes++`

---

## 🔗 Références

- [Documentation Backend](../backend/docs/README.md)
- [Intégration Organismes Officiels](../backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)
- [Documentation Citoyen](./CITOYEN.md)
- [Responsabilités des Acteurs](./RESPONSABILITES_ACTEURS.md)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Citizen Portal

