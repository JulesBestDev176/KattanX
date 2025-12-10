# 🚀 KàttanX - Présentation du Projet
## Plateforme Nationale Unifiée de Sécurité et Justice Civique
### GovAthon 2025 - Catégorie Justice

---

## 📋 SOMMAIRE

1. [Contexte](#contexte)
2. [Problématique](#problématique)
3. [La Solution KàttanX](#la-solution)
4. [Les 3 Piliers](#les-3-piliers)
5. [Technologies](#technologies)
6. [Impact Mesurable](#impact)
7. [Conformité Légale](#conformité)
8. [Différenciateurs](#différenciateurs)
9. [Déploiement](#déploiement)

---

## 🌍 CONTEXTE

### Le Sénégal face aux défis de sécurité moderne

Le Sénégal a entrepris des investissements majeurs dans la sécurité publique :
- **Projet Safe City** : Réseau de vidéosurveillance intelligent à Dakar
- **Appel du DGPN** : Besoin d'outils modernes pour les forces de l'ordre
- **Loi 13/2025** : Première loi africaine francophone sur les lanceurs d'alerte (août 2025)

### Un écosystème fragmenté

**Situation actuelle** :
- Données dispersées entre multiples organismes (ANCEC, DGPN, HCGN, DTT, Justice)
- Pas d'accès unifié à l'information critique
- Communication lente entre forces de l'ordre
- Participation citoyenne quasi inexistante (<5%)

---

## ⚠️ PROBLÉMATIQUE

### Les 4 problèmes majeurs identifiés

#### 1️⃣ **Inefficacité Opérationnelle des Forces de l'Ordre**

**Scénario réel** :
```
Un agent de police arrête un véhicule suspect
↓
Il doit vérifier manuellement :
  - L'identité du conducteur (appel central)
  - Le casier judiciaire (autre service)
  - Le statut du véhicule (DTT)
  - Les amendes impayées (Justice)
↓
⏱️ RÉSULTAT : 12 MINUTES PERDUES
↓
Le criminel recherché s'échappe pendant ce temps
```

**Statistiques alarmantes** :
- ⏱️ **Temps de vérification** : 12 minutes en moyenne
- 📡 **Diffusion d'alerte** : Manuelle et lente
- ❌ **Taux d'échec** : Criminels recherchés non interceptés

---

#### 2️⃣ **Participation Citoyenne Inexistante**

**Le problème** :
```
Un citoyen témoin d'un crime
↓
Il appelle la police... mais :
  - Pas de retour d'information
  - Pas de protection légale
  - Pas de preuve de son signalement
  - Risque de représailles
↓
😞 RÉSULTAT : Sentiment d'impuissance
↓
📊 STATISTIQUE : <5% de participation citoyenne active
```

**Conséquences** :
- Crimes non signalés
- Corruption cachée
- Délits impunis

---

#### 3️⃣ **Fausses Alertes et Surcharge**

**Le problème** :
```
Centre de commandement Safe City
↓
Reçoit des centaines d'appels quotidiens
↓
❌ 40% sont des FAUSSES ALERTES
↓
Les dispatchers perdent un temps précieux à trier
↓
⚠️ RÉSULTAT : Les vraies urgences ne sont pas prioritaires
```

**Impact** :
- Temps de réponse allongé
- Ressources gaspillées
- Frustration des citoyens et des forces de l'ordre

---

#### 4️⃣ **Corruption Difficile à Détecter**

**Le problème actuel** :
```
La corruption existe mais :
  - Pas de canal sécurisé pour signaler
  - Citoyens ont peur de représailles
  - Pas d'incitation à dénoncer
  - Pas de protection légale
↓
🔒 RÉSULTAT : Silence et impunité
↓
💰 IMPACT : 50M CFA/an récupérés (très faible)
```

---

## 💡 LA SOLUTION : KàttanX

### Une Plateforme Unifiée en 3 Piliers

**Vision** :
> "Digitaliser la sécurité publique au Sénégal en connectant **Citoyens**, **Forces de l'Ordre** et **Contrôleurs** via l'IA et le temps réel."

### Schéma d'Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND UNIFIÉ                           │
│  Django 5.0 + PostgreSQL (Supabase) + Google Gemini AI     │
│                                                              │
│  Intégrations :                                             │
│  • ANCEC (État Civil)    • DGPN (Police)                   │
│  • Justice (Casier)      • DTT (Véhicules)                 │
│  • HCGN (Gendarmerie)    • Safe City (Caméras)            │
└─────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    │ PORTAIL │         │ PORTAIL │         │ PORTAIL │
    │ CITOYEN │         │  AGENT  │         │ CONTRÔLE│
    │ (Mobile)│         │ (Mobile)│         │  (Web)  │
    └─────────┘         └─────────┘         └─────────┘
```

---

## 🏛️ LES 3 PILIERS DÉTAILLÉS

### PILIER 1 : PORTAIL CITOYEN (Mobile)

**Public** : Tous les citoyens sénégalais

#### 📱 Processus d'Inscription Sécurisé (3 étapes)

```
ÉTAPE 1 : Informations de Base
↓
Citoyen saisit :
  • Nom, Prénom
  • CNI (13 chiffres)
  • Date et lieu de naissance
↓
✅ VÉRIFICATION ANCEC AUTOMATIQUE
↓
Toutes les autres données viennent de la DAF (photo, adresse, etc.)

ÉTAPE 2 : Authentification
↓
  • Numéro de téléphone
  • Email (optionnel)
  • Mot de passe
↓
📲 ENVOI OTP VIA WHATSAPP (6 chiffres, 10 min de validité)
↓
✅ GÉNÉRATION NUMÉRO UNIQUE : CIT-2024-XXXXXX

ÉTAPE 3 : Biométrie (Sécurité)
↓
  • Capture photo (IA vérifie conformité ISO)
  • Enregistrement empreinte digitale
↓
✅ INSCRIPTION COMPLÈTE
```

---

#### 🏠 Fonctionnalités du Portail Citoyen

##### 1. **PROFIL**
- Consultation informations personnelles (depuis DAF)
- Photo de profil (lecture seule)
- Modification : Nom et Téléphone uniquement
- Déconnexion sécurisée

##### 2. **DOSSIER (Documents Administratifs)**
```
Documents disponibles :
  ✅ CNI (Carte Nationale d'Identité)
  ✅ Passeport
  ✅ Extrait de naissance
  ✅ Casier judiciaire
  ✅ Acte de mariage/décès
  ✅ Certificat de résidence
  ✅ Permis de conduire
  ✅ Carte de séjour
```

**Fonctionnalités** :
- Visionneuse dédiée (format spécial CNI sénégalaise)
- Alertes d'expiration automatiques
- Téléchargement PDF sécurisé

##### 3. **PROPRIÉTÉS**
```
Biens associés au citoyen :
  🏠 Titres fonciers
  🚗 Véhicules enregistrés (matricule, marque, modèle, année)
  📄 Autres propriétés légales
```

---

##### 4. **DÉNONCIATIONS** ⭐ Innovation Clé

**Comment ça marche** :

```
CITOYEN TÉMOIN D'UN CRIME
↓
Ouvre l'app KàttanX → "Nouvelle Dénonciation"
↓
Formulaire :
  • Type d'incident (Vol, Agression, Corruption, Accident, etc.)
  • Description détaillée
  • 📍 LOCALISATION GPS (automatique)
  • 🎥 PREUVES : Photo / Vidéo / Audio
  • 🔒 Option : RESTER ANONYME
↓
⏱️ SOUMISSION EN 60 SECONDES
↓
✅ Alerte envoyée au système
```

**Le Traitement** :

```
1. TRIAGE IA (2 secondes)
   • Vérification intégrité média (détection deepfakes)
   • Analyse NLP du texte
   • Évaluation urgence (Critique/Élevée/Moyenne/Faible)
   • Classification automatique
↓
2. VALIDATION HUMAINE (Centre de Contrôle)
   • Dispatcher vérifie et valide
   • ✅ ALERTE CONFIRMÉE
↓
3. ACTION IMMÉDIATE
   • Si crime en cours → Patrouilles les plus proches notifiées
   • Si corruption → Transmission à l'OFNAC
   • Si catastrophe → Sapeurs-pompiers alertés
```

**Suivi pour le citoyen** :
- Statut de l'alerte : Pending / Verified / Resolved
- Notifications de progression
- Réponse des autorités

---

##### 5. **PLAINTES**

**Fonctionnalités** :

**A. Déposer une plainte** :
```
Formulaire :
  • Objet de la plainte
  • Description détaillée
  • Commissariat de destination :
    ✅ Auto-sélection du plus proche (GPS)
    ✅ Sélection manuelle
↓
✅ Plainte enregistrée dans le système
```

**B. Recevoir des notifications** :
```
Le citoyen est notifié si :
  ⚠️ Une plainte est déposée contre lui
  💰 Il a des amendes impayées
  📄 Statut de sa plainte évolue
```

**C. Consulter l'historique** :
- Plaintes reçues
- Plaintes déposées
- Amendes impayées (paiement en ligne possible)
- Statut de chaque plainte

---

##### 6. **REVENUS** 💰 Loi 13/2025

**Le Cercle Vertueux de la Loi 13/2025** :

```
1. CITOYEN SIGNALE CORRUPTION
   • Vidéo d'un agent demandant un pot-de-vin
   • Via KàttanX (anonyme, protégé)
↓
2. ENQUÊTE OFNAC
   • Alerte transmise à l'OFNAC
   • Enquête ouverte
↓
3. CONDAMNATION & RÉCUPÉRATION
   • Agent condamné
   • Fonds détournés récupérés : 500M CFA
↓
4. RÉCOMPENSE LÉGALE
   • Loi 13/2025 : "Fonds spécial" verse 10% au lanceur d'alerte
   • 💰 CITOYEN REÇOIT : 50M CFA via KàttanX
   • 💼 ÉTAT GARDE : 450M CFA
```

**Fonctionnalités Revenus** :
- Consultation du solde disponible (FCFA)
- Historique des gains (par alerte vérifiée)
- **Transferts** :
  - 📱 Mobile Money (Orange Money, Wave, Free Money)
  - 🏦 Compte bancaire (numéro de compte)
- Statistiques des transactions

---

### PILIER 2 : PORTAIL AGENT (Mobile)

**Public** : Police Nationale, Gendarmerie Nationale, Sapeurs-Pompiers

#### 👮 Processus d'Inscription Agent

**Principe** : **Un agent est d'abord un citoyen**

```
ÉTAPE 1 : Informations de Base + Matricule
↓
Agent saisit :
  • Nom, Prénom, CNI
  • Date et lieu de naissance
  • ⭐ MATRICULE (POL-AAAA-NNNNNN / GEN-AAAA-NNNNNN / POM-AAAA-NNNNNN)
↓
✅ DOUBLE VÉRIFICATION :
   1. ANCEC (vérifie CNI)
   2. DGPN/HCGN/DNPC (vérifie matricule)
↓
Données récupérées :
  • Grade
  • Brigade/Unité
  • Statut professionnel (ACTIF/INACTIF)

ÉTAPE 2 : Authentification + OTP
  • Même processus que citoyen
  • ⭐ NUMÉRO UNIQUE : AGT-2024-XXXXXX

ÉTAPE 3 : Biométrie
  • Même processus que citoyen
↓
✅ RÔLES ATTRIBUÉS : [CITOYEN, AGENT_TERRAIN]
```

**Important** : L'agent a accès à **DEUX PORTAILS** :
- 🏛️ Portail Citoyen (pour ses propres démarches)
- 👮 Portail Agent (pour ses missions)

---

#### 🎯 Fonctionnalités du Portail Agent

##### 1. **ACCUEIL - Gestion du Service**

```
┌─────────────────────────────────────┐
│  Toggle : EN SERVICE / HORS SERVICE │
└─────────────────────────────────────┘
         ▼
    EN SERVICE ✅
         ▼
┌─────────────────────────────────────┐
│  GPS TRACKING AUTOMATIQUE           │
│  Position mise à jour : 30 secondes │
│  Visible par : Centre de Contrôle   │
└─────────────────────────────────────┘
```

**Fonctionnalités** :
- Badge de statut (🟢 En Service / ⚫ Hors Service)
- Statistiques rapides (vérifications, alertes, missions)
- Accès rapide aux 3 méthodes de vérification

---

##### 2. **VÉRIFICATION D'IDENTITÉ** ⭐ Cœur du Système

**3 MÉTHODES disponibles** :

#### **MÉTHODE 1 : Vérification par CNI** (3 secondes)

```
Agent arrête un individu
↓
Saisit le numéro CNI (13 chiffres)
↓
⚡ RÉSULTAT INSTANTANÉ (3 secondes) :

┌──────────────────────────────────────┐
│ 📷 PHOTO IDENTITÉ                    │
│                                      │
│ NOM : FALL Souleymane               │
│ CNI : 1663200000432                 │
│ Né le : 10/10/2000 à Dakar          │
│ Téléphone : +221 77 555 1234        │
│ Adresse : Plateau, Dakar            │
│                                      │
│ ⚠️ BADGES DE STATUT :               │
│ 🔴 RECHERCHE (Mandat d'arrêt actif) │
│ 🟠 AMENDES (15 000 FCFA impayés)    │
│ 🟣 CASIER JUDICIAIRE (Non vierge)   │
└──────────────────────────────────────┘

DÉTAILS AMENDES :
  • 10 000 FCFA - Excès de vitesse (15/11/2024)
  • 5 000 FCFA - Stationnement interdit (20/11/2024)

CASIER JUDICIAIRE :
  • Condamnation : Vol simple
    Date : 15/05/2023
    Lieu : Tribunal de Dakar
    Peine : 6 mois avec sursis

VÉHICULES ENREGISTRÉS :
  • DK-1234-AB - TOYOTA Corolla (Blanc, 2020)
```

**Actions disponibles** :
- 🚨 **Demander une arrestation** (si badge RECHERCHE)
- 💰 **Créer une amende**
- 📡 **Partager une alerte** (BOLO)

---

#### **MÉTHODE 2 : Vérification par Matricule Auto** (3 secondes)

```
Agent arrête un véhicule
↓
Saisit la plaque d'immatriculation (ex: DK-1234-AB)
↓
⚡ RÉSULTAT INSTANTANÉ :

┌──────────────────────────────────────┐
│ 🚗 VÉHICULE                          │
│                                      │
│ Matricule : DK-1234-AB              │
│ Marque : TOYOTA                      │
│ Modèle : Corolla                     │
│ Couleur : Blanc                      │
│ Année : 2020                         │
│                                      │
│ PROPRIÉTAIRE ACTUEL :                │
│ FALL Souleymane                      │
│ CNI : 1663200000432                 │
│ Téléphone : +221 77 555 1234        │
│                                      │
│ ✅ ASSURANCE : Valide (exp: 30/06/25)│
│ ✅ VISITE TECHNIQUE : OK (exp: 31/03/25)│
│ ✅ STATUT : En circulation           │
└──────────────────────────────────────┘
```

**Puis affichage des infos du propriétaire** (identique à Méthode 1)

---

#### **MÉTHODE 3 : Vérification par Photo (IA)** ⭐ Innovation

```
Individu n'a pas de papiers
↓
Agent ouvre la caméra dans l'app
↓
Prend une photo du visage
↓
⚡ ANALYSE IA (Google Gemini) - 5 secondes :

1. Détection du visage ✅
2. Extraction caractéristiques faciales
3. Comparaison avec base de données (1:1 ciblée)
   ⚠️ IMPORTANT : Pas de surveillance de masse (1:N)
   ✅ Comparaison uniquement avec suspects recherchés
↓
RÉSULTAT :

┌──────────────────────────────────────┐
│ 🎯 CORRESPONDANCE TROUVÉE (95% conf.)│
│                                      │
│ Photo de référence | Photo prise    │
│ [Image DAF]        | [Image agent]  │
│                                      │
│ NOM : DIOP Amadou                   │
│ CNI : 1990012312345                 │
│ 🔴 RECHERCHÉ pour vol qualifié      │
└──────────────────────────────────────┘
```

**Si aucune correspondance** :
```
❌ Aucune correspondance dans la base des suspects
→ Personne non recherchée
```

**Enregistrement automatique** :
- Chaque vérification est enregistrée
- Statistiques de l'agent mises à jour : `verifications_effectuees++`

---

##### 3. **ALERTES BOLO** (Be On the Look Out)

**Concept** : Partage d'alerte en temps réel entre agents

#### **A. CRÉER UNE ALERTE**

```
Agent témoin d'un vol / fuite
↓
Ouvre "Créer une alerte"
↓
Formulaire :
  • Type : Fugitif / Vol de véhicule / Incident
  • Titre : "Recherche personne"
  • Description : "Suspect recherché pour vol..."

  SUSPECT (optionnel si connu) :
    • Nom, Prénom, CNI
    • Photo
    • Véhicule (si applicable) :
      - Matricule (ex: DK-5678-EF)
      - Marque, Modèle, Couleur

  DESCRIPTION PHYSIQUE (si inconnu) :
    • Sexe : Homme / Femme
    • Âge : Min - Max (ex: 25-35 ans)
    • Couleur peau : Claire / Mate / Foncée
    • Taille : Min - Max (ex: 165-175 cm)
    • Poids : Min - Max (ex: 60-75 kg)
    • Signes particuliers : "Cicatrice joue gauche"

  📍 LOCALISATION (automatique)
  🎥 IMAGES (optionnel)
↓
✅ DIFFUSION INSTANTANÉE
```

**Propagation de l'alerte** :

```
Alerte créée
↓
⚡ DIFFUSION EN 2 SECONDES
↓
┌─────────────────────────────────────┐
│ TOUS LES AGENTS EN SERVICE          │
│ dans un rayon de 10 km              │
│ reçoivent une NOTIFICATION PUSH     │
│ avec son + vibration                │
└─────────────────────────────────────┘
↓
📊 EXEMPLE : 47 patrouilles alertées
```

---

#### **B. RECEVOIR DES ALERTES**

**Écran Alertes** :

```
┌─────────────────────────────────────┐
│ 🚨 ALERTES ACTIVES (5)              │
│ Rafraîchissement : Toutes les 5s    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🔴 FUGITIF - Recherche personne     │
│                                      │
│ 📍 Marché Sandaga, Dakar (2.5 km)  │
│ ⏰ Il y a 3 minutes                 │
│                                      │
│ SUSPECT :                            │
│ • Nom : DIOP Amadou                 │
│ • CNI : 1990012312345               │
│ • Photo : [Image]                   │
│ • Véhicule : DK-5678-EF (Toyota noir)│
│                                      │
│ Créé par : Agent NDIAYE (POL-...)   │
│                                      │
│ [Je vais vérifier] 🚓              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🚗 VOL DE VÉHICULE                  │
│                                      │
│ 📍 Avenue Pompidou (5.8 km)         │
│ ⏰ Il y a 15 minutes                │
│                                      │
│ Matricule : TH-9876-CD              │
│ Marque : RENAULT Duster (Blanc)     │
│                                      │
│ [Je vais vérifier] 🚓              │
└─────────────────────────────────────┘
```

**Calcul distance automatique** :
- Formule Haversine (GPS agent ↔ GPS alerte)
- Tri par proximité

**Action "Je vais vérifier"** :
- Statut alerte → `en_traitement`
- Agent assigné visible par autres agents
- Centre de Contrôle notifié

---

##### 4. **MISSIONS** (Assignées par Centre de Contrôle)

```
Contrôleur assigne une mission
↓
Agent reçoit notification push
↓
┌─────────────────────────────────────┐
│ 📋 NOUVELLE MISSION                 │
│                                      │
│ Titre : "Intervention vol de véhicule"│
│ Priorité : 🔴 URGENTE               │
│                                      │
│ Description :                        │
│ "Intervenir sur un vol de véhicule   │
│  signalé au marché Sandaga..."      │
│                                      │
│ 📍 LOCALISATION :                   │
│ Marché Sandaga, Dakar                │
│ Lat: 14.7000, Lng: -17.4500         │
│                                      │
│ 🔗 Alerte liée : #ALT-2024-5678     │
│                                      │
│ Assignée le : 01/12/2024 10:30      │
│                                      │
│ [Accepter] [Refuser]                │
└─────────────────────────────────────┘
```

**Actions disponibles** :
- **Accepter** : Statut → `in_progress`
- **Terminer** : Statut → `completed` + `missions_completes++`
- **Ajouter notes** : Résultat de l'intervention

---

##### 5. **PROFIL PROFESSIONNEL**

```
┌─────────────────────────────────────┐
│ 👤 INFORMATIONS PERSONNELLES        │
│                                      │
│ CNI : 1995032512345                 │
│ Email : mamadou.sarr@police.sn      │
│ Téléphone : +221 77 555 1234        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👮 INFORMATIONS PROFESSIONNELLES    │
│                                      │
│ Corps : Police Nationale             │
│ Matricule : POL-2020-001234         │
│ Grade : Gardien de la Paix          │
│ Brigade : Commissariat Central Dakar│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📊 STATISTIQUES D'ACTIVITÉ          │
│                                      │
│ Vérifications effectuées : 145      │
│ Alertes créées : 23                 │
│ Arrestations : 7                    │
│ Missions complétées : 56            │
└─────────────────────────────────────┘
```

---

### PILIER 3 : PORTAIL DE CONTRÔLE (Web)

**Public** : Contrôleurs, Superviseurs de brigades, Administrateurs

#### 🖥️ Technologies
- React 19.2.0 + Vite 7.2.4 + TypeScript
- Interface web moderne et responsive

#### 🎛️ Pages Principales

##### 1. **DASHBOARD - Vue d'Ensemble**

```
┌──────────────────────────────────────────────────────────┐
│ TABLEAU DE BORD                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐│
│ │ 🚨 ALERTES│ │ 👥 AGENTS │ │ 📹 CAMÉRAS│ │ 🧠 IA    ││
│ │ ACTIVES   │ │ ACTIFS    │ │ EN LIGNE  │ │DÉTECTIONS││
│ │           │ │           │ │           │ │          ││
│ │    12     │ │    45     │ │  128/130  │ │    24    ││
│ │  +2 /h    │ │  85% 📈   │ │  98% ✅   │ │  Élevée  ││
│ └───────────┘ └───────────┘ └───────────┘ └──────────┘│
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🗺️ CARTE INTERACTIVE EN TEMPS RÉEL                      │
│ ┌────────────────────────────────────────────────────┐  │
│ │                                                    │  │
│ │  📍 Dakar                                         │  │
│ │                                                    │  │
│ │  🔴 Incidents actifs (marqueurs animés)          │  │
│ │  🔵 Agents disponibles                           │  │
│ │  🟡 Agents occupés                               │  │
│ │  ⚫ Agents hors ligne                            │  │
│ │                                                    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📋 ALERTES RÉCENTES (3 dernières)                       │
│                                                          │
│ 🚗 Accident de la circulation                           │
│    Avenue Pompidou - Il y a 5 min - 🔴 Critique         │
│                                                          │
│ 🔥 Incendie                                             │
│    Marché Sandaga - Il y a 12 min - 🟠 Élevée          │
│                                                          │
│ 🚨 Vol                                                  │
│    Corniche Ouest - Il y a 20 min - 🟡 Moyenne         │
└──────────────────────────────────────────────────────────┘
```

---

##### 2. **GESTION DES AGENTS**

**Liste des Agents** :

```
┌──────────────────────────────────────────────────────────┐
│ 👥 GESTION DES AGENTS                                    │
├──────────────────────────────────────────────────────────┤
│ 🔍 Recherche : [________________] Statut : [Tous ▼]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 📊 STATISTIQUES :                                        │
│ Total : 8  |  Disponibles : 5  |  Occupés : 2  |  Hors ligne : 1│
│                                                          │
├──────────────────────────────────────────────────────────┤
│ LISTE DES AGENTS :                                       │
│                                                          │
│ ┌────────────────────────────────────┐                  │
│ │ 👤 Agent SARR Mamadou              │                  │
│ │ 🟢 Disponible                      │                  │
│ │ Brigade de circulation             │                  │
│ │ 📍 Avenue Pompidou                 │                  │
│ │ [Voir détails] [Carte] [Mission]  │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
│ ┌────────────────────────────────────┐                  │
│ │ 👤 Agent NDIAYE Fatou              │                  │
│ │ 🟡 Occupé (En mission)             │                  │
│ │ Commissariat Central               │                  │
│ │ 📍 Marché Sandaga                  │                  │
│ │ [Voir détails] [Carte]             │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Modal Détails Agent** :

```
┌──────────────────────────────────────┐
│ DÉTAILS DE L'AGENT                   │
├──────────────────────────────────────┤
│ Nom : SARR Mamadou                   │
│ Matricule : POL-2020-001234          │
│ Statut : 🟢 Disponible               │
│ Spécialité : Brigade de circulation  │
│                                      │
│ 📍 LOCALISATION GPS :                │
│ Lat: 14.6928, Lng: -17.4467         │
│ Avenue Léopold Sédar Senghor, Dakar  │
│                                      │
│ 📊 STATISTIQUES :                    │
│ • Vérifications : 145                │
│ • Alertes créées : 23                │
│ • Arrestations : 7                   │
│ • Missions : 56                      │
│                                      │
│ ID : uuid-1234-5678                  │
│                                      │
│ [Fermer]                             │
└──────────────────────────────────────┘
```

---

**Carte Interactive des Agents** :

```
┌──────────────────────────────────────────────────────────┐
│ 🗺️ CARTE DES AGENTS                                     │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐  │
│ │                                                    │  │
│ │  🔵 🔵 🔵 🔵 🔵  (5 agents disponibles)            │  │
│ │       🟡 🟡      (2 agents occupés)                │  │
│ │           ⚫     (1 agent hors ligne)              │  │
│ │                                                    │  │
│ │  Clic sur marqueur → Détails agent                │  │
│ │                                                    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ LÉGENDE :                                                │
│ 🔵 Disponible  🟡 Occupé  ⚫ Hors ligne                 │
└──────────────────────────────────────────────────────────┘
```

---

**Formulaire d'Assignation de Mission** ⭐ :

```
┌──────────────────────────────────────────────────────────┐
│ ASSIGNER UNE MISSION                                     │
├──────────────────────────────────────────────────────────┤
│ Agent assigné : Agent SARR Mamadou (POL-2020-001234)    │
│ Spécialité : Brigade de circulation                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 🔗 Lier à une alerte (optionnel) :                      │
│ [Sélectionner une alerte ▼]                             │
│                                                          │
│ ────────────────────────────────────                     │
│                                                          │
│ Titre de la mission * :                                 │
│ [Intervention vol de véhicule________________]          │
│                                                          │
│ Description * :                                          │
│ [Intervenir sur un vol de véhicule signalé              │
│  au marché Sandaga. Suspect en fuite avec un            │
│  Toyota Corolla noir (DK-5678-EF)...]                   │
│                                                          │
│ Priorité * :                                             │
│ ( ) Faible  ( ) Moyenne  ( ) Élevée  (•) Urgente       │
│                                                          │
│ 📍 LOCALISATION :                                        │
│ Latitude : [14.7000___]  Longitude : [-17.4500___]     │
│ Adresse : [Marché Sandaga, Dakar_____________]          │
│                                                          │
│ ☐ Utiliser la position actuelle de l'agent              │
│                                                          │
│ [Annuler]                        [Assigner la mission]  │
└──────────────────────────────────────────────────────────┘
```

**Résultat de l'assignation** :
```
✅ Mission assignée avec succès !
↓
• Mission créée (statut: assigned)
• Agent statut → Occupé
• Alerte liée (si applicable) → En investigation
• Notification push envoyée à l'agent
```

---

##### 3. **GESTION DES ALERTES**

**Liste des Alertes avec Triple Filtrage** :

```
┌──────────────────────────────────────────────────────────┐
│ 🚨 GESTION DES ALERTES                                   │
├──────────────────────────────────────────────────────────┤
│ FILTRES :                                                │
│ Statut : [Toutes ▼] Type : [Toutes ▼] Sévérité : [Toutes ▼]│
│ 🔍 Recherche : [_________________________________]       │
├──────────────────────────────────────────────────────────┤
│ 📊 STATISTIQUES :                                        │
│ Total : 6  |  Nouvelles : 2  |  En investigation : 3    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────────────────────┐                  │
│ │ 🚗 ACCIDENT                        │                  │
│ │ 🔴 Critique  🆕 Nouvelle           │                  │
│ │                                    │                  │
│ │ "Accident de la circulation..."   │                  │
│ │ 📍 Avenue Pompidou, Dakar          │                  │
│ │ ⏰ Il y a 5 minutes                │                  │
│ │ 👤 Source : Citoyen FALL           │                  │
│ │                                    │                  │
│ │ [Voir détails]                     │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
│ ┌────────────────────────────────────┐                  │
│ │ 🔥 INCENDIE                        │                  │
│ │ 🟠 Élevée  🔍 En investigation     │                  │
│ │                                    │                  │
│ │ "Incendie dans un bâtiment..."    │                  │
│ │ 📍 Marché Sandaga, Dakar           │                  │
│ │ ⏰ Il y a 12 minutes               │                  │
│ │ 📹 Source : Caméra Safe City       │                  │
│ │                                    │                  │
│ │ [Voir détails]                     │                  │
│ └────────────────────────────────────┘                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Modal Détails d'une Alerte** :

```
┌──────────────────────────────────────┐
│ DÉTAILS DE L'ALERTE                  │
├──────────────────────────────────────┤
│ 🚗 Type : ACCIDENT                   │
│ 🔴 Sévérité : Critique               │
│                                      │
│ DESCRIPTION :                        │
│ "Accident de la circulation avec     │
│  blessés. Deux véhicules impliqués   │
│  au croisement Avenue Pompidou..."   │
│                                      │
│ 📍 LOCALISATION :                    │
│ Avenue Pompidou, Dakar               │
│ Lat: 14.7000, Lng: -17.4500         │
│                                      │
│ 👤 SOURCE : Citoyen                  │
│ Créé par : FALL Souleymane           │
│                                      │
│ ⏰ HORODATAGE :                      │
│ 01/12/2024 10:30:00                  │
│                                      │
│ 🆔 ID : ALT-2024-5678                │
│                                      │
│ STATUT ACTUEL : 🆕 Nouvelle          │
│                                      │
│ 🎥 PREUVES JOINTES : [Image]        │
│                                      │
│ [Marquer "En investigation"]         │
│ [Assigner un agent]                  │
│ [Fermer]                             │
└──────────────────────────────────────┘
```

**Actions sur les alertes** :
- **Nouvelle** → "Marquer comme En investigation"
- **En investigation** → "Marquer comme Résolue"
- **Assigner un agent** → Ouvre formulaire de mission

---

##### 4. **SURVEILLANCE VIDÉO + ANALYSE IA** ⭐⭐⭐

**Grille de Flux Vidéo (6 caméras)** :

```
┌──────────────────────────────────────────────────────────┐
│ 📹 SURVEILLANCE VIDÉO + ANALYSE IA                       │
├──────────────────────────────────────────────────────────┤
│ Filtre : [Toutes ▼]                                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│ │ 📹 EN DIRECT│ │ 📹 EN DIRECT│ │ 📹 EN DIRECT│          │
│ │ [Flux vidéo]│ │ [Flux vidéo]│ │ [Flux vidéo]│          │
│ │            │ │            │ │            │          │
│ │ Corniche   │ │ Sandaga    │ │ Pompidou   │          │
│ │ Zone A     │ │ Marché     │ │ Avenue     │          │
│ │ ✅ Online   │ │ ⚠️ 2 détections│ │ ✅ Online   │          │
│ └────────────┘ └────────────┘ └────────────┘          │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│ │ 📹 EN DIRECT│ │ 📹 EN DIRECT│ │ 📹 HORS LIGNE│          │
│ │ [Flux vidéo]│ │ [Flux vidéo]│ │ [Pas d'image]│          │
│ │            │ │            │ │            │          │
│ │ Plateau    │ │ Medina     │ │ HLM        │          │
│ │ Centre     │ │ Nord       │ │ Zone 5     │          │
│ │ ✅ Online   │ │ ✅ Online   │ │ ❌ Offline  │          │
│ └────────────┘ └────────────┘ └────────────┘          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**Panneau d'Analyse IA (pour caméra sélectionnée)** :

```
┌──────────────────────────────────────┐
│ 🧠 ANALYSE IA - Corniche Zone A     │
├──────────────────────────────────────┤
│                                      │
│ ⚠️ CONFIANCE DE DÉTECTION DE MENACE │
│                                      │
│ ████████████████░░░░  94%           │
│                                      │
├──────────────────────────────────────┤
│ 📋 ÉVÉNEMENTS DÉTECTÉS :            │
│                                      │
│ 1. 🚗 Accident de la circulation    │
│    Confiance : 92%                   │
│    ⏰ 10:28:34                       │
│    ⚠️ ALERTE ÉLEVÉE                 │
│                                      │
│ 2. 🚶 Rassemblement anormal          │
│    Confiance : 78%                   │
│    ⏰ 10:25:12                       │
│                                      │
│ 3. 🚗 Plaque détectée : DK-1234-AB  │
│    Confiance : 95%                   │
│    ⏰ 10:22:05                       │
│                                      │
├──────────────────────────────────────┤
│ 💡 RECOMMANDATIONS IA :             │
│                                      │
│ • Envoyer l'unité de patrouille     │
│   la plus proche pour vérifier      │
│   le secteur.                        │
│                                      │
│ • Marquer les images pour examen    │
│   médico-légal.                      │
│                                      │
├──────────────────────────────────────┤
│ [Confirmer l'alerte] [Ignorer]      │
└──────────────────────────────────────┘
```

**Action "Confirmer l'alerte"** :
```
Contrôleur confirme
↓
⚡ CRÉATION AUTOMATIQUE D'UNE ALERTE OFFICIELLE :
  • Type : Accident (détecté)
  • Sévérité : Élevée (basée sur confiance 92%)
  • Localisation : Coordonnées de la caméra
  • Description : "Accident de la circulation détecté par IA"
  • Source : "camera"
  • Images : Captures d'écran du flux
↓
Alerte visible dans liste des alertes
↓
Notification envoyée aux agents disponibles dans la zone
```

**Action "Ignorer"** :
```
Contrôleur marque comme faux positif
↓
Détection archivée (apprentissage du modèle IA)
↓
Pas de création d'alerte
```

---

##### 5. **RAPPORTS ET STATISTIQUES**

```
┌──────────────────────────────────────────────────────────┐
│ 📊 STATISTIQUES & RAPPORTS                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Période : [01/12/2024 ▼] à [31/12/2024 ▼]              │
│ Niveau : [National ▼]                                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🌍 STATISTIQUES NATIONALES :                            │
│                                                          │
│ • Régions : 14                                          │
│ • Brigades : 156                                        │
│ • Agents totaux : 5,678                                 │
│ • Agents actifs : 4,567 (80%)                          │
│                                                          │
│ • Vérifications effectuées : 456,789                    │
│ • Alertes totales : 23,456                              │
│ • Arrestations : 5,678                                  │
│ • Missions complétées : 45,678                          │
│                                                          │
│ • Fonds récupérés (corruption) : 2.5B FCFA             │
│ • Récompenses versées (citoyens) : 250M FCFA           │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📈 TENDANCES :                                           │
│                                                          │
│ • Vérifications : +15% ↗️                               │
│ • Alertes : -5% ↘️ (moins de fausses alertes)          │
│ • Corruption détectée : +300% ↗️                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ [Générer Rapport PDF] [Exporter Excel]                  │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 TECHNOLOGIES UTILISÉES

### Backend (Unifié)
```
┌─────────────────────────────────────┐
│ Django 5.0 (Python)                 │
│ + Django Rest Framework             │
│ + PostgreSQL (Supabase)             │
│ + MinIO (Stockage S3)               │
│ + Google Gemini AI                  │
│ + JWT Authentication                │
└─────────────────────────────────────┘
```

**Intégrations** :
- ✅ ANCEC (État Civil - Vérification CNI)
- ✅ DGPN (Police - Matricules agents)
- ✅ HCGN (Gendarmerie - Matricules agents)
- ✅ DNPC (Sapeurs-Pompiers - Matricules)
- ✅ Justice (Casier judiciaire)
- ✅ DTT (Immatriculation véhicules)
- ✅ Safe City (Caméras de surveillance)
- ✅ OFNAC (Transmission alertes corruption)

### Frontend Portail Citoyen (Mobile)
```
┌─────────────────────────────────────┐
│ React Native                        │
│ + Expo SDK 54.0.0                   │
│ + TypeScript                        │
│ + AsyncStorage (stockage local)     │
│ + Biométrie (empreinte + photo)    │
│ + GPS Location (temps réel)         │
└─────────────────────────────────────┘
```

### Frontend Portail Agent (Mobile)
```
┌─────────────────────────────────────┐
│ React Native                        │
│ + Expo                              │
│ + TypeScript                        │
│ + Camera / Gallery                  │
│ + GPS Background Tracking           │
│ + Push Notifications                │
└─────────────────────────────────────┘
```

### Frontend Portail Contrôle (Web)
```
┌─────────────────────────────────────┐
│ React 19.2.0                        │
│ + Vite 7.2.4                        │
│ + TypeScript 5.9.3                  │
│ + React Router DOM 7.9.6            │
│ + Lucide React 0.555.0 (icônes)    │
│ + Leaflet (cartes interactives)    │
└─────────────────────────────────────┘
```

### Intelligence Artificielle
```
┌─────────────────────────────────────┐
│ Google Gemini AI                    │
│ + Triage d'alertes (NLP)           │
│ + Reconnaissance faciale (1:1)      │
│ + Analyse vidéo (Safe City)        │
│ + Détection deepfakes              │
│ + Cartographie prédictive          │
└─────────────────────────────────────┘
```

---

## 📊 IMPACT MESURABLE

### Tableau Comparatif "AVANT / APRÈS"

| **Métrique** | **AVANT** | **APRÈS KàttanX** | **Amélioration** |
|--------------|-----------|-------------------|------------------|
| ⏱️ **Temps de vérification d'identité** | 12 minutes | 3 secondes | **-99.6%** |
| 📡 **Diffusion d'alerte BOLO** | Manuelle (téléphone) | 2 secondes (automatique) | **Instantané** |
| ✅ **Taux d'alertes fiables** | 60% (40% fausses) | 98% (triage IA) | **+63%** |
| 👥 **Participation citoyenne** | <5% | 65% (grâce à KàttanX) | **+1200%** |
| 💰 **Fonds récupérés (corruption)** | 50M FCFA/an | 2.5B FCFA/an | **x50** |
| 🚨 **Cas de corruption détectés** | ~10/an | ~150/an | **+1400%** |
| 👮 **Efficacité opérationnelle agents** | 40% | 92% | **+130%** |
| 🚗 **Criminalité routière** | Base 100 | Base 55 | **-45%** |

---

### Impact Économique pour l'État

**Revenus potentiels** :

```
Loi 13/2025 - Fonds spécial :
┌────────────────────────────────────┐
│ Fonds détournés récupérés : 2.5B   │
│ Récompense citoyens (10%) : -250M  │
│ ────────────────────────────────   │
│ GAIN NET ÉTAT : 2.25B FCFA/an     │
└────────────────────────────────────┘

Coût du projet :
┌────────────────────────────────────┐
│ Phase 1 (MVP 6 mois) : 200M        │
│ Phase 2 (Intégrations 12 mois) : 350M│
│ Phase 3 (National 18 mois) : 500M  │
│ ────────────────────────────────   │
│ TOTAL : 1.05B FCFA                │
└────────────────────────────────────┘

ROI (Return on Investment) :
┌────────────────────────────────────┐
│ Gains annuels : 2.25B              │
│ Coût total : 1.05B                 │
│ ────────────────────────────────   │
│ RENTABILITÉ : 5 MOIS               │
│ ROI Année 1 : +114%                │
└────────────────────────────────────┘
```

---

### Impact Sociétal

**Pour les Citoyens** :
- ✅ Réduction du sentiment d'insécurité
- ✅ Contrôles d'identité plus rapides (3 sec vs 12 min)
- ✅ Pouvoir d'action concret contre la corruption
- ✅ Protection légale (Loi 13/2025)
- ✅ Récompense financière pour lanceurs d'alerte

**Pour les Forces de l'Ordre** :
- ✅ Gain de temps opérationnel (600% plus rapide)
- ✅ Décisions basées sur données fiables
- ✅ Coordination en temps réel
- ✅ Sécurité renforcée (info complète sur suspects)
- ✅ Outils modernes (IA, biométrie, GPS)

**Pour l'État** :
- ✅ Lutte efficace contre la corruption
- ✅ Rentabilisation de l'investissement Safe City
- ✅ Opérationnalisation de la Loi 13/2025
- ✅ Revenus supplémentaires (fonds récupérés)
- ✅ Amélioration de l'image du Sénégal (innovation)

---

## ⚖️ CONFORMITÉ LÉGALE ET ÉTHIQUE

### Cadre Juridique Sénégalais

#### 1️⃣ **Loi n° 2008-12 sur la Protection des Données Personnelles**

**Obligations** :
- ✅ Protection de la vie privée des citoyens
- ✅ Consentement explicite pour traitement des données
- ✅ Droit d'accès, de rectification et de suppression
- ✅ Sécurité des données personnelles

**Application dans KàttanX** :
```
• Consentement : Explicite lors de l'inscription
• Chiffrement : Toutes les données sensibles chiffrées
• Accès : Citoyen peut consulter/modifier ses données
• Suppression : Droit à l'oubli respecté
• Audit : Traçabilité de tous les accès
```

---

#### 2️⃣ **Commission des Données Personnelles (CDP)**

**Rôle** :
- Autorité de régulation OBLIGATOIRE
- Validation des traitements de données sensibles
- Contrôle de l'interconnexion des fichiers

**Démarche KàttanX** :
```
Phase 1 : Co-construction avec la CDP
  ↓
Phase 2 : Soumission du dossier complet
  • Architecture technique
  • Finalités du traitement
  • Mesures de sécurité
  • Privacy by Design
  ↓
Phase 3 : Autorisation formelle de la CDP
  ↓
Phase 4 : Déploiement légal
```

---

#### 3️⃣ **Loi n° 13/2025 sur les Lanceurs d'Alerte** ⭐

**Première en Afrique francophone** (Août 2025)

**Provisions clés** :
```
Article 1 : Protection des lanceurs d'alerte
  → Citoyen peut signaler anonymement

Article 5 : Fonds spécial de récompense
  → Jusqu'à 10% des fonds récupérés

Article 8 : Protection contre les représailles
  → Sanctions pour intimidation de lanceurs d'alerte

Article 12 : Opérateur technologique
  → KàttanX comme plateforme officielle (en cours)
```

**Impact pour KàttanX** :
- ✅ Base légale solide pour le pilier Citoyen
- ✅ Incitation financière légale (10%)
- ✅ Protection des utilisateurs garantie par la loi
- ✅ Partenariat avec l'OFNAC

---

#### 4️⃣ **Stratégie Nationale IA du Sénégal**

**Principes éthiques de l'IA** :
- ✅ Transparence des algorithmes
- ✅ Équité et non-discrimination
- ✅ Responsabilité humaine (IA assiste, n'impose pas)
- ✅ Respect de la vie privée

**Application dans KàttanX** :
```
Reconnaissance Faciale :
  • 1:1 (ciblée) et NON 1:N (masse)
  • Uniquement pour suspects recherchés
  • Validation humaine obligatoire
  • Audit des faux positifs

Triage d'Alertes :
  • Explication des décisions IA
  • Validation humaine finale
  • Apprentissage continu avec feedback

Analyse Vidéo :
  • Détection événements (pas surveillance de masse)
  • Alertes vérifiées par opérateur humain
  • Historique conservé (médico-légal)
```

---

### Privacy by Design

**Architecture de Sécurité** :

```
Niveau 1 : CHIFFREMENT
  • Toutes les données au repos (AES-256)
  • Toutes les communications (TLS 1.3)
  • Biométrie stockée hachée (irreversible)

Niveau 2 : ACCÈS CONTRÔLÉ
  • Authentification JWT (tokens temps limité)
  • 2FA pour contrôleurs
  • RBAC (Role-Based Access Control)
  • Audit de tous les accès

Niveau 3 : MINIMISATION
  • Collecte uniquement données nécessaires
  • Conservation limitée (RGPD-like)
  • Anonymisation des alertes citoyennes

Niveau 4 : AUDIT
  • Logs immuables de toutes les actions
  • Traçabilité complète
  • Conformité CDP vérifiable
```

---

## 🎯 DIFFÉRENCIATEURS CLÉS

### Ce qui rend KàttanX UNIQUE

#### 1. **Unification Complète** (Première au Sénégal)
```
KàttanX connecte pour la PREMIÈRE FOIS :
  • ANCEC (État Civil)
  • DGPN (Police)
  • HCGN (Gendarmerie)
  • Justice (Casier)
  • DTT (Véhicules)
  • Safe City (Caméras)
  • Citoyens
  • IA (Google Gemini)
↓
= 1 SEULE PLATEFORME UNIFIÉE
```

**Comparaison** :
- ❌ Projets actuels : Systèmes fragmentés
- ✅ KàttanX : Backend unifié

---

#### 2. **Loi 13/2025 Opérationnelle** (Unique en Afrique)
```
Autres pays :
  • Politique anti-corruption existe
  • Mais AUCUN outil de collecte à grande échelle
  • Pas d'incitation pour citoyens

KàttanX :
  • ✅ Outil de collecte (app mobile)
  • ✅ Triage IA (fiabilité)
  • ✅ Protection légale (Loi 13/2025)
  • ✅ Récompense financière (10% légal)
  • ✅ Partenariat OFNAC
↓
= OPÉRATIONNALISATION COMPLÈTE DE LA LOI
```

---

#### 3. **IA Éthique** (Reconnaissance 1:1, pas 1:N)
```
Surveillance de masse (1:N) :
  ❌ Scanner tous les visages dans une foule
  ❌ Créer des profils permanents
  ❌ Problème de vie privée majeur

KàttanX (1:1 ciblé) :
  ✅ Comparer UNE photo à UNE base de suspects
  ✅ Validation humaine obligatoire
  ✅ Audit des faux positifs
  ✅ Conforme CDP et Privacy by Design
```

---

#### 4. **Temps Réel** (Alertes < 2 secondes)
```
Système traditionnel :
  • Appel téléphonique
  • Dispatcher note manuellement
  • Rappel à chaque patrouille
  • ⏱️ Temps : 10-15 minutes

KàttanX :
  • Création alerte (agent ou citoyen)
  • Triage IA instantané
  • Push notification automatique
  • ⚡ Temps : < 2 secondes
↓
= 450x PLUS RAPIDE
```

---

#### 5. **ROI Prouvable** (2.5B FCFA/an récupérés)
```
Investissement gouvernement : 1.05B FCFA (18 mois)

Revenus annuels estimés :
  • Fonds corruption récupérés : 2.5B
  • Récompenses citoyens (10%) : -250M
  • ────────────────────────────────
  • GAIN NET : 2.25B FCFA/an

ROI :
  • Rentabilité : 5 mois
  • Année 1 : +114%
  • Année 2+ : +214% cumulé
```

**Comparaison** :
- Projets Safe City classiques : Coût pure (sécurité)
- KàttanX : **GÉNÉRATEUR DE REVENUS**

---

## 🚀 DÉPLOIEMENT ET TIMELINE

### Phase 1 : MVP (6 mois) - 200M FCFA

**Objectif** : Prototype fonctionnel pour validation

```
Mois 1-2 : Backend + Intégrations de base
  • Architecture Django
  • Connexion ANCEC (lecture seule)
  • Connexion DGPN (matricules)
  • Base PostgreSQL

Mois 3-4 : Applications mobiles
  • Portail Citoyen (inscription, dossier, alertes)
  • Portail Agent (vérification CNI, alertes BOLO)

Mois 5-6 : Dashboard Contrôle + Tests
  • Portail Web de contrôle
  • Tests utilisateurs (pilot)
  • Validation CDP (début processus)
```

**Livrables** :
- ✅ Backend opérationnel
- ✅ 2 apps mobiles fonctionnelles
- ✅ Dashboard web basique
- ✅ 100 utilisateurs pilotes (50 citoyens + 50 agents)

---

### Phase 2 : Intégrations Complètes (12 mois) - 350M FCFA

**Objectif** : Connexion à tous les organismes

```
Mois 1-3 : Intégrations Justice + DTT
  • API Casier judiciaire
  • API Immatriculation véhicules
  • Enrichissement des vérifications

Mois 4-6 : Safe City + IA
  • Connexion caméras Safe City
  • Google Gemini AI (reconnaissance faciale)
  • Analyse vidéo en temps réel
  • Triage d'alertes

Mois 7-9 : Loi 13/2025 + OFNAC
  • Partenariat OFNAC
  • Fonds spécial opérationnel
  • Système de récompense
  • Protection lanceurs d'alerte

Mois 10-12 : Déploiement régional (Dakar)
  • Formation de 500 agents
  • Campagne d'inscription citoyens
  • Validation CDP finale
  • Ajustements post-feedback
```

**Livrables** :
- ✅ Toutes les intégrations actives
- ✅ IA opérationnelle
- ✅ 10,000 citoyens inscrits
- ✅ 500 agents équipés
- ✅ Autorisation CDP obtenue

---

### Phase 3 : Déploiement National (18 mois) - 500M FCFA

**Objectif** : Couverture de tout le Sénégal

```
Mois 1-6 : Régions prioritaires
  • Dakar, Thiès, Saint-Louis, Kaolack
  • Formation de 2,000 agents
  • Campagne nationale d'inscription

Mois 7-12 : Extension nationale
  • 14 régions du Sénégal
  • Formation de 5,000 agents
  • Intégration Gendarmerie (zones rurales)

Mois 13-18 : Optimisation + Scalabilité
  • Infrastructure cloud scalable
  • Monitoring 24/7
  • Support technique national
  • Amélioration continue (IA)
```

**Livrables** :
- ✅ Couverture nationale complète
- ✅ 1M+ citoyens inscrits
- ✅ 5,000+ agents équipés
- ✅ 14 régions opérationnelles
- ✅ Système de support national

---

### Budget Total et Répartition

```
┌─────────────────────────────────────┐
│ BUDGET TOTAL : 1.05 MILLIARD FCFA  │
├─────────────────────────────────────┤
│ Phase 1 (MVP) : 200M (19%)         │
│ Phase 2 (Intégrations) : 350M (33%)│
│ Phase 3 (National) : 500M (48%)    │
└─────────────────────────────────────┘

RÉPARTITION PAR POSTE :
  • Développement logiciel : 400M (38%)
  • Infrastructure cloud : 250M (24%)
  • Intégrations API : 150M (14%)
  • Formation & déploiement : 150M (14%)
  • Marketing & communication : 100M (10%)
```

---

## 🎤 CONCLUSION

### Le Message Clé

> **KàttanX n'est pas juste un projet technologique.**
>
> **C'est une refonte du contrat entre l'État et ses citoyens.**

**Les forces de l'ordre** ont enfin les outils pour travailler efficacement.

**Les citoyens** ont enfin une voix et un pouvoir d'action concret.

**L'IA** crée du sens à partir de la data fragmentée.

**L'État** récupère les moyens de lutter contre la corruption.

---

### Pourquoi KàttanX doit gagner le GovAthon 2025

#### ✅ **Innovation Technique**
- Unification ANCEC + Justice + Police + Transports (1ère plateforme)
- IA éthique (1:1, pas surveillance de masse)
- Temps réel (< 2 secondes)

#### ✅ **Innovation Juridique**
- Loi 13/2025 opérationnalisée (unique Afrique francophone)
- Conformité CDP garantie
- Privacy by Design

#### ✅ **Innovation Sociale**
- Cercle vertueux : Corruption → Enquête → Citoyen récompensé
- Participation citoyenne : <5% → 65%
- Protection légale des lanceurs d'alerte

#### ✅ **Impact Économique**
- 2.5B FCFA/an récupérés
- ROI : 5 mois
- Temps vérification : ÷400

---

### Prochaines Étapes

**Court terme (3 mois)** :
1. Validation du jury GovAthon
2. Partenariat officiel avec la CDP
3. Signature convention OFNAC

**Moyen terme (6 mois)** :
4. Démarrage Phase 1 (MVP)
5. Recrutement équipe technique
6. Début des intégrations ANCEC/DGPN

**Long terme (18 mois)** :
7. Déploiement national complet
8. 1M+ citoyens actifs
9. 5,000+ agents équipés

---

### Contact

**Équipe KàttanX**
- 📧 Email : contact@kattanx.sn
- 🌐 Site : www.kattanx.sn (en construction)
- 📱 WhatsApp : +221 XX XXX XXXX

**GovAthon 2025 - Catégorie Justice**

---

## 🙏 MERCI

**Le Sénégal innove. Le Sénégal transforme.**

**KàttanX : Sécurité Participative. Justice Unifiée.**
