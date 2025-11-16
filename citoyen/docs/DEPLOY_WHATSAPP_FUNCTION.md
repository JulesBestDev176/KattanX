# 🚀 Déploiement de la fonction WhatsApp

## 📋 Étapes rapides

### 1. Sélectionner le projet Supabase

Dans le terminal, quand Supabase CLI vous demande de sélectionner un projet :

```
Select a project:
> 5. sufmgjdutkglfsliecaz [name: kattanx, ...]
```

**Appuyez sur `5` puis `Entrée`** pour sélectionner "kattanx".

### 2. Déployer la fonction

Une fois le projet sélectionné, la fonction sera déployée automatiquement.

Si vous devez redéployer manuellement :

```bash
# Depuis le dossier citoyen
cd citoyen
npx supabase@latest functions deploy send-whatsapp
```

**✅ Déploiement réussi** : La fonction a été déployée sur le projet `sufmgjdutkglfsliecaz` (kattanx).

### 3. Configurer les secrets Green API

Après le déploiement, configurez les secrets :

```bash
npx supabase@latest secrets set WHATSAPP_API_URL=https://7107.api.green-api.com
npx supabase@latest secrets set WHATSAPP_INSTANCE_ID=7107382500
npx supabase@latest secrets set WHATSAPP_API_KEY=b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996
```

**✅ Secrets configurés** : Tous les secrets ont été configurés avec succès sur le projet "kattanx".

### 4. Vérifier le déploiement

Vous pouvez vérifier que la fonction est déployée dans le dashboard Supabase :
- Allez sur https://supabase.com/dashboard
- Sélectionnez votre projet "kattanx"
- Allez dans **Edge Functions**
- Vous devriez voir `send-whatsapp` dans la liste

## ⚠️ Important

Avant de tester, assurez-vous que :
1. ✅ L'instance Green API est **autorisée** (voir [GREEN_API_AUTHORIZATION.md](./GREEN_API_AUTHORIZATION.md))
2. ✅ Les secrets sont configurés
3. ✅ La fonction est déployée

## 🧪 Test

Une fois tout configuré, testez l'inscription dans l'application mobile. L'OTP devrait être envoyé via WhatsApp automatiquement.

### 📱 Comment tester

1. **Autoriser Green API** (si pas encore fait) :
   - Allez sur https://console.green-api.com/
   - Instance `7107382500` → Cliquez sur "QR Code"
   - Scannez avec WhatsApp
   - Attendez que le statut passe à "Authorized"

2. **Tester l'inscription** :
   - Ouvrez l'application mobile
   - Allez sur l'écran d'inscription
   - Remplissez le formulaire avec un numéro de téléphone valide
   - Cliquez sur "Recevoir le code OTP"
   - Le code devrait être envoyé via WhatsApp au numéro fourni

3. **Vérifier les logs** :
   - Dans le dashboard Supabase → Edge Functions → `send-whatsapp` → Logs
   - Vous pouvez voir les appels et les erreurs éventuelles

## 🔍 Dépannage

### La fonction ne s'exécute pas

- Vérifiez que la fonction est bien déployée dans le dashboard
- Vérifiez les logs dans Supabase Dashboard → Edge Functions → Logs

### Erreur "Instance non autorisée"

- L'instance Green API doit être autorisée via QR code
- Voir [GREEN_API_AUTHORIZATION.md](./GREEN_API_AUTHORIZATION.md)

### L'OTP n'est pas envoyé

- Vérifiez que les secrets sont bien configurés : `npx supabase@latest secrets list`
- Vérifiez que l'instance Green API est "Authorized"
- Vérifiez les logs de la fonction dans le dashboard Supabase

## 📊 Statut actuel

- ✅ Fonction déployée : `send-whatsapp`
- ✅ Projet : `sufmgjdutkglfsliecaz` (kattanx)
- ✅ Secrets configurés : WHATSAPP_API_URL, WHATSAPP_INSTANCE_ID, WHATSAPP_API_KEY
- ⚠️ Instance Green API : À autoriser (voir [GREEN_API_AUTHORIZATION.md](./GREEN_API_AUTHORIZATION.md))

