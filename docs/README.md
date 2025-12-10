# 📚 Documentation Citizen Portal

Bienvenue dans la documentation complète du système Citizen Portal.

## 📖 Vue d'ensemble

Le système Citizen Portal est une plateforme complète de gestion citoyenne et de sécurité publique pour le Sénégal. Il comprend trois applications principales :

1. **Application Citoyen** (Mobile) - Pour les citoyens sénégalais
2. **Application Agent** (Mobile) - Pour les agents des forces de l'ordre
3. **Portail de Contrôle** (Web) - Pour les contrôleurs et superviseurs

## 📋 Documentation disponible

### Documentation Générale

- **[Responsabilités des Acteurs](./RESPONSABILITES_ACTEURS.md)** 📋
  - Description détaillée des responsabilités de chaque acteur
  - Permissions et limitations
  - Interactions entre acteurs
  - Flux de données

### Documentation par Acteur

- **[Documentation Citoyen](./CITOYEN.md)** 🏛️
  - Processus d'inscription (3 étapes)
  - Gestion du profil personnel
  - Gestion des documents
  - Signalement et dénonciations
  - Gestion des plaintes
  - Gestion des revenus
  - Modèles de données complets
  - Endpoints API détaillés

- **[Documentation Agent](./AGENT.md)** 👮
  - Processus d'inscription agent (3 étapes + matricule)
  - Gestion du service et GPS tracking
  - Vérification d'identité (3 méthodes : CNI/Matricule/Photo)
  - Gestion des alertes en temps réel
  - Gestion des missions
  - Hiérarchie et grades
  - Comptes rendus
  - Modèles de données complets
  - Endpoints API détaillés

- **[Documentation Contrôleur](./CONTROLEUR.md)** 🎛️
  - Dashboard et surveillance en temps réel (4 métriques + carte)
  - Gestion des agents (liste, filtres, carte, assignation missions)
  - Gestion des alertes (triple filtrage, changement statut)
  - Coordination des interventions (formulaire mission complet)
  - Surveillance vidéo et analyse IA (6 caméras, détections, recommandations)
  - Gestion des brigades et supervision
  - Comptes rendus (validation, compléments)
  - Rapports et statistiques (régional/national)
  - Modèles de données complets
  - Endpoints API détaillés

### Documentation Backend

La documentation technique du backend Django est disponible dans le dossier `backend/docs/` :

- **[README Backend](../backend/docs/README.md)** - Vue d'ensemble du backend
- **[Intégration Organismes Officiels](../backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)** - Intégration avec ANCEC, DGPN, HCGN, etc.
- **[Données de Test](../backend/docs/TEST_DATA.md)** - Guide pour générer des données de test
- **[Configuration MinIO](../backend/docs/MINIO_SETUP.md)** - Configuration du stockage d'images
- **[Démarrage Rapide MinIO](../backend/docs/MINIO_QUICK_START.md)** - Guide rapide MinIO

### Documentation Applications

#### Application Citoyen

La documentation de l'application mobile citoyen est disponible dans `citoyen/docs/` :

- **[Guide de Démarrage](../citoyen/docs/START_HERE.md)** - Commencez ici
- **[Installation](../citoyen/docs/INSTALLATION.md)** - Guide d'installation
- **[Configuration Supabase](../citoyen/docs/SUPABASE_SETUP.md)** - Configuration de la base de données
- **[Configuration WhatsApp](../citoyen/docs/WHATSAPP_SETUP.md)** - Intégration WhatsApp

#### Application Agent

- **[README Agent](../agent/README.md)** - Documentation de l'application agent

#### Portail de Contrôle

- **[README Control Portal](../control-portal/README.md)** - Documentation du portail web

## 🏗️ Architecture du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    CITIZEN PORTAL SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Citoyen    │    │    Agent     │    │ Contrôleur   │  │
│  │   (Mobile)   │    │   (Mobile)   │    │    (Web)     │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │           │
│         └───────────────────┴────────────────────┘           │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   Backend API   │                        │
│                   │    (Django)     │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐  ┌────────▼────────┐  ┌──────▼──────┐      │
│  │  Supabase   │  │     MinIO      │  │   Gemini    │      │
│  │ (PostgreSQL)│  │  (Stockage)    │  │     AI      │      │
│  └─────────────┘  └────────────────┘  └─────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 👥 Acteurs du Système

### 1. Citoyens
Les citoyens sénégalais utilisent l'application mobile pour :
- Gérer leur profil personnel
- Consulter leurs documents
- Signaler des incidents
- Déposer des plaintes
- Déclarer leurs revenus

**Voir** : [Responsabilités des Citoyens](./RESPONSABILITES_ACTEURS.md#-1-citoyens)

### 2. Agents des Forces de l'Ordre
Les agents (Police, Gendarmerie, Pompiers) utilisent l'application mobile pour :
- Vérifier l'identité des citoyens
- Gérer leur service
- Traiter les alertes
- Exécuter les missions

**Voir** : [Responsabilités des Agents](./RESPONSABILITES_ACTEURS.md#-2-agents-des-forces-de-lordre)

### 3. Contrôleurs
Les contrôleurs utilisent le portail web pour :
- Surveiller les opérations en temps réel
- Gérer les agents
- Coordonner les interventions
- Analyser les données

**Voir** : [Responsabilités des Contrôleurs](./RESPONSABILITES_ACTEURS.md#-3-contrôleurs-portail-de-contrôle)

## 🔐 Sécurité

- Authentification JWT pour tous les acteurs
- Permissions basées sur les rôles (RBAC)
- Chiffrement des données biométriques
- Audit de toutes les actions importantes
- Conformité avec les lois sénégalaises sur la protection des données

## 🔗 Intégrations

Le système s'intègre avec :

- **ANCEC** - Agence Nationale de la Carte d'Identité et de l'État Civil
- **DGPN** - Direction Générale de la Police Nationale
- **HCGN** - Haut Commandement de la Gendarmerie Nationale
- **DNPC** - Direction Nationale de la Protection Civile
- **DTT** - Direction des Transports Terrestres

**Voir** : [Intégration Organismes Officiels](../backend/docs/INTEGRATION_ORGANISMES_SENEGAL.md)

## 📊 Technologies Utilisées

### Backend
- **Django** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** (Supabase) - Base de données
- **MinIO** - Stockage d'objets (S3-compatible)
- **Gemini AI** - Intelligence artificielle

### Frontend Mobile
- **React Native** - Framework mobile
- **Expo** - Outils de développement
- **TypeScript** - Langage de programmation

### Frontend Web
- **React** - Bibliothèque UI
- **Vite** - Build tool
- **TypeScript** - Langage de programmation

## 🚀 Démarrage Rapide

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp env.example .env
# Éditer .env avec vos clés
python manage.py migrate
python manage.py runserver
```

### Application Citoyen

```bash
cd citoyen
npm install
npm start
```

### Application Agent

```bash
cd agent
npm install
npm start
```

### Portail de Contrôle

```bash
cd control-portal
npm install
npm run dev
```

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation appropriée
2. Vérifiez les issues existantes
3. Contactez l'équipe de développement

## 📝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Lire la documentation
2. Suivre les conventions de code
3. Créer des issues pour les bugs
4. Proposer des améliorations

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Équipe** : Citizen Portal Development Team

