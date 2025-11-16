# Configuration WhatsApp pour l'envoi d'OTP

Ce guide explique comment configurer l'envoi de codes OTP via WhatsApp.

## 📱 Options disponibles

### Option 1: Green API (Recommandé pour débuter) ✅ Configuré

**Configuration actuelle :**
- **API URL**: `https://7107.api.green-api.com`
- **Instance ID**: `7107382500`
- **API Token**: `b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996`
- **Status**: ⚠️ **Not Authorized** (nécessite autorisation via QR code)

**⚠️ Action requise** : L'instance doit être autorisée avant de pouvoir envoyer des messages. Voir [GREEN_API_AUTHORIZATION.md](./GREEN_API_AUTHORIZATION.md) pour les instructions.

**Configuration des variables d'environnement dans Supabase :**

```bash
WHATSAPP_API_URL=https://7107.api.green-api.com
WHATSAPP_INSTANCE_ID=7107382500
WHATSAPP_API_KEY=b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996
```

### Option 2: Twilio WhatsApp

1. Créer un compte sur [Twilio](https://www.twilio.com)
2. Activer WhatsApp dans votre compte Twilio
3. Obtenir votre `Account SID` et `Auth Token`
4. Configurer les variables d'environnement :

```bash
TWILIO_ACCOUNT_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## 🚀 Déploiement de la Edge Function

### Installation de Supabase CLI sur Windows

**⚠️ Important** : L'installation globale via `npm install -g supabase` n'est **pas supportée**. Utilisez une des méthodes suivantes :

#### Option 1 : Scoop (Recommandé pour Windows)

1. Installer Scoop si ce n'est pas déjà fait :
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

2. Installer Supabase CLI :
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Option 2 : winget (Windows Package Manager)

```powershell
winget install Supabase.CLI
```

#### Option 3 : Téléchargement direct

1. Télécharger le binaire depuis [GitHub Releases](https://github.com/supabase/cli/releases)
2. Extraire et ajouter au PATH

#### Option 4 : Utiliser npx (sans installation globale)

Vous pouvez utiliser Supabase CLI via `npx` sans installation globale :
```bash
npx supabase@latest login
npx supabase@latest link --project-ref votre-project-id
npx supabase@latest functions deploy send-whatsapp
```

### Configuration et déploiement

1. Se connecter à Supabase :
```bash
supabase login
```

2. Lier votre projet :
```bash
# Si installé via Scoop/winget :
supabase link --project-ref iqfgzxqcuovvdxzwvwzj

# Si utilisé via npx :
npx supabase@latest link --project-ref iqfgzxqcuovvdxzwvwzj
```

3. Déployer la fonction :
```bash
# Si installé via Scoop/winget :
supabase functions deploy send-whatsapp

# Si utilisé via npx :
npx supabase@latest functions deploy send-whatsapp
```

4. Configurer les secrets avec vos identifiants Green API :
```bash
# Si installé via Scoop/winget :
supabase secrets set WHATSAPP_API_URL=https://7107.api.green-api.com
supabase secrets set WHATSAPP_INSTANCE_ID=7107382500
supabase secrets set WHATSAPP_API_KEY=b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996

# Si utilisé via npx :
npx supabase@latest secrets set WHATSAPP_API_URL=https://7107.api.green-api.com
npx supabase@latest secrets set WHATSAPP_INSTANCE_ID=7107382500
npx supabase@latest secrets set WHATSAPP_API_KEY=b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996
```

**⚠️ Important** : Avant de déployer, assurez-vous que votre instance Green API est **autorisée**. Voir [GREEN_API_AUTHORIZATION.md](./GREEN_API_AUTHORIZATION.md).

**Note** : Remplacez `iqfgzxqcuovvdxzwvwzj` par votre Project ID Supabase si différent.

## 📝 Note

Si aucune API WhatsApp n'est configurée, l'application fonctionnera en mode démo et affichera l'OTP dans l'interface.

## 🔧 Configuration actuelle

L'OTP est envoyé au numéro de téléphone que l'utilisateur a fourni lors de l'inscription.

**Note importante** : Le numéro de test mentionné (+221777151061) n'est pas utilisé automatiquement. L'application envoie l'OTP au numéro que l'utilisateur entre dans le formulaire d'inscription.

## 📋 Test rapide

1. Inscrivez-vous avec un numéro de téléphone (ex: +221777151061)
2. L'OTP sera généré et affiché dans l'interface
3. Si l'Edge Function est configurée, l'OTP sera envoyé via WhatsApp
4. Sinon, l'application fonctionnera en mode démo

## ⚠️ Mode démo

Si aucune API WhatsApp n'est configurée, l'application fonctionnera en mode démo :
- L'OTP est généré et affiché dans l'interface
- L'utilisateur peut entrer le code pour continuer
- Aucun message WhatsApp réel n'est envoyé

Pour activer l'envoi réel de messages WhatsApp, suivez les étapes de configuration ci-dessus.


