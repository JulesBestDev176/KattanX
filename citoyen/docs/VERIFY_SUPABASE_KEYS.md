# Vérification des clés Supabase

## ⚠️ Important

Le project-ref a été mis à jour pour pointer vers le projet "kattanx" (`sufmgjdutkglfsliecaz`), mais vous devez vérifier que la clé API est correcte.

## 🔍 Comment vérifier

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet **"kattanx"** (sufmgjdutkglfsliecaz)
3. Allez dans **Settings** → **API**
4. Vérifiez la clé `anon/public`
5. Si elle est différente de `sbp_23221e3663fcd4802cd59206fd471df1d47b0616`, mettez à jour `src/utils/supabase.ts`

## 📝 Mise à jour

Si la clé est différente, modifiez `src/utils/supabase.ts` :

```typescript
export const projectId = 'sufmgjdutkglfsliecaz';
export const publicAnonKey = 'VOTRE_NOUVELLE_CLE_ICI';
```

## ✅ Vérification

Après la mise à jour, testez à nouveau l'inscription. L'erreur "Network request failed" devrait disparaître.

