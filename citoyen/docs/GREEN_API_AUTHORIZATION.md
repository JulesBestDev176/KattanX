# Autorisation de l'instance Green API

Votre instance Green API doit être autorisée avant de pouvoir envoyer des messages WhatsApp.

## 📱 Statut actuel

- **Instance ID**: 7107382500
- **Status**: Not Authorized ⚠️
- **Action requise**: Autoriser l'instance via QR code

## 🔐 Étapes pour autoriser l'instance

### Méthode 1 : Via le Dashboard Green API

1. Connectez-vous à votre compte [Green API](https://console.green-api.com/)
2. Allez dans la section "Instances"
3. Trouvez votre instance (7107382500)
4. Cliquez sur "QR Code" ou "Authorize"
5. Scannez le QR code avec WhatsApp sur votre téléphone :
   - Ouvrez WhatsApp
   - Allez dans **Paramètres** → **Appareils liés** → **Lier un appareil**
   - Scannez le QR code affiché
6. Attendez que le statut passe à "Authorized" ✅

### Méthode 2 : Via l'API (si disponible)

Vous pouvez également vérifier le statut via l'API :

```bash
curl -X GET "https://7107.api.green-api.com/waInstance7107382500/getStateInstance/b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996"
```

## ✅ Vérification du statut

Une fois autorisée, vous pouvez vérifier le statut :

1. Dans le dashboard Green API, le statut devrait être "Authorized"
2. Vous pouvez tester l'envoi d'un message de test

## 🧪 Test d'envoi

Une fois l'instance autorisée, vous pouvez tester l'envoi :

```bash
curl -X POST "https://7107.api.green-api.com/waInstance7107382500/sendMessage/b6e8d8fdc3c3462882c3e52f3033f29909e1404556f94ee996" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "221777151061@c.us",
    "message": "Test message"
  }'
```

## ⚠️ Notes importantes

- **Sécurité** : Ne partagez jamais votre `apiTokenInstance` publiquement
- **Expiration** : L'autorisation peut expirer si vous déconnectez WhatsApp
- **Numéro de téléphone** : Le numéro utilisé pour autoriser sera celui qui envoie les messages

## 🔄 Réautorisation

Si l'instance perd l'autorisation :
1. Retournez sur le dashboard Green API
2. Scannez à nouveau le QR code
3. Le statut devrait revenir à "Authorized"

## 📞 Support

Si vous rencontrez des problèmes :
- [Documentation Green API](https://green-api.com/docs/)
- [Support Green API](https://green-api.com/support/)

