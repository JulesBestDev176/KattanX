# 📋 Responsabilités des Acteurs - Citizen Portal

## Vue d'ensemble

Le système Citizen Portal est composé de trois applications principales, chacune destinée à un type d'acteur spécifique :

1. **Application Citoyen** (Mobile) - Pour les citoyens sénégalais
2. **Application Agent** (Mobile) - Pour les agents des forces de l'ordre
3. **Portail de Contrôle** (Web) - Pour les contrôleurs et superviseurs

---

## 🏛️ 1. CITOYENS

### Description
Les citoyens sont les utilisateurs finaux du système. Ils utilisent l'application mobile pour accéder à leurs informations personnelles, effectuer des démarches administratives, signaler des incidents et interagir avec les services publics.

### Responsabilités principales

#### 1.1 Gestion du Profil Personnel
- **Consulter** leurs informations personnelles (nom, prénom, CNI, téléphone, email)
- **Mettre à jour** leurs informations de contact (nom et téléphone uniquement)
- **Visualiser** leur photo de profil depuis le DAF (lecture seule)
- **Éditer** leur profil via un formulaire dédié avec validation
- **Gérer** leur session et se déconnecter

#### 1.2 Gestion des Documents
- **Consulter** leur dossier administratif complet via l'écran "Dossier"
- **Visualiser** tous leurs documents officiels (CNI, Passeport, Acte de naissance, Casier judiciaire, Acte de mariage, Acte de décès, Certificat de résidence, Permis de conduire, Carte de séjour, etc.)
- **Vérifier** le statut de chaque document (valide, expiré, en attente)
- **Consulter** les dates d'émission et d'expiration
- **Utiliser** une visionneuse de documents dédiée avec format spécial pour la CNI sénégalaise
- **Surveiller** les documents proches de l'expiration

#### 1.3 Signalement et Dénonciations
- **Soumettre** des dénonciations via un formulaire dédié
- **Spécifier** le type d'incident, la description détaillée et la localisation
- **Attacher** des preuves (image, audio ou vidéo)
- **Suivre** le statut de leurs dénonciations (pending, verified, rejected)
- **Consulter** l'historique complet de toutes leurs dénonciations
- **Visualiser** les détails de chaque dénonciation via un modal

#### 1.4 Gestion des Plaintes
- **Déposer** des plaintes officielles via un formulaire dédié
- **Spécifier** l'objet et la description de la plainte
- **Choisir** le commissariat de destination ou utiliser l'auto-sélection du plus proche
- **Consulter** les plaintes reçues et déposées
- **Suivre** le statut de chaque plainte
- **Visualiser** les amendes associées aux plaintes
- **Maintenir** un historique complet des plaintes

#### 1.5 Gestion des Revenus
- **Consulter** leur solde disponible en FCFA
- **Effectuer** des transferts de fonds via Mobile Money (numéro de téléphone) ou Banque (numéro de compte)
- **Visualiser** l'historique complet des transactions
- **Suivre** les gains issus des alertes vérifiées
- **Vérifier** les dates et statuts des transactions
- **Gérer** les retraits de fonds

#### 1.6 Authentification et Sécurité
- **S'inscrire** via un processus en 2 étapes (informations personnelles puis vérification OTP)
- **Vérifier** leur identité via OTP envoyé par WhatsApp (code à 6 chiffres, validité 10 minutes)
- **Se connecter** avec email ou téléphone + mot de passe
- **Gérer** leur session avec persistance automatique
- **Se déconnecter** pour terminer la session en toute sécurité

### Permissions et Limitations

✅ **Peut faire :**
- Consulter ses propres informations
- Mettre à jour ses informations de contact
- Signaler des incidents
- Déposer des plaintes
- Consulter ses documents

❌ **Ne peut pas faire :**
- Modifier ses informations biométriques (réservé aux organismes officiels)
- Accéder aux informations d'autres citoyens
- Modifier son numéro CNI
- Accéder aux données des agents
- Modifier les données administratives officielles

### Endpoints API utilisés

**Base URL:** `https://sufmgjdutkglfsliecaz.supabase.co/functions/v1/make-server-7f5fa16e`

```
# Authentification (Supabase Auth)
POST   supabase.auth.signUp()              - Inscription
POST   supabase.auth.signInWithPassword()  - Connexion
POST   /functions/v1/send-whatsapp         - Envoi OTP WhatsApp

# Profil
GET    /profile                            - Consulter son profil
PUT    /profile                            - Mettre à jour son profil

# Documents
GET    /dossiers                           - Consulter ses documents

# Dénonciations
GET    /denonciations                      - Liste des dénonciations
POST   /denonciations                      - Soumettre une dénonciation

# Plaintes
GET    /plaintes                           - Liste des plaintes
POST   /plaintes                           - Déposer une plainte

# Revenus
GET    /revenus                            - Consulter solde et transactions
POST   /transfer                           - Effectuer un transfert
```

**Authentification:** Tous les endpoints protégés nécessitent un Bearer Token dans le header `Authorization`

---

## 👮 2. AGENTS DES FORCES DE L'ORDRE

### Description
Les agents sont les membres des forces de l'ordre (Police Nationale, Gendarmerie Nationale, Sapeurs-Pompiers) qui utilisent l'application mobile pour effectuer des vérifications d'identité, gérer leurs missions et maintenir l'ordre public.

### Types d'Agents

#### 2.1 Police Nationale
- **Grades** : Gardien de la Paix, Brigadier, Major, Lieutenant, Capitaine, Commandant, etc.
- **Matricule** : Format `POL-AAAA-NNNNNN`
- **École** : ENP (École Nationale de Police), ENOP (École Nationale des Officiers de Police)

#### 2.2 Gendarmerie Nationale
- **Grades** : Gendarme, Gendarme-Chef, Maréchal des Logis, Adjudant, Lieutenant, etc.
- **Matricule** : Format `GEN-AAAA-NNNNNN`
- **École** : École de Gendarmerie de Ouakam, EOGN

#### 2.3 Sapeurs-Pompiers
- **Grades** : Sapeur, Sapeur-Chef, Caporal, Sergent, Lieutenant, etc.
- **Matricule** : Format `POM-AAAA-NNNNNN`
- **École** : ENSP (École Nationale des Sapeurs-Pompiers)

### Responsabilités principales

#### 2.1 Vérification d'Identité (3 méthodes)
- **Par CNI** : Saisie du numéro CNI à 13 chiffres
- **Par Matricule** : Saisie de la plaque d'immatriculation du véhicule
- **Par Photo** : Reconnaissance faciale avec intelligence artificielle
- **Consulter** les résultats détaillés de vérification incluant :
  - Informations personnelles complètes (nom, prénom, CNI, date de naissance, téléphone, adresse)
  - Badges de statut (RECHERCHE en rouge, AMENDES en orange, CASIER JUDICIAIRE en violet)
  - Liste des amendes impayées avec montants et motifs
  - Casier judiciaire détaillé (type: condamnation/plainte/garde_à_vue, description, date, lieu, peine)
  - Véhicules enregistrés (matricule, marque, modèle, couleur, année)
- **Enregistrer** automatiquement chaque vérification dans les statistiques

#### 2.2 Gestion du Service
- **Activer/Désactiver** son statut de service via un toggle sur l'écran d'accueil
- **Mettre à jour** automatiquement sa position GPS en temps réel lorsqu'en service
- **Démarrer** le tracking de localisation automatique lors de l'activation du service
- **Arrêter** le tracking lors de la désactivation
- **Visualiser** son statut actuel (En Service en vert / Hors Service en gris)
- **Sauvegarder** l'état du service dans le stockage local pour persistance

#### 2.3 Gestion des Alertes
- **Recevoir** des alertes en temps réel (rafraîchissement toutes les 5 secondes en mode démo)
- **Types d'alertes** supportés : Fugitif, Vol de véhicule, Incident
- **Consulter** les détails complets de chaque alerte (type, description, suspect, localisation)
- **Calculer** automatiquement la distance entre leur position et l'alerte
- **Recevoir** des notifications sonores et vibrations pour les nouvelles alertes
- **Visualiser** les informations du suspect (nom, CNI, photo, véhicule, caractéristiques physiques)
- **Afficher** les images jointes à l'alerte
- **Agir** sur les alertes avec le bouton "Je vais vérifier"
- **Voir** qui a créé l'alerte (nom de l'agent créateur)

#### 2.4 Actions sur les Individus Vérifiés
- **Demander une arrestation** : Disponible uniquement si l'individu est recherché (badge RECHERCHE)
- **Créer une amende** : Générer une nouvelle amende pour l'individu
- **Partager une alerte** : Créer une alerte pour informer les autres agents

#### 2.5 Gestion des Missions
- **Recevoir** des missions assignées par les contrôleurs via le portail de contrôle
- **Consulter** les détails des missions (titre, description, priorité, localisation)
- **Mettre à jour** le statut des missions (En Attente, En Cours, Terminée)
- **Enregistrer** les résultats des missions
- **Incrémenter** automatiquement le compteur de missions complétées

#### 2.6 Gestion du Profil Professionnel
- **Consulter** ses informations personnelles (CNI, email, téléphone)
- **Visualiser** ses informations professionnelles (corps, matricule)
- **Consulter** ses statistiques d'activité :
  - Vérifications effectuées
  - Alertes créées
  - Arrestations effectuées
- **Se déconnecter** de l'application

### Permissions et Limitations

✅ **Peut faire :**
- Vérifier l'identité de n'importe quel citoyen
- Consulter les informations complètes des citoyens
- Créer et traiter des alertes
- Recevoir et exécuter des missions
- Mettre à jour sa position GPS
- Enregistrer des vérifications

❌ **Ne peut pas faire :**
- Modifier les informations des citoyens
- Supprimer des données
- Accéder aux informations des autres agents (sauf si supérieur hiérarchique)
- Assigner des missions à d'autres agents (réservé aux contrôleurs)
- Modifier les données biométriques

### Hiérarchie et Commandement

Les agents respectent une hiérarchie stricte basée sur leur grade :

- **Homme du Rang** : Grades les plus bas (Gardien de la Paix, Gendarme, Sapeur)
- **Sous-Officier** : Grades intermédiaires (Brigadier, Gendarme-Chef, etc.)
- **Officier Subalterne** : Lieutenants, Capitaines
- **Officier Supérieur** : Commandants, Lieutenants-Colonels, Colonels
- **Officier Général / Haut Commandement** : Grades les plus élevés

Un agent de grade supérieur peut :
- Commander les agents de grade inférieur
- Accéder à plus d'informations
- Assigner des missions (selon les permissions)

### Endpoints API utilisés

**Configuration Supabase:**
- **Project ID:** sufmgjdutkglfsliecaz
- **Base URL:** https://sufmgjdutkglfsliecaz.supabase.co

```
# Authentification
POST   supabase.auth.signInWithPassword()         - Connexion agent

# Biométrie et Vérification
POST   /api/biometrie/verifier-empreinte/        - Vérification 1:1 par empreinte
POST   /api/biometrie/identifier-personne/        - Identification 1:N par empreinte
POST   /api/biometrie/verifier-faciale/          - Vérification par reconnaissance faciale
POST   /api/verification/valider-cni/             - Valider format CNI (13 chiffres)
POST   /api/verification/valider-matricule/        - Valider format matricule véhicule

# Citoyens
GET    /api/citoyens/{id}/                        - Consulter un citoyen
GET    /api/citoyens/search/?q={query}            - Rechercher un citoyen

# Gemini AI (Analyse photo)
POST   /api/gemini/chat/                          - Chat avec IA
POST   /api/gemini/analyze-prestation/            - Analyser une prestation

# Images
POST   /api/images/upload-photo/                  - Uploader une photo
POST   /api/images/upload-signature/              - Uploader une signature
POST   /api/images/validate/                      - Valider une image

# Prestations
POST   /api/prestations/                          - Créer une prestation
```

**Stockage Local (AsyncStorage):**
- `kattanx_agent` - Données de l'agent
- `kattanx_agent_token` - Token d'authentification
- `kattanx_service_status` - Statut du service (true/false)
- `kattanx_temp_agent_id` - ID temporaire
- `kattanx_temp_otp` - Code OTP temporaire

### Statistiques enregistrées

Chaque agent a des statistiques qui sont automatiquement mises à jour :
- **verifications_effectuees** : Nombre de vérifications d'identité effectuées
- **alertes_creees** : Nombre d'alertes créées
- **arrestations** : Nombre d'arrestations effectuées
- **missions_completes** : Nombre de missions complétées

---

## 🎛️ 3. CONTRÔLEURS (Portail de Contrôle)

### Description
Les contrôleurs sont les superviseurs et administrateurs qui utilisent le portail web pour surveiller les opérations, gérer les agents, coordonner les interventions et analyser les données du système.

### Responsabilités principales

#### 3.1 Dashboard et Surveillance en Temps Réel
- **Visualiser** 4 métriques clés en temps réel :
  - Alertes actives (12) avec tendance
  - Agents actifs (45 - 85% déployés)
  - Caméras en ligne (128/130 - 98% disponibilité)
  - Détections IA (24 détections à confiance élevée)
- **Consulter** la carte interactive en direct avec marqueurs d'incidents animés
- **Visualiser** le panneau des 3 alertes les plus récentes
- **Accéder** rapidement aux autres sections (Surveillance, Alertes, Agents)
- **Voir** les tendances (hausse/baisse) pour chaque métrique avec code couleur

#### 3.2 Gestion des Agents
- **Consulter** la liste complète des 8 agents avec leurs informations
- **Filtrer** les agents par statut (Tous/Disponible/Occupé/Hors ligne)
- **Rechercher** par nom ou spécialité
- **Visualiser** les statistiques :
  - Total des agents
  - Agents disponibles
  - Agents occupés
  - Agents hors ligne
- **Voir** les détails d'un agent dans un modal (nom, statut, spécialité, localisation GPS, ID)
- **Afficher** la localisation d'un agent sur une carte interactive avec marqueur coloré selon le statut
- **Voir** tous les agents sur une carte avec légende (Disponible/Occupé/Hors ligne)
- **Assigner** des missions aux agents disponibles via un formulaire modal complet

#### 3.3 Gestion des Alertes
- **Consulter** la liste complète des 6 alertes dans une grille
- **Filtrer** par multiple critères :
  - Statut (Toutes/Nouvelle/En investigation/Résolue)
  - Type (Toutes/Accident/Incendie/Vol/Médical/Autre)
  - Sévérité (Toutes/Critique/Élevée/Moyenne/Faible)
- **Rechercher** dans les descriptions et localisations
- **Visualiser** les alertes avec :
  - Icônes colorées selon le type
  - Badges de sévérité (Critique/Élevée/Moyenne/Faible)
  - Badges de statut (Nouvelle/En investigation/Résolue)
- **Voir** les détails complets d'une alerte dans un modal :
  - Type avec icône et couleur de sévérité
  - Description complète
  - Localisation (adresse + coordonnées GPS)
  - Source (citizen/camera/sensor)
  - Horodatage complet
  - ID de l'alerte
- **Changer** le statut des alertes :
  - Nouvelle → Marquer comme "En investigation"
  - En investigation → Marquer comme "Résolue"
- **Consulter** les statistiques (Total, Nouvelles, En investigation)

#### 3.4 Coordination des Interventions (Assignation de Missions)
- **Ouvrir** le formulaire d'assignation de mission pour un agent disponible
- **Lier** une mission à une alerte existante (optionnel)
- **Auto-remplir** les données depuis l'alerte sélectionnée
- **Saisir** les informations de la mission :
  - Titre de la mission (obligatoire)
  - Description détaillée (obligatoire)
  - Priorité (Faible/Moyenne/Élevée/Urgente)
  - Localisation :
    - Latitude et longitude (manuelles ou auto-remplies)
    - Adresse
    - Option "Utiliser la position actuelle de l'agent"
- **Créer** la mission avec statut "assigned"
- **Mettre à jour** automatiquement :
  - Le statut de l'agent → "Occupé"
  - Le statut de l'alerte liée → "En investigation"
- **Suivre** toutes les missions créées

#### 3.5 Surveillance Vidéo et Analyse IA
- **Visualiser** une grille de 6 flux vidéo en direct provenant de caméras
- **Voir** l'indicateur "EN DIRECT" avec animation clignotante
- **Consulter** le statut de chaque caméra (online/offline)
- **Sélectionner** une caméra pour analyse détaillée
- **Afficher** les informations de localisation pour chaque caméra
- **Analyser** avec l'IA :
  - Panneau d'analyse montrant le niveau de menace (ex: 94% de confiance)
  - Liste des événements détectés avec scores de confiance
  - Horodatage de chaque détection
  - Type d'événement (ex: "Accident de la circulation", "Vol", etc.)
- **Recevoir** des recommandations IA automatiques (ex: "Envoyer la patrouille la plus proche")
- **Agir** sur les détections IA :
  - Confirmer l'alerte → Créer une alerte officielle
  - Marquer comme fausse alerte → Ignorer
- **Filtrer** les caméras (Toutes/Avec alertes/Hors ligne)

#### 3.6 Navigation et Interface
- **Accéder** aux 4 pages principales via la barre latérale :
  - Tableau de bord (/)
  - Surveillance (/surveillance)
  - Alertes (/alerts)
  - Agents (/agents)
- **Utiliser** la barre de recherche globale dans le header
- **Consulter** les notifications (badge avec compteur : 3 non lues)
- **Voir** les informations de l'utilisateur connecté ("Officer Admin - Centre de Contrôle")
- **Se déconnecter** du système

### Permissions et Limitations

✅ **Peut faire :**
- Accéder à toutes les données du système
- Consulter les informations de tous les citoyens et agents
- Assigner des missions aux agents
- Gérer les alertes et leur priorisation
- Accéder aux analyses IA et rapports
- Configurer le système

❌ **Ne peut pas faire :**
- Modifier directement les données biométriques des citoyens
- Supprimer définitivement des données (audit requis)
- Modifier les grades des agents (réservé à l'administration)
- Accéder aux données sensibles sans autorisation

### Fonctionnalités du Portail (Implémentation Réelle)

#### Dashboard (Page: [Dashboard.tsx](control-portal/src/pages/Dashboard.tsx))
- **4 cartes de statistiques** avec icônes et tendances (StatsCard component)
- **Carte interactive** en direct avec marqueurs d'incidents (coordonnées de Dakar)
- **Panneau latéral** des 3 alertes récentes (AlertsList component)
- **Liens rapides** vers les autres sections
- **Code couleur** pour les tendances (vert: hausse positive, rouge: hausse négative)

#### Gestion des Agents (Page: [Agents.tsx](control-portal/src/pages/Agents.tsx))
- **Grille de cartes agents** avec avatar et informations (8 agents actuellement)
- **Filtres** : Barre de recherche + Sélecteur de statut (4 options)
- **Statistiques** : 4 compteurs (Total/Disponible/Occupé/Hors ligne)
- **Modal détails agent** : Affichage complet des informations
- **MapView component** : Carte interactive avec tous les agents et légende
- **AssignMissionModal component** : Formulaire complet avec :
  - Dropdown de sélection d'alerte
  - Champs titre et description
  - Sélecteur de priorité (4 niveaux)
  - Champs de localisation (lat/lng/adresse)
  - Checkbox position actuelle

#### Gestion des Alertes (Page: [Alerts.tsx](control-portal/src/pages/Alerts.tsx))
- **Grille de cartes d'alertes** avec icônes colorées (6 alertes exemple)
- **Triple filtrage** : Statut (4 options) + Type (6 options) + Sévérité (5 options)
- **Barre de recherche** avec recherche en temps réel
- **Statistiques** : 3 compteurs (Total/Nouvelles/En investigation)
- **Modal détails** : Affichage complet avec tous les champs
- **Boutons d'action** : Changer statut selon état actuel

#### Surveillance (Page: [Surveillance.tsx](control-portal/src/pages/Surveillance.tsx))
- **VideoGrid component** : Grille 2x3 de 6 flux caméra
- **Indicateurs EN DIRECT** avec animation clignotante
- **AIAnalysisPanel component** pour la caméra sélectionnée :
  - Jauge de menace avec pourcentage
  - Liste des événements détectés
  - Scores de confiance
  - Recommandations IA
- **Boutons d'action** : Confirmer/Ignorer alerte IA
- **Sélection de caméra** pour analyse détaillée

### Endpoints API utilisés

**Note:** Le portail de contrôle utilise actuellement des données simulées (mock data). Les endpoints suivants sont prévus pour l'intégration backend :

```
# Gestion des Agents
GET    /api/agents/                      - Liste de tous les agents
GET    /api/agents/{id}/                 - Détails d'un agent
GET    /api/agents/search                - Rechercher des agents
PUT    /api/agents/{id}/status           - Mettre à jour le statut d'un agent
GET    /api/agents/{id}/location         - Obtenir la localisation d'un agent

# Gestion des Missions
POST   /api/missions/                    - Créer une mission
GET    /api/missions/                    - Liste des missions
PUT    /api/missions/{id}/status         - Mettre à jour le statut d'une mission
GET    /api/missions/{id}/               - Détails d'une mission

# Gestion des Alertes
GET    /api/alerts/                      - Liste des alertes
GET    /api/alerts/{id}/                 - Détails d'une alerte
PUT    /api/alerts/{id}/status           - Mettre à jour le statut d'une alerte
GET    /api/alerts/filter                - Filtrer les alertes (statut/type/sévérité)

# Surveillance et Caméras
GET    /api/cameras/                     - Liste de toutes les caméras
GET    /api/cameras/{id}/stream          - Obtenir le flux vidéo
GET    /api/cameras/{id}/detections      - Obtenir les détections IA
GET    /api/analysis/{feedId}/           - Obtenir l'analyse IA complète

# Recherche Globale
GET    /api/search                       - Recherche globale (alertes, agents, localisations)
```

**Configuration Actuelle:**
- **Framework:** React 19.2.0 avec React Router DOM 7.9.6
- **État:** Données en local (state management par composant)
- **Icônes:** Lucide React 0.555.0
- **Build:** Vite 7.2.4

---

## 🔐 Sécurité et Authentification

### Authentification

Tous les acteurs doivent s'authentifier pour accéder au système :

- **Citoyens** : Authentification via CNI + biométrie ou identifiants
- **Agents** : Authentification via matricule + biométrie
- **Contrôleurs** : Authentification via identifiants administrateur

### Tokens JWT

Le système utilise des tokens JWT pour l'authentification :
- **Access Token** : Valide pour une durée limitée
- **Refresh Token** : Pour renouveler l'access token

```
POST /api/auth/token/                    - Obtenir un token
POST /api/auth/token/refresh/             - Rafraîchir un token
```

### Permissions basées sur les rôles

Chaque acteur a des permissions spécifiques selon son rôle :
- Les citoyens ne peuvent accéder qu'à leurs propres données
- Les agents peuvent accéder aux données des citoyens pour vérification
- Les contrôleurs ont accès à toutes les données pour supervision

---

## 📊 Flux de Données

### Flux Citoyen → Système
1. Citoyen se connecte à l'application mobile
2. Consulte/modifie ses informations
3. Signale un incident → Création d'alerte
4. Dépose une plainte → Enregistrement dans le système

### Flux Agent → Système
1. Agent se connecte et active son service
2. Effectue une vérification d'identité → Enregistrement
3. Reçoit une alerte → Traitement
4. Reçoit une mission → Exécution et mise à jour du statut

### Flux Contrôleur → Système
1. Contrôleur se connecte au portail web
2. Surveille les alertes en temps réel
3. Assigne des missions aux agents
4. Analyse les données et génère des rapports

### Flux Système → Acteurs
1. Alertes envoyées aux agents concernés
2. Notifications envoyées aux citoyens
3. Missions assignées aux agents
4. Rapports générés pour les contrôleurs

---

## 🔄 Interactions entre Acteurs

### Citoyen ↔ Agent
- **Vérification d'identité** : L'agent vérifie l'identité du citoyen
- **Signalement** : Le citoyen signale un incident, l'agent intervient
- **Plainte** : Le citoyen dépose une plainte, l'agent enregistre

### Agent ↔ Contrôleur
- **Mission** : Le contrôleur assigne une mission à l'agent
- **Rapport** : L'agent met à jour le statut de la mission
- **Alerte** : L'agent crée une alerte, le contrôleur la supervise

### Citoyen ↔ Contrôleur
- **Indirect** : Via les alertes et plaintes
- **Analyse** : Le contrôleur analyse les données des citoyens pour statistiques

---

## 📱 Applications et Interfaces

### Application Citoyen (Mobile)
- **Technologie** : React Native / Expo SDK 54.0.0
- **Package** : com.kattanx.citizenportal
- **Version** : 1.0.0
- **Écrans réels** ([citoyen/src/screens/](citoyen/src/screens/)) :
  - AuthScreen.tsx - Authentification et inscription (2 étapes + OTP WhatsApp)
  - HomeScreen.tsx - Accueil avec 5 services
  - ProfileScreen.tsx - Profil avec édition (nom, téléphone)
  - DossierScreen.tsx - Documents administratifs avec visionneuse
  - DenonciationsScreen.tsx - Dénonciations avec formulaire modal
  - PlaintesScreen.tsx - Plaintes avec formulaire modal
  - RevenusScreen.tsx - Revenus et transferts (Mobile Money/Banque)
- **Composants clés** :
  - ui/Button.tsx, ui/Input.tsx, ui/Toast.tsx
  - DocumentViewer.tsx (format spécial CNI sénégalaise)
- **Stockage** : AsyncStorage (kattanx_user, kattanx_token)

### Application Agent (Mobile)
- **Technologie** : React Native / Expo
- **Écrans réels** ([agent/src/screens/](agent/src/screens/)) :
  - AuthScreen.tsx - Authentification agent (email/phone + password)
  - HomeScreen.tsx - Dashboard avec toggle service + GPS tracking
  - VerificationScreen.tsx - 3 méthodes (CNI/Matricule/Photo IA)
  - AlertsScreen.tsx - Alertes temps réel (refresh 5s) avec son/vibration
  - ProfileScreen.tsx - Profil avec statistiques (vérifications/alertes/arrestations)
- **Composants clés** :
  - VerificationMethodSelector.tsx - Sélection méthode vérification
  - IndividuCard.tsx - Affichage résultats avec badges (RECHERCHE/AMENDES/CASIER)
  - AlertCard.tsx - Carte d'alerte avec calcul distance
  - CameraCapture.tsx - Capture photo ou galerie
  - ui/Button.tsx, ui/Input.tsx, ui/Toast.tsx
- **Utilitaires** :
  - location.ts - GPS tracking, calcul distance (formule Haversine)
  - imageAnalysis.ts - Analyse photo IA (mode démo)
  - storage.ts - AsyncStorage (kattanx_agent, kattanx_agent_token, kattanx_service_status)
  - supabase.ts - Configuration Supabase client
- **Permissions** : Location (foreground + background), Camera, Media Library

### Portail de Contrôle (Web)
- **Technologie** : React 19.2.0 + Vite 7.2.4 + TypeScript 5.9.3
- **Routing** : React Router DOM 7.9.6
- **Pages réelles** ([control-portal/src/pages/](control-portal/src/pages/)) :
  - Dashboard.tsx - Vue d'ensemble (4 stats + carte + alertes récentes)
  - Agents.tsx - Gestion agents avec carte et assignation missions
  - Alerts.tsx - Gestion alertes avec triple filtrage
  - Surveillance.tsx - Grille 6 caméras + analyse IA
- **Layout** ([control-portal/src/components/layout/](control-portal/src/components/layout/)) :
  - Layout.tsx - Structure principale
  - Sidebar.tsx - Navigation (Dashboard/Surveillance/Alertes/Agents)
  - Header.tsx - Recherche globale + notifications (3) + profil utilisateur
- **Composants métier** :
  - dashboard/StatsCard.tsx - Cartes de statistiques avec tendances
  - dashboard/AlertsList.tsx - Liste alertes récentes
  - agents/AssignMissionModal.tsx - Formulaire assignation mission complète
  - agents/MapView.tsx - Carte interactive agents avec légende
  - surveillance/VideoGrid.tsx - Grille flux vidéo avec indicateurs live
  - surveillance/AIAnalysisPanel.tsx - Panneau analyse IA avec recommandations
- **Types** : [types/index.ts](control-portal/src/types/index.ts) - Alert, Agent, Mission, CameraFeed
- **État** : State management local par composant (useState/useEffect)

---

## 🔧 Modèles de Données Implémentés

### Type Definitions - Citoyen ([citoyen/src/types/index.ts](citoyen/src/types/index.ts))
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  cni: string;
  tel: string;
  photo?: string;
}

interface Dossier {
  id: string;
  type: 'cni' | 'passeport' | 'extrait_naissance' | 'casier_judiciaire' |
        'acte_mariage' | 'acte_deces' | 'certificat_residence' |
        'permis_conduire' | 'carte_sejour' | 'autre';
  numero: string;
  dateEmission: string;
  dateExpiration?: string;
  statut?: 'valide' | 'expire' | 'en_attente';
}

interface Denonciation {
  id: string;
  type: string;
  description: string;
  localisation: string;
  preuveType: string;
  status: string;
  createdAt: string;
}

interface Plainte {
  id: string;
  type: 'reçue' | 'déposée';
  objet: string;
  description: string;
  commissariat?: string;
  amende?: number;
  status: string;
  createdAt: string;
}
```

### Type Definitions - Agent ([agent/src/types/index.ts](agent/src/types/index.ts))
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
  position?: { latitude: number; longitude: number; timestamp: number };
  enService: boolean;
  stats?: {
    verificationsEffectuees: number;
    alertesCreees: number;
    arrestations: number;
  };
}

interface Alerte {
  id: string;
  type: 'fugitif' | 'vol' | 'incident' | 'autre';
  titre: string;
  description: string;
  suspect?: Suspect;
  localisation: { latitude: number; longitude: number; adresse: string };
  images?: string[];
  createdBy: string;
  createdByName: string;
  status: 'active' | 'resolue' | 'annulee';
  distance?: number;
}

interface Suspect {
  nom?: string;
  prenom?: string;
  cni?: string;
  photo?: string;
  vehicule?: { matricule: string; marque: string; modele: string; couleur: string };
  sexe?: 'homme' | 'femme' | 'inconnu';
  ageMin?: number;
  ageMax?: number;
  couleurPeau?: 'claire' | 'mate' | 'foncee';
  tailleMin?: number;
  tailleMax?: number;
  poidsMin?: number;
  poidsMax?: number;
  signesParticuliers?: string;
}
```

### Type Definitions - Contrôleur ([control-portal/src/types/index.ts](control-portal/src/types/index.ts))
```typescript
interface Alert {
  id: string;
  type: 'accident' | 'fire' | 'theft' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number; address: string };
  description: string;
  status: 'new' | 'investigating' | 'resolved';
  timestamp: string;
  source: 'citizen' | 'camera' | 'sensor';
}

interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: { lat: number; lng: number };
  specialty: string;
}

interface Mission {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  location: { lat: number; lng: number; address: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  completedAt?: string;
  alertId?: string;
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

---

## 📝 Notes Importantes

1. **Biométrie** : Seuls les organismes officiels (ANCEC, etc.) peuvent modifier les données biométriques
2. **Hiérarchie** : Les agents respectent une hiérarchie stricte basée sur les grades
3. **Audit** : Toutes les actions importantes sont enregistrées pour audit
4. **Confidentialité** : Les données personnelles sont protégées selon les lois sénégalaises
5. **Intégration** : Le système s'intègre avec les organismes officiels (ANCEC, DGPN, HCGN, DNPC, DTT)
6. **Mode Démo** : Les applications citoyens et agents fonctionnent actuellement en mode simulation avec données mockées
7. **Backend** : Le portail de contrôle utilise des données locales et nécessite une intégration backend complète
8. **Supabase** : Configuration partagée entre les apps (Project ID: sufmgjdutkglfsliecaz)
9. **Localisation** : Les coordonnées par défaut pointent vers Dakar, Sénégal (~14.6928, -17.4467)

---

## 🔗 Références

- [Documentation Backend](./backend/docs/README.md)
- [Intégration Organismes Officiels](./backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)
- [Documentation API](./backend/README.md)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Citizen Portal

