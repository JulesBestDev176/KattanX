# Guide : Tester avec un Émulateur Android

## Option 1 : Émulateur Android (Recommandé pour le développement)

### Installation

1. **Installer Android Studio** :
   - Téléchargez depuis : https://developer.android.com/studio
   - Installez Android Studio avec Android SDK

2. **Configurer un AVD (Android Virtual Device)** :
   - Ouvrez Android Studio
   - Allez dans **Tools > Device Manager**
   - Cliquez sur **Create Device**
   - Choisissez un appareil (ex: Pixel 5)
   - Choisissez une version d'Android (ex: Android 13)
   - Cliquez sur **Finish**

3. **Démarrer l'émulateur** :
   - Dans Device Manager, cliquez sur ▶️ (Play) à côté de votre AVD
   - Attendez que l'émulateur démarre

### Configuration de l'application

1. **Modifier `citoyen/src/config/api.config.ts`** :
   ```typescript
   export const LOCAL_IP = '10.0.2.2';  // IP spéciale pour émulateur Android
   ```

2. **Démarrer le backend Django** :
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

3. **Démarrer Expo** :
   ```bash
   cd citoyen
   npm start
   ```

4. **Lancer sur l'émulateur** :
   - Dans le terminal Expo, appuyez sur `a` pour lancer sur Android
   - Ou utilisez : `npm run android`

### Avantages de l'émulateur
- ✅ Pas besoin de modifier l'IP
- ✅ Débogage plus facile
- ✅ Hot reload fonctionne bien
- ✅ Pas besoin que le téléphone soit sur le même réseau

---

## Option 2 : Téléphone Physique (Configuration actuelle)

### Configuration

1. **Trouver votre IP locale** :
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Cherchez l'adresse IPv4 (ex: `192.168.1.23`)

2. **Modifier `citoyen/src/config/api.config.ts`** :
   ```typescript
   export const LOCAL_IP = '192.168.1.23';  // Votre IP locale
   ```

3. **S'assurer que le téléphone et le PC sont sur le même WiFi**

4. **Démarrer le backend sur toutes les interfaces** :
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

5. **Redémarrer l'app Expo**

### Dépannage téléphone physique

- ❌ **Erreur "Network request failed"** :
  - Vérifiez que le téléphone et le PC sont sur le même réseau WiFi
  - Vérifiez que le firewall Windows n'bloque pas le port 8000
  - Vérifiez que Django écoute sur `0.0.0.0:8000` (pas `127.0.0.1:8000`)

- ❌ **Connexion timeout** :
  - Vérifiez l'IP dans `api.config.ts`
  - Testez la connexion : ouvrez `http://192.168.1.23:8000/api/` dans le navigateur du téléphone

---

## Comparaison

| Critère | Émulateur | Téléphone Physique |
|---------|-----------|-------------------|
| Installation | Nécessite Android Studio | Aucune |
| Performance | Plus lent | Plus rapide |
| Débogage | Excellent | Bon |
| Hot Reload | Excellent | Bon |
| Réseau | Automatique (10.0.2.2) | Nécessite IP locale |
| Recommandé pour | Développement | Tests réels |

---

## Recommandation

Pour le développement, utilisez un **émulateur Android** :
- Plus simple à configurer
- Meilleur pour le débogage
- Pas de problèmes de réseau

Pour les tests finaux, utilisez un **téléphone physique** pour tester dans des conditions réelles.

