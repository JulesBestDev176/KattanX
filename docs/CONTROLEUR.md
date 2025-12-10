# 🎛️ Documentation Contrôleur - Citizen Portal

## Vue d'ensemble

Ce document décrit en détail toutes les fonctionnalités, modèles de données, processus et responsabilités des **Contrôleurs et Superviseurs** dans le système Citizen Portal.

---

## 🖥️ Portail Web de Contrôle

### Technologie
- **Framework** : React 19.2.0
- **Build Tool** : Vite 7.2.4
- **Routing** : React Router DOM 7.9.6
- **TypeScript** : 5.9.3
- **Icônes** : Lucide React 0.555.0
- **Base URL API** : `http://localhost:8000/api` (Django backend)

### Structure des Pages

```
control-portal/src/pages/
├── Dashboard.tsx              - Vue d'ensemble (stats + carte + alertes)
├── Surveillance.tsx            - Surveillance vidéo + analyse IA
├── Alerts.tsx                  - Gestion des alertes
└── Agents.tsx                  - Gestion des agents + missions
```

### Structure des Composants

```
control-portal/src/components/
├── layout/
│   ├── Layout.tsx              - Structure principale
│   ├── Sidebar.tsx             - Navigation latérale
│   └── Header.tsx               - En-tête (recherche + notifications + profil)
├── dashboard/
│   ├── StatsCard.tsx            - Cartes de statistiques
│   └── AlertsList.tsx           - Liste alertes récentes
├── agents/
│   ├── MapView.tsx             - Carte interactive agents
│   └── AssignMissionModal.tsx  - Formulaire assignation mission
└── surveillance/
    ├── VideoGrid.tsx           - Grille flux vidéo
    └── AIAnalysisPanel.tsx      - Panneau analyse IA
```

---

## 🔐 Authentification

### Connexion Contrôleur

**Interface** : Page de connexion (à implémenter)

**Méthodes de connexion** :
1. **Email + Mot de passe**
2. **Numéro unique + Mot de passe**

**Rôles Contrôleur** :
- `SUPERVISEUR_BRIGADE` - Chef de brigade (accès portail vue brigade)
- `CONTROLEUR_REGIONAL` - Contrôleur régional (accès portail vue région)
- `CONTROLEUR_NATIONAL` - Contrôleur national (accès portail complet)
- `ADMIN_FONCTIONNEL` - Administrateur métier
- `ADMIN_SYSTEME` - Administrateur technique (accès total)

**Endpoint** :
```
POST /api/auth/login
{
  "identifiant": "email@example.com" | "CTRL-2024-001234",
  "motDePasse": "********",
  "typeUtilisateur": "CONTROLEUR"
}

Réponse:
{
  "success": true,
  "utilisateur": {
    "id": "USER-123",
    "numeroIdentificationUnique": "CTRL-2024-001234",
    "nom": "FALL",
    "prenom": "Ibrahim",
    "roles": ["CITOYEN", "SUPERVISEUR_BRIGADE"],
    "infoControleur": {
      "niveauControle": "BRIGADE",
      "bureauNom": "Commissariat Central Dakar",
      "zoneResponsabilite": {
        "type": "BRIGADE",
        "brigadeIds": ["BRG-DK-001"]
      }
    }
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

## 📊 Dashboard et Surveillance en Temps Réel

### Modèle de Données

**Frontend TypeScript** : `control-portal/src/types/index.ts`

```typescript
interface Alert {
  id: string;
  type: 'accident' | 'fire' | 'theft' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  status: 'new' | 'investigating' | 'resolved';
  timestamp: string;
  source: 'citizen' | 'camera' | 'sensor';
}

interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  specialty: string;
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  thumbnailUrl: string;
  detectedEvents: {
    type: string;
    confidence: number;
    timestamp: string;
  }[];
}
```

### Fonctionnalités

#### 1. Métriques en Temps Réel

**Écran** : `Dashboard.tsx`

**Composant** : `StatsCard.tsx`

**4 Cartes de Statistiques** :

1. **Alertes actives**
   - Valeur : 12
   - Tendance : "+2 depuis la dernière heure" (rouge si hausse)
   - Icône : `AlertTriangle`
   - Couleur : `var(--destructive)`

2. **Agents actifs**
   - Valeur : 45
   - Tendance : "85% déployés" (vert si positif)
   - Icône : `Users`
   - Couleur : `var(--secondary)`

3. **Caméras en ligne**
   - Valeur : 128/130
   - Tendance : "98% disponibilité" (vert si positif)
   - Icône : `Video`
   - Couleur : `var(--primary)`

4. **Détections IA**
   - Valeur : 24
   - Tendance : "Confiance élevée" (vert si positif)
   - Icône : `Activity`
   - Couleur : `#8b5cf6`

**Code couleur tendances** :
- Vert : Hausse positive (ex: plus d'agents actifs)
- Rouge : Hausse négative (ex: plus d'alertes)

**Endpoint** :
```
GET /api/dashboard/stats/
Authorization: Bearer {token}

Réponse:
{
  "alertesActives": 12,
  "tendanceAlertes": {
    "valeur": 2,
    "direction": "up",
    "message": "+2 depuis la dernière heure"
  },
  "agentsActifs": 45,
  "agentsTotal": 53,
  "pourcentageDeployes": 85,
  "camerasEnLigne": 128,
  "camerasTotal": 130,
  "pourcentageDisponibilite": 98,
  "detectionsIA": 24,
  "detectionsConfianceElevee": 18
}
```

#### 2. Carte Interactive en Direct

**Composant** : Carte avec marqueurs d'incidents

**Fonctionnalités** :
- Affichage de la carte de Dakar (coordonnées par défaut : ~14.6928, -17.4467)
- Marqueurs d'incidents animés (animation pulse)
- Position des agents en temps réel
- Position des alertes actives
- Zoom et navigation

**Marqueurs** :
- 🔴 **Incidents/Alertes** - Marqueurs rouges animés
- 🔵 **Agents disponibles** - Marqueurs bleus
- 🟡 **Agents occupés** - Marqueurs jaunes
- ⚫ **Agents hors ligne** - Marqueurs gris

**Endpoint** :
```
GET /api/dashboard/map-data/
Authorization: Bearer {token}

Réponse:
{
  "incidents": [
    {
      "id": "uuid",
      "type": "accident",
      "location": {
        "lat": 14.7000,
        "lng": -17.4500
      },
      "severity": "high"
    }
  ],
  "agents": [
    {
      "id": "uuid",
      "name": "Agent SARR",
      "status": "available",
      "location": {
        "lat": 14.6928,
        "lng": -17.4467
      }
    }
  ]
}
```

#### 3. Panneau des Alertes Récentes

**Composant** : `AlertsList.tsx`

**Affichage** :
- Liste des 3 alertes les plus récentes
- Type d'alerte avec icône
- Description (tronquée)
- Localisation
- Horodatage
- Badge de sévérité
- Lien vers la page Alertes complète

**Endpoint** :
```
GET /api/dashboard/alertes-recentes/
Authorization: Bearer {token}
Query params: ?limit=3

Réponse:
{
  "alertes": [
    {
      "id": "uuid",
      "type": "accident",
      "severity": "high",
      "description": "Accident de la circulation...",
      "location": {
        "address": "Avenue Pompidou, Dakar"
      },
      "timestamp": "2024-12-01T10:30:00Z"
    }
  ]
}
```

---

## 👥 Gestion des Agents

### Modèle de Données

**Backend Django** : `api/models/agents.py` - `Agent`

**Frontend TypeScript** :
```typescript
interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  specialty: string;
  // Détails complets (dans modal)
  matricule?: string;
  grade?: string;
  brigade?: string;
  email?: string;
  telephone?: string;
}
```

### Fonctionnalités

#### 1. Liste Complète des Agents

**Écran** : `Agents.tsx`

**Affichage** :
- Grille de cartes agents (8 agents actuellement)
- Avatar et informations de base
- Badge de statut (Disponible/Occupé/Hors ligne)
- Spécialité
- Boutons d'action :
  - "Voir détails" (modal)
  - "Voir sur carte" (carte interactive)
  - "Assigner mission" (modal formulaire)

**Filtres** :
- **Barre de recherche** : Par nom ou spécialité
- **Sélecteur de statut** :
  - Tous
  - Disponible
  - Occupé
  - Hors ligne

**Statistiques** :
- Total des agents : 8
- Agents disponibles : 5
- Agents occupés : 2
- Agents hors ligne : 1

**Endpoint** :
```
GET /api/agents/
Authorization: Bearer {token}
Query params: ?status=available&search=mamadou

Réponse:
{
  "agents": [
    {
      "id": "uuid",
      "matricule": "POL-2020-001234",
      "nom": "SARR",
      "prenom": "Mamadou",
      "type_force": "POLICE_NATIONALE",
      "grade_police": "GARDIEN_PAIX",
      "unite_affectation": "Commissariat Central Dakar",
      "statut": "EN_SERVICE",
      "position": {
        "latitude": 14.6928,
        "longitude": -17.4467,
        "timestamp": "2024-12-01T10:30:00Z"
      },
      "statistiques": {
        "verifications_effectuees": 145,
        "alertes_creees": 23,
        "arrestations": 7,
        "missions_completes": 56
      }
    }
  ],
  "statistiques": {
    "total": 8,
    "disponibles": 5,
    "occupes": 2,
    "hors_ligne": 1
  }
}
```

#### 2. Détails d'un Agent (Modal)

**Composant** : Modal détails agent

**Informations affichées** :
- Nom complet
- Matricule
- Statut (avec badge coloré)
- Spécialité
- Localisation GPS (coordonnées)
- ID de l'agent
- Statistiques :
  - Vérifications effectuées
  - Alertes créées
  - Arrestations
  - Missions complétées

**Endpoint** :
```
GET /api/agents/{id}/
Authorization: Bearer {token}

Réponse:
{
  "id": "uuid",
  "matricule": "POL-2020-001234",
  "nom": "SARR",
  "prenom": "Mamadou",
  "type_force": "POLICE_NATIONALE",
  "grade_police": "GARDIEN_PAIX",
  "unite_affectation": "Commissariat Central Dakar",
  "statut": "EN_SERVICE",
  "position": {
    "latitude": 14.6928,
    "longitude": -17.4467,
    "timestamp": "2024-12-01T10:30:00Z",
    "adresse": "Avenue Léopold Sédar Senghor, Dakar"
  },
  "statistiques": {
    "verifications_effectuees": 145,
    "alertes_creees": 23,
    "arrestations": 7,
    "missions_completes": 56
  },
  "citoyen": {
    "email": "mamadou.sarr@police.sn",
    "contact": {
      "telephone_principal": "+221775551234"
    }
  }
}
```

#### 3. Carte Interactive des Agents

**Composant** : `MapView.tsx`

**Fonctionnalités** :
- Carte interactive avec tous les agents
- Marqueurs colorés selon le statut :
  - 🟢 **Disponible** (vert)
  - 🟡 **Occupé** (jaune)
  - ⚫ **Hors ligne** (gris)
- Légende avec code couleur
- Clic sur marqueur → Détails agent
- Zoom et navigation

**Endpoint** :
```
GET /api/agents/map/
Authorization: Bearer {token}

Réponse:
{
  "agents": [
    {
      "id": "uuid",
      "name": "Agent SARR",
      "status": "available",
      "location": {
        "lat": 14.6928,
        "lng": -17.4467
      },
      "specialty": "Police - Brigade de circulation"
    }
  ]
}
```

#### 4. Assignation de Missions

**Composant** : `AssignMissionModal.tsx`

**Formulaire complet** :

1. **Agent assigné** (affiché, non modifiable)
   - Nom de l'agent
   - Spécialité

2. **Lier à une alerte** (optionnel)
   - Dropdown de sélection d'alerte
   - Auto-remplissage des données si alerte sélectionnée :
     - Titre : "Intervention: [Type alerte]"
     - Description : Description de l'alerte
     - Localisation : Localisation de l'alerte
     - Priorité : Basée sur la sévérité de l'alerte

3. **Titre de la mission** (obligatoire)
   - Input texte

4. **Description** (obligatoire)
   - Textarea

5. **Priorité** (sélecteur)
   - Faible
   - Moyenne
   - Élevée
   - Urgente

6. **Localisation**
   - Latitude (input numérique)
   - Longitude (input numérique)
   - Adresse (input texte)
   - Checkbox : "Utiliser la position actuelle de l'agent"

7. **Boutons**
   - "Annuler"
   - "Assigner la mission"

**Processus** :
1. Contrôleur sélectionne un agent disponible
2. Clic sur "Assigner mission"
3. Modal s'ouvre avec formulaire
4. Optionnel : Sélection d'une alerte existante (auto-remplissage)
5. Remplissage des champs
6. Clic sur "Assigner"
7. Mission créée avec statut `assigned`
8. Statut de l'agent mis à jour → `busy` (Occupé)
9. Si alerte liée : Statut alerte → `investigating` (En investigation)

**Endpoint** :
```
POST /api/missions/
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentId": "uuid",
  "title": "Intervention vol de véhicule",
  "description": "Intervenir sur un vol de véhicule signalé au marché Sandaga...",
  "priority": "urgent",
  "location": {
    "lat": 14.7000,
    "lng": -17.4500,
    "address": "Marché Sandaga, Dakar"
  },
  "alertId": "uuid"  // Optionnel
}

Réponse:
{
  "success": true,
  "mission": {
    "id": "uuid",
    "agentId": "uuid",
    "agentName": "Agent SARR",
    "title": "Intervention vol de véhicule",
    "description": "Intervenir sur un vol...",
    "priority": "urgent",
    "status": "assigned",
    "assignedAt": "2024-12-01T10:30:00Z",
    "alertId": "uuid"
  },
  "agent": {
    "id": "uuid",
    "statut": "EN_MISSION"  // Mis à jour automatiquement
  },
  "alerte": {
    "id": "uuid",
    "status": "investigating"  // Mis à jour si liée
  }
}
```

---

## 🚨 Gestion des Alertes

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface Alert {
  id: string;
  type: 'accident' | 'fire' | 'theft' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  status: 'new' | 'investigating' | 'resolved';
  timestamp: string;
  source: 'citizen' | 'camera' | 'sensor';
}
```

### Fonctionnalités

#### 1. Liste Complète des Alertes

**Écran** : `Alerts.tsx`

**Affichage** :
- Grille de cartes d'alertes (6 alertes exemple)
- Icônes colorées selon le type :
  - 🚗 Accident
  - 🔥 Incendie
  - 🚨 Vol
  - 🏥 Médical
  - ⚠️ Autre
- Badges de sévérité :
  - 🔴 Critique
  - 🟠 Élevée
  - 🟡 Moyenne
  - 🟢 Faible
- Badges de statut :
  - 🆕 Nouvelle
  - 🔍 En investigation
  - ✅ Résolue
- Description (tronquée)
- Localisation
- Horodatage
- Bouton "Voir détails"

**Triple Filtrage** :

1. **Statut** (sélecteur) :
   - Toutes
   - Nouvelle
   - En investigation
   - Résolue

2. **Type** (sélecteur) :
   - Toutes
   - Accident
   - Incendie
   - Vol
   - Médical
   - Autre

3. **Sévérité** (sélecteur) :
   - Toutes
   - Critique
   - Élevée
   - Moyenne
   - Faible

**Barre de recherche** :
- Recherche en temps réel dans :
  - Descriptions
  - Localisations

**Statistiques** :
- Total : 6
- Nouvelles : 2
- En investigation : 3
- Résolues : 1

**Endpoint** :
```
GET /api/alertes/
Authorization: Bearer {token}
Query params: ?status=new&type=accident&severity=high&search=sandaga

Réponse:
{
  "alertes": [
    {
      "id": "uuid",
      "type": "accident",
      "severity": "high",
      "location": {
        "lat": 14.7000,
        "lng": -17.4500,
        "address": "Marché Sandaga, Dakar"
      },
      "description": "Accident de la circulation avec blessés...",
      "status": "new",
      "timestamp": "2024-12-01T10:30:00Z",
      "source": "citizen",
      "createdBy": {
        "id": "uuid",
        "name": "Citoyen FALL"
      }
    }
  ],
  "statistiques": {
    "total": 6,
    "nouvelles": 2,
    "en_investigation": 3,
    "resolues": 1
  }
}
```

#### 2. Détails d'une Alerte (Modal)

**Composant** : Modal détails alerte

**Informations affichées** :
- **Type** avec icône et couleur de sévérité
- **Description complète**
- **Localisation** :
  - Adresse
  - Coordonnées GPS (latitude, longitude)
- **Source** : citizen/camera/sensor
- **Horodatage complet** (date et heure)
- **ID de l'alerte**
- **Créateur** (si citoyen/agent)
- **Statut actuel**

**Boutons d'action** :
- "Marquer comme En investigation" (si statut = new)
- "Marquer comme Résolue" (si statut = investigating)
- "Assigner un agent" (lien vers page Agents)

**Endpoint** :
```
GET /api/alertes/{id}/
Authorization: Bearer {token}

Réponse:
{
  "id": "uuid",
  "type": "accident",
  "severity": "high",
  "location": {
    "lat": 14.7000,
    "lng": -17.4500,
    "address": "Marché Sandaga, Dakar"
  },
  "description": "Accident de la circulation avec blessés. Deux véhicules impliqués...",
  "status": "new",
  "timestamp": "2024-12-01T10:30:00Z",
  "source": "citizen",
  "createdBy": {
    "id": "uuid",
    "name": "Citoyen FALL Souleymane",
    "type": "citizen"
  },
  "images": [
    "https://storage.../alertes/..."
  ]
}
```

#### 3. Changer le Statut d'une Alerte

**Actions** :
- **Nouvelle** → "Marquer comme En investigation"
- **En investigation** → "Marquer comme Résolue"

**Endpoint** :
```
PATCH /api/alertes/{id}/statut/
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "investigating",
  "commentaire": "Agent assigné, intervention en cours"
}

Réponse:
{
  "success": true,
  "alerte": {
    "id": "uuid",
    "status": "investigating",
    "updatedAt": "2024-12-01T11:00:00Z"
  }
}
```

---

## 📹 Surveillance Vidéo et Analyse IA

### Modèle de Données

**Frontend TypeScript** :
```typescript
interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  thumbnailUrl: string;
  detectedEvents: {
    type: string;
    confidence: number;
    timestamp: string;
  }[];
}
```

### Fonctionnalités

#### 1. Grille de Flux Vidéo

**Écran** : `Surveillance.tsx`

**Composant** : `VideoGrid.tsx`

**Affichage** :
- Grille 2x3 de 6 flux caméra
- Chaque caméra affiche :
  - Flux vidéo en direct
  - Indicateur "EN DIRECT" avec animation clignotante
  - Nom de la caméra
  - Localisation
  - Statut (online/offline)
  - Badge si détections IA présentes

**Filtres** :
- Toutes
- Avec alertes
- Hors ligne

**Sélection** :
- Clic sur une caméra → Analyse IA détaillée dans le panneau latéral

**Endpoint** :
```
GET /api/cameras/
Authorization: Bearer {token}
Query params: ?status=online&has_detections=true

Réponse:
{
  "cameras": [
    {
      "id": "cam-01",
      "name": "Corniche Ouest - Zone A",
      "location": "Dakar, Corniche",
      "status": "online",
      "streamUrl": "rtsp://...",
      "thumbnailUrl": "https://storage.../thumbnails/...",
      "detectedEvents": [
        {
          "type": "Accident de la circulation",
          "confidence": 0.92,
          "timestamp": "2024-12-01T10:30:00Z"
        }
      ]
    }
  ],
  "total": 6,
  "online": 5,
  "offline": 1
}
```

#### 2. Analyse IA Détaillée

**Composant** : `AIAnalysisPanel.tsx`

**Affichage** :

1. **En-tête** :
   - Icône IA (Brain)
   - Titre "Analyse IA"
   - Nom de la caméra analysée

2. **Jauge de menace** :
   - Label : "Confiance de détection de menace"
   - Score : 94%
   - Barre de progression visuelle

3. **Liste des événements détectés** :
   - Type d'événement (ex: "Accident de la circulation")
   - Score de confiance (ex: 92%)
   - Horodatage
   - Icône d'alerte si confiance élevée

4. **Recommandations IA** :
   - Liste de recommandations automatiques
   - Exemple : "Envoyer l'unité de patrouille la plus proche"

5. **Boutons d'action** :
   - "Confirmer l'alerte" → Créer une alerte officielle
   - "Ignorer (Faux positif)" → Marquer comme faux positif

**Endpoint** :
```
GET /api/cameras/{id}/analysis/
Authorization: Bearer {token}

Réponse:
{
  "camera": {
    "id": "cam-01",
    "name": "Corniche Ouest - Zone A"
  },
  "analysis": {
    "threatLevel": 0.94,
    "detectedEvents": [
      {
        "type": "Accident de la circulation",
        "confidence": 0.92,
        "timestamp": "2024-12-01T10:30:00Z",
        "bbox": {
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 150
        }
      }
    ],
    "recommendations": [
      "Envoyer l'unité de patrouille la plus proche pour vérifier le secteur.",
      "Marquer les images pour examen médico-légal."
    ]
  }
}
```

#### 3. Confirmer une Détection IA

**Action** : "Confirmer l'alerte"

**Processus** :
1. Contrôleur consulte l'analyse IA
2. Clic sur "Confirmer l'alerte"
3. Création automatique d'une alerte officielle :
   - Type : Basé sur l'événement détecté
   - Sévérité : Basée sur le niveau de confiance
   - Localisation : Localisation de la caméra
   - Description : Type d'événement détecté
   - Source : "camera"
4. Alerte visible dans la liste des alertes
5. Notification aux agents disponibles

**Endpoint** :
```
POST /api/alertes/from-detection/
Authorization: Bearer {token}
Content-Type: application/json

{
  "cameraId": "cam-01",
  "detectionId": "uuid",
  "type": "accident",
  "severity": "high",
  "description": "Accident de la circulation détecté par IA",
  "confidence": 0.92
}

Réponse:
{
  "success": true,
  "alerte": {
    "id": "uuid",
    "type": "accident",
    "severity": "high",
    "status": "new",
    "source": "camera",
    "createdAt": "2024-12-01T10:30:00Z"
  }
}
```

#### 4. Ignorer une Détection IA

**Action** : "Ignorer (Faux positif)"

**Processus** :
1. Contrôleur consulte l'analyse IA
2. Clic sur "Ignorer"
3. Détection marquée comme faux positif
4. Pas de création d'alerte
5. Historique conservé pour amélioration du modèle IA

**Endpoint** :
```
POST /api/cameras/{id}/detections/{detectionId}/ignore/
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "faux_positif",
  "commentaire": "Foule normale, pas d'accident"
}

Réponse:
{
  "success": true,
  "detection": {
    "id": "uuid",
    "status": "ignored",
    "ignoredAt": "2024-12-01T10:30:00Z"
  }
}
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

### Fonctionnalités

#### 1. Consulter les Brigades

**Endpoint** :
```
GET /api/brigades/
Authorization: Bearer {token}
Query params: ?region=DAKAR&type_force=POLICE_NATIONALE

Réponse:
{
  "brigades": [
    {
      "id": "BRG-DK-001",
      "nom": "Commissariat Central Dakar",
      "code": "CC-DK-001",
      "typeForce": "POLICE_NATIONALE",
      "region": "DAKAR",
      "superviseur": {
        "utilisateurId": "uuid",
        "nom": "FALL",
        "prenom": "Ibrahim",
        "grade": "Commandant",
        "matricule": "POL-2015-001234"
      },
      "nombreAgents": 45,
      "statistiques": {
        "verificationsEffectuees": 5678,
        "alertesTraitees": 234,
        "arrestations": 89,
        "missionsCompletes": 456
      }
    }
  ]
}
```

#### 2. Consulter les Agents d'une Brigade

**Endpoint** :
```
GET /api/brigades/{id}/agents/
Authorization: Bearer {token}

Réponse:
{
  "brigade": {
    "id": "BRG-DK-001",
    "nom": "Commissariat Central Dakar"
  },
  "agents": [
    {
      "id": "uuid",
      "matricule": "POL-2020-001234",
      "nom": "SARR",
      "prenom": "Mamadou",
      "statut": "EN_SERVICE"
    }
  ],
  "total": 45
}
```

---

## 📄 Comptes Rendus

### Fonctionnalités

#### 1. Consulter les Comptes Rendus Reçus

**Endpoint** :
```
GET /api/comptes-rendus/superviseur/{superviseurId}/
Authorization: Bearer {token}
Query params: ?statut=EN_ATTENTE&type=QUOTIDIEN

Réponse:
{
  "comptesRendus": [
    {
      "id": "uuid",
      "numeroReference": "CR-2024-12-001234",
      "type": "QUOTIDIEN",
      "agent": {
        "id": "uuid",
        "nom": "NDIAYE",
        "prenom": "Amadou",
        "matricule": "POL-2022-005678"
      },
      "titre": "Rapport de service - Patrouille A",
      "statut": "EN_ATTENTE",
      "dateEnvoi": "2024-12-01T16:15:00Z"
    }
  ],
  "total": 12,
  "en_attente": 5,
  "valides": 7
}
```

#### 2. Valider un Compte Rendu

**Endpoint** :
```
PUT /api/comptes-rendus/{id}/valider/
Authorization: Bearer {token}
Content-Type: application/json

{
  "validation": true,
  "commentaire": "Compte rendu complet et détaillé. Bon travail.",
  "complementsRequis": null
}

Réponse:
{
  "success": true,
  "compteRendu": {
    "id": "uuid",
    "statut": "VALIDE",
    "dateValidation": "2024-12-01T17:00:00Z",
    "reponseSuperieur": {
      "date": "2024-12-01T17:00:00Z",
      "commentaire": "Compte rendu complet et détaillé. Bon travail.",
      "validation": true
    }
  }
}
```

#### 3. Demander des Compléments

**Endpoint** :
```
PUT /api/comptes-rendus/{id}/valider/
Authorization: Bearer {token}
Content-Type: application/json

{
  "validation": false,
  "commentaire": "Merci de préciser les détails de l'intervention au marché Sandaga.",
  "complementsRequis": "Détails intervention marché Sandaga"
}

Réponse:
{
  "success": true,
  "compteRendu": {
    "id": "uuid",
    "statut": "COMPLEMENTAIRE_REQUIS",
    "reponseSuperieur": {
      "complementsRequis": "Détails intervention marché Sandaga"
    }
  }
}
```

---

## 📊 Rapports et Statistiques

### Fonctionnalités

#### 1. Statistiques Régionales

**Endpoint** :
```
GET /api/statistiques/region/{regionId}/
Authorization: Bearer {token}
Query params: ?date_debut=2024-12-01&date_fin=2024-12-31

Réponse:
{
  "region": "DAKAR",
  "periode": {
    "debut": "2024-12-01",
    "fin": "2024-12-31"
  },
  "statistiques": {
    "brigades": 12,
    "agentsTotal": 450,
    "agentsActifs": 380,
    "verificationsTotal": 45678,
    "alertesTotal": 2345,
    "alertesTraitees": 2100,
    "arrestations": 456,
    "missionsCompletes": 3456
  },
  "tendances": {
    "verifications": {
      "evolution": "+15%",
      "direction": "up"
    },
    "alertes": {
      "evolution": "-5%",
      "direction": "down"
    }
  }
}
```

#### 2. Statistiques Nationales

**Endpoint** :
```
GET /api/statistiques/national/
Authorization: Bearer {token}
Query params: ?date_debut=2024-12-01&date_fin=2024-12-31

Réponse:
{
  "periode": {
    "debut": "2024-12-01",
    "fin": "2024-12-31"
  },
  "statistiques": {
    "regions": 14,
    "brigades": 156,
    "agentsTotal": 5678,
    "agentsActifs": 4567,
    "verificationsTotal": 456789,
    "alertesTotal": 23456,
    "arrestations": 5678,
    "missionsCompletes": 45678
  },
  "parRegion": [
    {
      "region": "DAKAR",
      "verifications": 45678,
      "alertes": 2345
    }
  ]
}
```

#### 3. Générer un Rapport

**Endpoint** :
```
POST /api/rapports/generer/
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "QUOTIDIEN" | "HEBDOMADAIRE" | "MENSUEL" | "ANNUEL",
  "periode": {
    "debut": "2024-12-01",
    "fin": "2024-12-31"
  },
  "niveau": "BRIGADE" | "REGIONAL" | "NATIONAL",
  "format": "PDF" | "EXCEL" | "JSON"
}

Réponse:
{
  "success": true,
  "rapport": {
    "id": "uuid",
    "type": "MENSUEL",
    "periode": {
      "debut": "2024-12-01",
      "fin": "2024-12-31"
    },
    "url": "https://storage.../rapports/rapport-2024-12.pdf",
    "dateGeneration": "2024-12-31T23:59:59Z"
  }
}
```

---

## 🔐 Permissions et Limitations

### ✅ Peut faire

- Accéder à toutes les données du système (selon niveau de contrôle)
- Consulter les informations de tous les citoyens et agents
- Assigner des missions aux agents
- Gérer les alertes et leur priorisation
- Accéder aux analyses IA et rapports
- Consulter la surveillance vidéo
- Valider les comptes rendus
- Générer des rapports
- Configurer le système (admin)

### ❌ Ne peut pas faire

- Modifier directement les données biométriques des citoyens (réservé ANCEC)
- Supprimer définitivement des données (audit requis)
- Modifier les grades des agents (réservé à l'administration)
- Accéder aux données sensibles sans autorisation
- Modifier les rôles des utilisateurs (réservé admin)

### Niveaux d'Accès

#### SUPERVISEUR_BRIGADE

**Peut** :
- Consulter tous les agents de sa brigade
- Assigner des missions aux agents de sa brigade
- Recevoir et valider les comptes rendus de sa brigade
- Consulter les statistiques de sa brigade
- Accéder au portail web (vue brigade uniquement)

**Ne peut pas** :
- Consulter les autres brigades
- Accéder aux données régionales/nationales

#### CONTROLEUR_REGIONAL

**Peut** :
- Consulter toutes les brigades de sa région
- Consulter les statistiques régionales
- Assigner des missions aux brigades
- Gérer les alertes de sa région
- Accéder à la surveillance vidéo régionale
- Analyser les données IA
- Consulter l'historique de tous les agents de la région

**Ne peut pas** :
- Accéder aux autres régions
- Modifier les données citoyens directement

#### CONTROLEUR_NATIONAL

**Peut** :
- Consulter toutes les régions
- Consulter les statistiques nationales
- Gérer les alertes nationales
- Générer des rapports nationaux
- Accéder à toute la surveillance vidéo
- Analyser les données IA au niveau national

**Ne peut pas** :
- Modifier directement les rôles des utilisateurs (réservé admin)

#### ADMIN_FONCTIONNEL

**Peut** :
- Gérer les utilisateurs (création, modification, suspension)
- Gérer les brigades
- Consulter les audits
- Consulter toutes les statistiques

**Ne peut pas** :
- Modifier la configuration technique du système

#### ADMIN_SYSTEME

**Peut** :
- **TOUT** (toutes les permissions)

---

## 🔗 Endpoints API Complets

### Authentification

```
POST   /api/auth/login                         - Connexion contrôleur
POST   /api/auth/token/refresh/                - Rafraîchir token
POST   /api/auth/logout                        - Déconnexion
```

### Dashboard

```
GET    /api/dashboard/stats/                  - Statistiques temps réel
GET    /api/dashboard/map-data/                - Données pour la carte
GET    /api/dashboard/alertes-recentes/         - Alertes récentes
```

### Agents

```
GET    /api/agents/                            - Liste des agents
GET    /api/agents/{id}/                       - Détails d'un agent
GET    /api/agents/map/                        - Agents pour carte
GET    /api/agents/search/                      - Rechercher agents
PATCH  /api/agents/{id}/statut/                - Modifier statut agent
GET    /api/agents/{id}/historique/            - Historique agent
```

### Missions

```
GET    /api/missions/                          - Liste des missions
POST   /api/missions/                          - Créer une mission
GET    /api/missions/{id}/                     - Détails d'une mission
PATCH  /api/missions/{id}/statut/              - Mettre à jour statut
GET    /api/missions/agent/{agentId}/          - Missions d'un agent
```

### Alertes

```
GET    /api/alertes/                           - Liste des alertes
GET    /api/alertes/{id}/                      - Détails d'une alerte
POST   /api/alertes/                           - Créer une alerte
PATCH  /api/alertes/{id}/statut/               - Changer statut
POST   /api/alertes/from-detection/            - Créer alerte depuis détection IA
GET    /api/alertes/filter/                    - Filtrer alertes
```

### Surveillance

```
GET    /api/cameras/                            - Liste des caméras
GET    /api/cameras/{id}/                       - Détails d'une caméra
GET    /api/cameras/{id}/stream/                - Flux vidéo
GET    /api/cameras/{id}/analysis/              - Analyse IA
GET    /api/cameras/{id}/detections/            - Détections IA
POST   /api/cameras/{id}/detections/{id}/ignore/ - Ignorer détection
```

### Brigades

```
GET    /api/brigades/                           - Liste des brigades
GET    /api/brigades/{id}/                      - Détails d'une brigade
GET    /api/brigades/{id}/agents/               - Agents d'une brigade
GET    /api/brigades/{id}/statistiques/         - Statistiques brigade
POST   /api/brigades/{id}/assign-superviseur/  - Assigner superviseur
```

### Comptes Rendus

```
GET    /api/comptes-rendus/superviseur/{id}/    - CR reçus par superviseur
GET    /api/comptes-rendus/{id}/                - Détails d'un CR
PUT    /api/comptes-rendus/{id}/valider/        - Valider un CR
```

### Statistiques et Rapports

```
GET    /api/statistiques/region/{id}/           - Statistiques régionales
GET    /api/statistiques/national/              - Statistiques nationales
POST   /api/rapports/generer/                  - Générer un rapport
GET    /api/rapports/{id}/                      - Télécharger rapport
```

### Recherche Globale

```
GET    /api/search/                             - Recherche globale
Query params: ?q={query}&type=all|agents|alertes|citoyens
```

### Gemini AI

```
POST   /api/gemini/chat/                        - Chat avec IA
POST   /api/gemini/analyze-prestation/          - Analyser prestation
POST   /api/gemini/analyze-video/               - Analyser vidéo (à venir)
```

---

## 📱 Interfaces Utilisateur

### Layout Principal

**Fichier** : `control-portal/src/components/layout/Layout.tsx`

**Structure** :
```
┌─────────────────────────────────────────┐
│  Header (recherche + notifications)     │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Contenu Principal          │
│          │  (Pages)                     │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Sidebar (Navigation)

**Fichier** : `control-portal/src/components/layout/Sidebar.tsx`

**Menu** :
- 🏠 **Tableau de bord** (`/`)
- 📹 **Surveillance** (`/surveillance`)
- 🔔 **Alertes** (`/alerts`)
- 👥 **Agents** (`/agents`)
- 🚪 **Déconnexion**

### Header

**Fichier** : `control-portal/src/components/layout/Header.tsx`

**Fonctionnalités** :
- Barre de recherche globale
- Notifications (badge avec compteur : 3 non lues)
- Profil utilisateur ("Officer Admin - Centre de Contrôle")
- Bouton déconnexion

### Page Dashboard

**Fichier** : `control-portal/src/pages/Dashboard.tsx`

**Composants** :
- `StatsCard` (4 cartes de statistiques)
- Carte interactive (marqueurs incidents)
- `AlertsList` (3 alertes récentes)

### Page Agents

**Fichier** : `control-portal/src/pages/Agents.tsx`

**Composants** :
- Grille de cartes agents
- Filtres (recherche + statut)
- Statistiques (4 compteurs)
- Modal détails agent
- `MapView` (carte interactive)
- `AssignMissionModal` (formulaire mission)

### Page Alertes

**Fichier** : `control-portal/src/pages/Alerts.tsx`

**Composants** :
- Grille de cartes alertes
- Triple filtrage (statut + type + sévérité)
- Barre de recherche
- Statistiques (3 compteurs)
- Modal détails alerte
- Boutons changement statut

### Page Surveillance

**Fichier** : `control-portal/src/pages/Surveillance.tsx`

**Composants** :
- `VideoGrid` (grille 2x3 de 6 flux caméra)
- `AIAnalysisPanel` (panneau analyse IA)
- Filtres caméras

---

## 🔄 Flux de Données

### Assignation de Mission

```
1. Contrôleur ouvre page Agents
2. Sélectionne un agent disponible
3. Clic "Assigner mission"
4. Modal s'ouvre avec formulaire
5. Optionnel : Sélection alerte (auto-remplissage)
6. Remplissage formulaire
7. POST /api/missions/
8. Mission créée (statut: assigned)
9. Agent statut → Occupé
10. Alerte statut → En investigation (si liée)
11. Notification push à l'agent
```

### Gestion d'Alerte

```
1. Alerte créée (citoyen/agent/caméra)
2. Visible dans Dashboard (panneau alertes récentes)
3. Contrôleur ouvre page Alertes
4. Filtre et consulte les alertes
5. Clic "Voir détails" → Modal
6. Action : "Marquer comme En investigation"
7. PATCH /api/alertes/{id}/statut/
8. Optionnel : Assigner mission à un agent
9. Suivi de l'intervention
10. Action : "Marquer comme Résolue"
```

### Analyse IA Vidéo

```
1. Contrôleur ouvre page Surveillance
2. Sélectionne une caméra
3. Analyse IA automatique (Gemini)
4. Détections affichées dans AIAnalysisPanel
5. Contrôleur consulte les détections
6. Action : "Confirmer l'alerte"
7. POST /api/alertes/from-detection/
8. Alerte créée automatiquement
9. Visible dans liste alertes
10. Notification aux agents
```

### Validation Compte Rendu

```
1. Agent envoie compte rendu
2. Contrôleur reçoit notification
3. Contrôleur consulte le CR
4. Lecture du contenu
5. Action : "Valider" ou "Demander compléments"
6. PUT /api/comptes-rendus/{id}/valider/
7. Statut CR mis à jour
8. Notification à l'agent
9. CR archivé dans historique
```

---

## 📊 Statistiques et Métriques

### Données Trackées

**Par Brigade** :
- Nombre d'agents
- Agents disponibles/occupés/hors ligne
- Vérifications effectuées
- Alertes traitées
- Arrestations
- Missions complétées

**Par Région** :
- Nombre de brigades
- Agents totaux
- Statistiques agrégées
- Tendances (évolution)

**National** :
- Toutes les régions
- Statistiques globales
- Rapports consolidés

### Mise à Jour

- **Temps réel** : Statistiques mises à jour automatiquement
- **Rapports** : Génération à la demande (quotidien/hebdomadaire/mensuel/annuel)

---

## 🔗 Références

- [Documentation Backend](../backend/docs/README.md)
- [Intégration Organismes Officiels](../backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)
- [Documentation Citoyen](./CITOYEN.md)
- [Documentation Agent](./AGENT.md)
- [Responsabilités des Acteurs](./RESPONSABILITES_ACTEURS.md)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Citizen Portal

