# Backend - Citizen Portal API

Backend Django REST Framework pour l'application Citizen Portal.

## 📚 Documentation

Pour la documentation complète, voir le dossier [`docs/`](./docs/) :

- **[Intégration avec les Organismes Officiels du Sénégal](./docs/INTEGRATION_ORGANISMES_SENEGAL.md)** : Documentation complète sur ANCEC, forces de l'ordre, biométrie, etc.

## Installation

1. Créer un environnement virtuel:
```bash
python -m venv venv
```

2. Activer l'environnement virtuel:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Installer les dépendances:
```bash
pip install -r requirements.txt
```

4. Créer un fichier `.env` à partir de `env.example`:
```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

5. Configurer les variables d'environnement dans `.env`:
   - **SECRET_KEY**: Générer une clé secrète Django (voir ci-dessous)
   - **DB_PASSWORD**: Récupérer depuis Supabase Dashboard > Settings > Database
   - **GEMINI_API_KEY**: Clé API Google Gemini AI
   - **SUPABASE_ANON_KEY**: Récupérer depuis Supabase Dashboard > Settings > API (optionnel)
   - **SUPABASE_SERVICE_ROLE_KEY**: Récupérer depuis Supabase Dashboard > Settings > API (optionnel)

### Configuration Supabase

**Projet:** kattanX  
**Project ID:** vtsxyghzmqscmvzxqdiz  
**URL:** https://vtsxyghzmqscmvzxqdiz.supabase.co

Pour obtenir le mot de passe de la base de données:
1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner le projet **kattanX**
3. Aller dans **Settings** > **Database**
4. Copier le **Database Password** (ou réinitialiser si nécessaire)
5. Coller dans le fichier `.env` comme valeur de `DB_PASSWORD`

Pour générer une SECRET_KEY Django:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

6. Tester la connexion à Supabase:
```bash
python manage.py test_db_connection
```

7. Appliquer les migrations:
```bash
python manage.py migrate
```

8. Créer un superutilisateur (optionnel):
```bash
python manage.py createsuperuser
```

9. Générer des données de test (optionnel):
```bash
python manage.py generate_test_data
```
Cela génère 10 citoyens, 10 agents (Police, Gendarmerie, Pompiers) et 10 véhicules.

10. Lancer le serveur de développement:
```bash
python manage.py runserver
```

## Structure du projet

- `config/`: Configuration principale du projet Django
  - `settings.py`: Configuration Django avec connexion Supabase
  - `supabase.py`: Configuration Supabase (optionnel)
- `api/`: Application principale contenant les endpoints API
  - `models.py`: Modèles Django pour Citoyen, Adresse, Contact, Biométrie, etc.
  - `views.py`: Vues API pour gérer les prestations et Gemini AI
  - `serializers.py`: Sérialiseurs pour la validation des données
  - `admin.py`: Configuration de l'administration Django
  - `urls.py`: Routes API
  - `gemini_service.py`: Service pour intégrer Google Gemini AI
  - `management/commands/`: Commandes Django personnalisées
    - `test_db_connection.py`: Teste la connexion à Supabase

## Endpoints API

### Prestations
- `POST /api/prestations/`: Recevoir les messages de prestations médicales

### Authentification
- `POST /api/auth/token/`: Obtenir un token JWT
- `POST /api/auth/token/refresh/`: Rafraîchir un token JWT

### Gemini AI
- `POST /api/gemini/chat/`: Chat avec Gemini AI
  - Body: `{"prompt": "Votre question", "temperature": 0.7, "max_tokens": 2048}`
- `POST /api/gemini/analyze-prestation/`: Analyser une prestation médicale avec Gemini AI
  - Body: `{"prestation": {...}}`

### Citoyens
- `GET /api/citoyens/`: Liste des citoyens (avec pagination)
- `GET /api/citoyens/{id}/`: Détails d'un citoyen
- `POST /api/citoyens/`: Créer un nouveau citoyen
- `PUT /api/citoyens/{id}/`: Mettre à jour un citoyen
- `PATCH /api/citoyens/{id}/`: Mettre à jour partielle d'un citoyen
- `DELETE /api/citoyens/{id}/`: Supprimer un citoyen
- `GET /api/citoyens/search/?q={query}`: Rechercher des citoyens

### Biométrie
- `POST /api/biometrie/verifier-empreinte/`: Vérification 1:1 par empreinte digitale
  - Body: `{"citoyen_id": "uuid", "doigt": "POUCE_DROIT", "template": "...", "qualite": 90}`
- `POST /api/biometrie/identifier-personne/`: Identification 1:N par empreinte
  - Body: `{"doigt": "POUCE_DROIT", "template": "..."}`
- `POST /api/biometrie/verifier-faciale/`: Vérification par reconnaissance faciale
  - Body: `{"citoyen_id": "uuid", "encodage_facial": "..."}`

### Vérification
- `POST /api/verification/valider-cni/`: Valider le format d'un numéro CNI
  - Body: `{"numero_cni": "1995032512345"}`
- `POST /api/verification/valider-matricule/`: Valider le format d'un matricule
  - Body: `{"matricule": "POL-2024-123456", "type_force": "POLICE_NATIONALE"}`

## Types de messages supportés

Le backend supporte maintenant tous les types de messages, y compris:
- `SAVE_PRESCRIPTION_FINANCIERE` (nouvellement ajouté)
- `CONSULTATION`
- `SAVE_PRESTATION`
- Et tous les autres types listés dans `api/views.py`

## Tests

### Tester l'endpoint Prestations

```bash
curl -X POST http://localhost:8000/api/prestations/ \
  -H "Content-Type: application/json" \
  -d '{
    "messageType": "SAVE_PRESCRIPTION_FINANCIERE",
    "organismId": "51",
    "organismName": "HOPITAL ADMIN",
    "action": "CONSULTATION",
    "data": {...}
  }'
```

### Tester Gemini AI Chat

```bash
curl -X POST http://localhost:8000/api/gemini/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explique-moi ce qu'est une consultation médicale",
    "temperature": 0.7
  }'
```

### Tester l'analyse de prestation avec Gemini

```bash
curl -X POST http://localhost:8000/api/gemini/analyze-prestation/ \
  -H "Content-Type: application/json" \
  -d '{
    "prestation": {
      "messageType": "CONSULTATION",
      "data": {...}
    }
  }'
```

## 🚫 Endpoints Mobiles Désactivés

**Note:** Les connexions vers les applications mobiles (citoyen et agent) sont temporairement désactivées.

### Endpoints Désactivés

Les endpoints suivants sont commentés dans `api/urls.py` et ne sont plus accessibles :

- **Inscription mobile** : `/api/auth/register/citoyen/*`, `/api/auth/register/agent/*`
- **OTP WhatsApp** : `/api/auth/send-otp`, `/api/auth/verify-otp`
- **Biométrie** : `/api/biometrie/*`, `/api/verification/*`
- **Images** : `/api/images/*`
- **Services citoyens** : `/api/citoyens/documents/`, `/api/denonciations/*`, `/api/plaintes/*`, `/api/revenus/`, `/api/transfer/`
- **Alertes d'urgence** : `/api/alertes-urgence/*`

### Endpoints Actifs (Portail Web)

Les endpoints suivants restent actifs pour le portail web de contrôle :

- **Authentification** : `/api/auth/login`, `/api/auth/token/*`
- **Prestations** : `/api/prestations/`
- **Gemini AI** : `/api/gemini/*`
- **Citoyens** : `/api/citoyens/*` (ViewSet complet)

### Réactivation des Endpoints Mobiles

Pour réactiver les connexions mobiles :

1. **Décommenter les origines CORS** dans `config/settings.py` :
   ```python
   CORS_ALLOWED_ORIGINS = [
       'http://localhost:19006',  # Expo web
       'http://localhost:8081',   # Metro bundler
       'exp://localhost:8081',    # Expo dev client
       # ... autres origines
   ]
   ```

2. **Décommenter les endpoints** dans `api/urls.py` :
   - Rechercher la section `# ========== ENDPOINTS MOBILES DÉSACTIVÉS ==========`
   - Décommenter les lignes `path(...)` nécessaires

3. **Redémarrer le serveur** :
   ```bash
   python manage.py runserver
   ```

