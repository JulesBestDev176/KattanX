# 🔑 Obtenir la clé API Supabase pour le projet "kattanx"

## 📋 Étapes pour obtenir la clé API

1. **Allez sur le dashboard Supabase** :
   - https://supabase.com/dashboard

2. **Sélectionnez le projet "kattanx"** :
   - Le project-ref est : `sufmgjdutkglfsliecaz`

3. **Allez dans Settings → API** :
   - Dans le menu de gauche, cliquez sur **Settings** (⚙️)
   - Puis cliquez sur **API**

4. **Copiez la clé `anon/public`** :
   - Dans la section "Project API keys"
   - Trouvez la clé `anon` `public`
   - Cliquez sur l'icône de copie à côté

5. **Mettez à jour le fichier `src/utils/supabase.ts`** :
   ```typescript
   export const publicAnonKey = 'VOTRE_NOUVELLE_CLE_ICI';
   ```

## ⚠️ Important

- Ne partagez jamais cette clé publiquement
- Cette clé est utilisée côté client (mobile app)
- Elle est sécurisée par les Row Level Security (RLS) de Supabase

## 🔄 Après la mise à jour

1. Redémarrez l'application (rechargement complet)
2. Testez à nouveau l'inscription
3. L'erreur "Invalid API key" devrait disparaître

