# 🔧 Configuration Supabase - Guide Complet

## ✅ Configuration Terminée

Votre token Supabase a été configuré dans l'application :

```
Project ID: iqfgzxqcuovvdxzwvwzj
Token: sbp_23221e3663fcd4802cd59206fd471df1d47b0616
```

---

## 📊 Étapes de Configuration Supabase

### 1️⃣ Créer les Tables

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet `iqfgzxqcuovvdxzwvwzj`
3. Aller dans **SQL Editor**
4. Copier tout le contenu de `scripts/supabase-setup.sql`
5. Coller dans l'éditeur SQL
6. Cliquer sur **Run**

Cela va créer :
- ✅ 6 tables (dossiers, proprietes, denonciations, plaintes, transactions, revenus)
- ✅ Politiques de sécurité (RLS)
- ✅ Fonctions et triggers automatiques

---

### 2️⃣ Créer les Utilisateurs de Test

1. Aller dans **Authentication** > **Users**
2. Cliquer sur **Add User** > **Create new user**

**Utilisateur 1 :**
```
Email: user1@test.com
Password: password123
```

Après création, cliquer sur l'utilisateur et ajouter les métadonnées :
```json
{
  "name": "Amadou Diallo",
  "cni": "1234567890123",
  "tel": "+221 77 123 45 67"
}
```

**Utilisateur 2 :**
```
Email: user2@test.com
Password: password123
```

Métadonnées :
```json
{
  "name": "Fatou Sall",
  "cni": "9876543210987",
  "tel": "+221 76 987 65 43"
}
```

---

### 3️⃣ Insérer les Données de Test

1. Copier les UUID des utilisateurs créés
2. Dans **SQL Editor**, remplacer `USER_1_UUID` et `USER_2_UUID` dans le script
3. Exécuter la section "INSERTION DES DONNÉES DE TEST"

---

### 4️⃣ Créer les Edge Functions

Vous devez créer ces fonctions Edge pour que l'API fonctionne :

#### A. Fonction de Login

Créer `supabase/functions/make-server-7f5fa16e/login.ts` :

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, password } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ user: data.user, session: data.session }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

#### B. Fonction pour les Dossiers

Créer `supabase/functions/make-server-7f5fa16e/dossiers.ts` :

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabase.auth.getUser(token)
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase
    .from('dossiers')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

**Créez des fonctions similaires pour :**
- proprietes
- denonciations
- plaintes
- revenus
- profile
- request-otp
- verify-otp
- transfer

---

## 📱 Données de Test Disponibles

### 👥 Utilisateurs

**User 1 - Amadou Diallo**
- Email: `user1@test.com`
- Password: `password123`
- CNI: `1234567890123`
- Tel: `+221 77 123 45 67`

**User 2 - Fatou Sall**
- Email: `user2@test.com`
- Password: `password123`
- CNI: `9876543210987`
- Tel: `+221 76 987 65 43`

### 📄 Dossiers (User 1)
1. Titre Foncier - TF-2024-001
2. Carte Grise - CG-2024-002
3. Permis de Construire - PC-2024-003

### 🏠 Propriétés (User 1)
1. Maison à Almadies (150m²)
2. Toyota Corolla 2020
3. Terrain à Thiès (500m²)

### ⚠️ Dénonciations (User 1)
1. Accident de la route - En attente
2. Incendie - Vérifiée
3. Vol à la tire - En attente

### ⚖️ Plaintes (User 1)
1. Vol de téléphone - Déposée
2. Stationnement interdit - Reçue (Amende: 50,000 FCFA)
3. Agression - Déposée

### 💰 Revenus (User 1)
- **Solde total:** 125,000 FCFA
- **Transactions:** 5 transactions (3 gains, 2 retraits)

---

## 🚀 Tester l'Application

Une fois Supabase configuré :

```powershell
cd "C:\Users\jules\Downloads\Citizen Portal App\mobile"
npm start
```

Se connecter avec :
```
Email: user1@test.com
Password: password123
```

Vous devriez voir :
- ✅ 3 documents dans "Dossier"
- ✅ 3 propriétés dans "Propriétés"
- ✅ 3 alertes dans "Dénonciations"
- ✅ 3 plaintes dans "Plaintes"
- ✅ 125,000 FCFA dans "Revenus"

---

## 🔍 Vérification

Pour vérifier que tout fonctionne, dans le SQL Editor :

```sql
-- Voir tous les dossiers
SELECT * FROM dossiers;

-- Voir toutes les propriétés
SELECT * FROM proprietes;

-- Voir toutes les dénonciations
SELECT * FROM denonciations;

-- Voir toutes les plaintes
SELECT * FROM plaintes;

-- Voir tous les revenus
SELECT * FROM revenus;

-- Voir toutes les transactions
SELECT * FROM transactions;

-- Compter les données par table
SELECT 
  (SELECT COUNT(*) FROM dossiers) as dossiers,
  (SELECT COUNT(*) FROM proprietes) as proprietes,
  (SELECT COUNT(*) FROM denonciations) as denonciations,
  (SELECT COUNT(*) FROM plaintes) as plaintes,
  (SELECT COUNT(*) FROM transactions) as transactions;
```

---

## 📚 Ressources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Problèmes Courants

### Erreur "relation does not exist"
➡️ Les tables n'ont pas été créées. Exécutez le script SQL complet.

### Erreur "permission denied"
➡️ Les politiques RLS bloquent l'accès. Vérifiez que l'utilisateur est authentifié.

### Pas de données affichées
➡️ Vérifiez que les UUID des utilisateurs sont corrects dans les données de test.

### Erreur "function not found"
➡️ Les Edge Functions n'ont pas été déployées. Créez-les dans Supabase.

---

**Configuration terminée ! Votre application est prête à fonctionner avec des données de test ! 🎉**



