# 📚 Documentation Backend - Citizen Portal

## Vue d'ensemble

Ce dossier contient toute la documentation technique du backend Django pour le système Citizen Portal.

## 📖 Documents disponibles

### 1. [Intégration avec les Organismes Officiels du Sénégal](./INTEGRATION_ORGANISMES_SENEGAL.md)

Documentation complète sur l'intégration avec les organismes officiels sénégalais :

- **Organismes** : ANCEC, DGPN, HCGN, DNPC, DTT, etc.
- **Gestion biométrique** : Standards ANCEC, formats, validation
- **Hiérarchie des grades** : Police, Gendarmerie, Pompiers
- **Processus d'enrôlement** : CNI biométrique, recrutement agents
- **API Endpoints** : Vérification biométrique, validation formats
- **Sécurité** : Protection des données, authentification

### 2. [Configuration MinIO pour le Stockage d'Images](./MINIO_SETUP.md)

Guide complet pour configurer MinIO (compatible S3) :

- **Installation** : Docker ou serveur dédié
- **Configuration Django** : Intégration avec django-storages
- **Upload d'images** : Photos d'identité, signatures
- **Sécurité** : URLs signées, permissions
- **Tests** : Commandes de test et validation

## 🏗️ Architecture

### Structure des modèles

```
backend/api/models/
├── __init__.py          # Importations globales
├── enums.py             # Enums (Grades, Types, etc.)
├── citoyen.py           # Modèles citoyens et biométrie
├── organismes.py        # Modèles organismes officiels
├── agents.py            # Modèles agents forces de l'ordre
└── utils.py             # Utilitaires hiérarchie
```

### Services

```
backend/api/services/
├── __init__.py
├── biometrie.py         # Service gestion biométrique
└── verification.py       # Service validation formats
```

### Endpoints API

#### Biométrie
- `POST /api/biometrie/verifier-empreinte/` : Vérification 1:1
- `POST /api/biometrie/identifier-personne/` : Identification 1:N
- `POST /api/biometrie/verifier-faciale/` : Reconnaissance faciale

#### Vérification
- `POST /api/verification/valider-cni/` : Valider format CNI
- `POST /api/verification/valider-matricule/` : Valider format matricule

#### Citoyens
- `GET /api/citoyens/` : Liste des citoyens
- `POST /api/citoyens/` : Créer un citoyen
- `GET /api/citoyens/{id}/` : Détails d'un citoyen
- `PUT /api/citoyens/{id}/` : Mettre à jour
- `DELETE /api/citoyens/{id}/` : Supprimer

#### Prestations
- `POST /api/prestations/` : Recevoir messages prestations médicales

#### Gemini AI
- `POST /api/gemini/chat/` : Chat avec Gemini
- `POST /api/gemini/analyze-prestation/` : Analyser prestation

#### Images
- `POST /api/images/upload-photo/` : Uploader une photo d'identité
- `POST /api/images/upload-signature/` : Uploader une signature
- `POST /api/images/validate/` : Valider une image avant upload

## 🔧 Utilisation

### Installation

```bash
# Créer environnement virtuel
python -m venv venv
venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Configurer .env
cp env.example .env
# Éditer .env avec vos clés

# Migrations
python manage.py makemigrations
python manage.py migrate

# Initialiser organismes
python manage.py init_organismes

# Créer superutilisateur
python manage.py createsuperuser

# Lancer serveur
python manage.py runserver
```

### Commandes de management

- `python manage.py test_db_connection` : Tester connexion Supabase
- `python manage.py init_organismes` : Initialiser organismes officiels

## 📊 Standards et Formats

### CNI ANCEC
- Format : `AAAAMMJJNNNNN` (13 chiffres)
- Validation : `ServiceVerification.valider_format_cni()`

### Matricules
- Police : `POL-AAAA-NNNNNN`
- Gendarmerie : `GEN-AAAA-NNNNNN`
- Pompiers : `POM-AAAA-NNNNNN`

### Biométrie
- Empreintes : ISO/IEC 19794-2, 500 DPI minimum, qualité > 80
- Photo : ISO/IEC 19794-5, 300x400 minimum, max 100 KB
- Faciale : FaceNet/ArcFace, seuil 0.6

## 🔐 Sécurité

- Chiffrement des données biométriques
- Authentification JWT
- Validation stricte des formats
- Audit des accès

## 📞 Support

Pour toute question, consulter la documentation détaillée dans les fichiers individuels.

---

**Version** : 2.0.0  
**Dernière mise à jour** : Décembre 2024

