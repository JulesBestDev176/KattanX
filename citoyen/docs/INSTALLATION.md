# Guide d'installation - KattanX Mobile

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 16 ou supérieure)
   - Télécharger depuis : https://nodejs.org/
   - Vérifier l'installation : `node --version`

2. **npm** (inclus avec Node.js)
   - Vérifier l'installation : `npm --version`

3. **Expo CLI** (optionnel, mais recommandé)
   ```bash
   npm install -g expo-cli
   ```

4. **Application Expo Go** sur votre téléphone
   - Android : https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS : https://apps.apple.com/app/expo-go/id982107779

## 🔧 Installation

### Étape 1 : Installer les dépendances

```bash
cd mobile
npm install
```

Cette commande installera toutes les dépendances nécessaires définies dans `package.json`.

### Étape 2 : Configuration de Supabase

1. Ouvrir le fichier `src/utils/supabase.ts`
2. Remplacer les valeurs suivantes :

```typescript
export const projectId = 'VOTRE_PROJECT_ID'; // Remplacer par votre ID de projet Supabase
export const publicAnonKey = 'VOTRE_ANON_KEY'; // Remplacer par votre clé publique Supabase
```

Pour obtenir ces valeurs :
- Connectez-vous à votre projet Supabase
- Allez dans Settings > API
- Copiez le `Project URL` (extraire l'ID du projet)
- Copiez la clé `anon/public`

## 🚀 Lancement de l'application

### Option 1 : Expo Go (Recommandé pour le développement)

1. Démarrer le serveur de développement :
```bash
npm start
```

2. Scanner le QR code avec :
   - **Android** : Application Expo Go
   - **iOS** : Caméra native (qui ouvrira Expo Go)

### Option 2 : Émulateur Android

1. Installer Android Studio : https://developer.android.com/studio
2. Configurer un émulateur Android (AVD)
3. Lancer l'émulateur
4. Exécuter :
```bash
npm run android
```

### Option 3 : Simulateur iOS (Mac uniquement)

1. Installer Xcode depuis l'App Store
2. Installer les outils en ligne de commande :
```bash
xcode-select --install
```
3. Exécuter :
```bash
npm run ios
```

### Option 4 : Web (pour tester rapidement)

```bash
npm run web
```

## 📱 Test de l'application

### Comptes de test

Utilisez ces identifiants pour tester l'application :

**Utilisateur 1 :**
- Email : `user1@test.com`
- Mot de passe : `password123`

**Utilisateur 2 :**
- Email : `user2@test.com`
- Mot de passe : `password123`

### Tester l'inscription

1. Cliquer sur "Pas de compte ? S'inscrire"
2. Remplir le formulaire
3. Un code OTP sera généré et affiché (mode démo)
4. Entrer le code OTP pour créer le compte

## 🐛 Dépannage

### Problème : "Metro bundler not found"
```bash
npm install --global expo-cli
expo start
```

### Problème : "Unable to resolve module"
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Problème : Port déjà utilisé
```bash
npm start -- --port 8081
```

### Problème : Erreur de connexion à Supabase
- Vérifier que les identifiants Supabase sont corrects
- Vérifier la connexion internet
- Vérifier que le backend Supabase est actif

## 📦 Build de production

### Android (APK)

1. Configurer EAS Build :
```bash
npm install -g eas-cli
eas login
eas build:configure
```

2. Build APK :
```bash
eas build -p android --profile preview
```

### iOS (IPA)

1. Avoir un compte Apple Developer
2. Configurer les certificats
3. Build :
```bash
eas build -p ios --profile preview
```

## 🔄 Mise à jour

Pour mettre à jour les dépendances :

```bash
npm update
```

Pour mettre à jour Expo :

```bash
expo upgrade
```

## 📚 Documentation utile

- **React Native** : https://reactnative.dev/
- **Expo** : https://docs.expo.dev/
- **Supabase** : https://supabase.com/docs
- **TypeScript** : https://www.typescriptlang.org/docs/

## 💡 Conseils

1. **Développement** : Utilisez Expo Go pour un rechargement rapide
2. **Débogage** : Utilisez React Native Debugger ou Flipper
3. **Performance** : Testez sur de vrais appareils, pas seulement des émulateurs
4. **Réseau** : Assurez-vous que votre téléphone et votre ordinateur sont sur le même réseau WiFi

## 🆘 Support

En cas de problème :
1. Vérifier les logs dans le terminal
2. Vérifier les erreurs dans l'application Expo Go
3. Consulter la documentation Expo
4. Vérifier les issues GitHub de React Native

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Tester sur Android
- [ ] Tester sur iOS
- [ ] Vérifier toutes les fonctionnalités
- [ ] Tester avec différentes connexions réseau
- [ ] Vérifier la sécurité des tokens
- [ ] Optimiser les images
- [ ] Tester les erreurs réseau
- [ ] Vérifier les permissions
- [ ] Préparer les icônes et splash screens
- [ ] Configurer les variables d'environnement



