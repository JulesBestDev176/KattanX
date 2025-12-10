# 📱 Implémentation de l'Inscription - Application Citoyen

## ✅ Ce qui a été implémenté

### 1. Service API (`src/utils/api.ts`)

Service complet pour communiquer avec le backend Django :

- ✅ `inscriptionEtape1()` - Vérification ANCEC
- ✅ `sendOTP()` - Envoi code OTP
- ✅ `verifyOTP()` - Vérification code OTP
- ✅ `inscriptionEtape2()` - Authentification + génération numéro unique
- ✅ `uploadPhoto()` - Upload photo de profil
- ✅ `enregistrerEmpreinte()` - Enregistrement empreinte digitale
- ✅ `inscriptionEtape3()` - Finalisation inscription
- ✅ `login()` - Connexion utilisateur

**Configuration** :
- URL développement : `http://localhost:8000/api`
- URL production : `https://api.citizenportal.sn/api` (à configurer)

### 2. Composants d'Inscription

#### `InscriptionEtape1.tsx`
- Formulaire : Nom, Prénom, CNI, Date de naissance, Lieu de naissance
- Validation format CNI (13 chiffres)
- Vérification âge minimum (18 ans)
- Appel API vérification ANCEC
- Affichage état de vérification

#### `InscriptionEtape2.tsx`
- Formulaire : Téléphone, Email (optionnel), Mot de passe
- Envoi OTP par WhatsApp
- Vérification OTP (6 chiffres, 10 minutes, 3 tentatives)
- Génération numéro unique (CIT-2024-XXXXXX)
- Validation mot de passe

#### `InscriptionEtape3.tsx`
- Capture photo (caméra ou galerie)
- Upload photo vers MinIO
- Enregistrement empreinte digitale (simulation)
- Finalisation inscription
- Génération tokens JWT

### 3. Écran d'Authentification (`AuthScreen.tsx`)

Refactorisé pour utiliser les 3 composants d'étape :

- ✅ Navigation entre les 3 étapes
- ✅ Persistance des données entre étapes
- ✅ Gestion de session
- ✅ Connexion avec email/téléphone/numéro unique
- ✅ Stockage tokens et utilisateur

### 4. Types TypeScript

Mis à jour dans `src/types/index.ts` :

```typescript
interface User {
  id: string;
  email?: string;
  name: string;
  cni: string;
  tel: string;
  photo?: string;
  numeroIdentificationUnique?: string; // CIT-2024-XXXXXX
  roles?: string[]; // ['CITOYEN']
}
```

### 5. Stockage Local

Mis à jour dans `src/utils/storage.ts` :

- ✅ `saveSessionId()` / `getSessionId()` - Persistance session inscription
- ✅ `saveRefreshToken()` / `getRefreshToken()` - Refresh token JWT

## 📋 Processus d'Inscription Complet

### ÉTAPE 1 : Informations de Base

```
1. Utilisateur saisit : Nom, Prénom, CNI, Date naissance, Lieu naissance
2. Validation format (CNI 13 chiffres, âge >= 18)
3. POST /api/auth/register/citoyen/etape1
4. Vérification ANCEC (backend)
5. Si succès → Étape 2
```

### ÉTAPE 2 : Authentification

```
1. Utilisateur saisit : Téléphone, Email (optionnel)
2. POST /api/auth/send-otp → Code envoyé par WhatsApp
3. Utilisateur saisit code OTP (6 chiffres)
4. POST /api/auth/verify-otp → Validation
5. Utilisateur saisit mot de passe
6. POST /api/auth/register/citoyen/etape2
7. Numéro unique généré (CIT-2024-XXXXXX)
8. Si succès → Étape 3
```

### ÉTAPE 3 : Biométrie

```
1. Capture photo (caméra ou galerie)
2. POST /api/images/upload-photo/ → Upload vers MinIO
3. Enregistrement empreinte (simulation)
4. POST /api/auth/register/citoyen/etape3
5. Compte créé + Tokens JWT générés
6. Connexion automatique
```

## 🔧 Configuration Requise

### Backend Django

1. **Démarrer le serveur** :
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Créer les migrations** :
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Vérifier les endpoints** :
   - `POST http://localhost:8000/api/auth/register/citoyen/etape1`
   - `POST http://localhost:8000/api/auth/send-otp`
   - `POST http://localhost:8000/api/auth/register/citoyen/etape2`
   - `POST http://localhost:8000/api/auth/register/citoyen/etape3`
   - `POST http://localhost:8000/api/auth/login`

### Frontend React Native

1. **Installer les dépendances** :
   ```bash
   cd citoyen
   npm install
   # ou
   yarn install
   ```

2. **Installer expo-image-picker** :
   ```bash
   npx expo install expo-image-picker
   ```

3. **Démarrer l'application** :
   ```bash
   npm start
   # ou
   npx expo start
   ```

## 🧪 Tests

### Test Étape 1

```json
POST /api/auth/register/citoyen/etape1
{
  "nom": "FALL",
  "prenom": "Souleymane",
  "numeroCNI": "1663200000432",
  "dateNaissance": "2000-10-10",
  "lieuNaissance": "Dakar"
}
```

### Test Étape 2

```json
POST /api/auth/send-otp
{
  "telephone": "+221775551234"
}

POST /api/auth/register/citoyen/etape2
{
  "telephone": "+221775551234",
  "email": "souleymane.fall@example.com",
  "mot_de_passe": "MotDePasse123!",
  "confirmation_mot_de_passe": "MotDePasse123!",
  "code_otp": "123456",
  "type_inscription": "CITOYEN"
}
```

### Test Étape 3

```json
POST /api/auth/register/citoyen/etape3
{
  "sessionId": "SESSION-1234567890",
  "donnees_etape1": {...},
  "donnees_etape2": {...},
  "photo_id": "uuid",
  "empreinte_id": "uuid"
}
```

## 📝 Notes Importantes

1. **OTP en développement** : Le code OTP est retourné dans la réponse (à retirer en production)

2. **Upload Photo** : Actuellement simulé, à connecter avec l'endpoint réel `/api/images/upload-photo/`

3. **Empreinte** : Actuellement simulée, à connecter avec un capteur réel

4. **Session** : Les données entre étapes sont stockées dans le state React (à migrer vers Redis en production)

5. **Validation** : Toutes les validations sont faites côté frontend ET backend

## 🚀 Prochaines Étapes

- [ ] Connecter l'upload photo avec l'endpoint réel
- [ ] Intégrer un capteur d'empreinte réel
- [ ] Implémenter la persistance de session avec Redis
- [ ] Ajouter les tests unitaires
- [ ] Configurer l'URL de production
- [ ] Intégrer l'API ANCEC réelle
- [ ] Intégrer l'API WhatsApp Business réelle

---

**Version** : 1.0.0  
**Date** : Décembre 2024

