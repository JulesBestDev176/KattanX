# 📱 Vue d'ensemble des Écrans

## 🎨 Architecture de Navigation

```
┌─────────────────────────────────────────┐
│         AuthScreen (Connexion)          │
│  - Formulaire de connexion              │
│  - Formulaire d'inscription             │
│  - Vérification OTP                     │
└─────────────┬───────────────────────────┘
              │ Login Success
              ▼
┌─────────────────────────────────────────┐
│         HomeScreen (Accueil)            │
│  ┌─────────┬─────────┐                 │
│  │ Profil  │ Dossier │                 │
│  ├─────────┼─────────┤                 │
│  │Propriétés│Dénonc. │                 │
│  ├─────────┼─────────┤                 │
│  │ Plaintes│ Revenus │                 │
│  └─────────┴─────────┘                 │
└──┬──┬──┬──┬──┬──────────────────────────┘
   │  │  │  │  │
   │  │  │  │  └─────► RevenusScreen
   │  │  │  └────────► PlaintesScreen
   │  │  └───────────► DenonciationsScreen
   │  └──────────────► ProprietesScreen
   └─────────────────► DossierScreen
   │
   └─────────────────► ProfileScreen
```

## 📄 Détail des Écrans

### 1. AuthScreen (Écran d'Authentification)

**Fichier:** `src/screens/AuthScreen.tsx`

**États:**
- Mode connexion
- Mode inscription (étape 1)
- Mode vérification OTP (étape 2)

**Composants:**
```
┌──────────────────────────────────┐
│         KattanX Header           │
│      (Fond bleu primaire)        │
└──────────────────────────────────┘
│                                  │
│  [Mode Connexion]                │
│  ┌────────────────────────────┐  │
│  │ Email                      │  │
│  ├────────────────────────────┤  │
│  │ Mot de passe               │  │
│  ├────────────────────────────┤  │
│  │   [Se connecter]           │  │
│  └────────────────────────────┘  │
│                                  │
│  Comptes test:                   │
│  user1@test.com / password123    │
│                                  │
│  [Pas de compte ? S'inscrire]    │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Connexion avec email/password
- ✅ Inscription avec OTP
- ✅ Validation des champs
- ✅ Messages d'erreur
- ✅ Comptes de test affichés

---

### 2. HomeScreen (Écran d'Accueil)

**Fichier:** `src/screens/HomeScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  KattanX    Bienvenue, [Nom]  🚪 │
│         (Header bleu)            │
└──────────────────────────────────┘
│                                  │
│  ┌──────────┐  ┌──────────┐     │
│  │    👤    │  │    📄    │     │
│  │  Profil  │  │ Dossier  │     │
│  └──────────┘  └──────────┘     │
│                                  │
│  ┌──────────┐  ┌──────────┐     │
│  │    🏠    │  │    ⚠️    │     │
│  │Propriétés│  │Dénonc.   │     │
│  └──────────┘  └──────────┘     │
│                                  │
│  ┌──────────┐  ┌──────────┐     │
│  │    ⚖️    │  │    💰    │     │
│  │ Plaintes │  │ Revenus  │     │
│  └──────────┘  └──────────┘     │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Grille 2x3 de navigation
- ✅ Icônes colorées
- ✅ Bouton déconnexion
- ✅ Message personnalisé

---

### 3. ProfileScreen (Écran Profil)

**Fichier:** `src/screens/ProfileScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Profil                    ✏️  │
│         (Header bleu)            │
└──────────────────────────────────┘
│                                  │
│  Nom complet                     │
│  ┌────────────────────────────┐  │
│  │ [Valeur éditable]          │  │
│  └────────────────────────────┘  │
│                                  │
│  Email                           │
│  ┌────────────────────────────┐  │
│  │ [Non éditable]             │  │
│  └────────────────────────────┘  │
│                                  │
│  CNI                             │
│  ┌────────────────────────────┐  │
│  │ [Valeur éditable]          │  │
│  └────────────────────────────┘  │
│                                  │
│  Téléphone                       │
│  ┌────────────────────────────┐  │
│  │ [Valeur éditable]          │  │
│  └────────────────────────────┘  │
│                                  │
│  [Mode édition]                  │
│  ┌────────────────────────────┐  │
│  │    [Enregistrer]           │  │
│  ├────────────────────────────┤  │
│  │    [Annuler]               │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Mode lecture/édition
- ✅ Sauvegarde des modifications
- ✅ Annulation
- ✅ Email non modifiable

---

### 4. DossierScreen (Documents)

**Fichier:** `src/screens/DossierScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Mes Dossiers                  │
└──────────────────────────────────┘
│                                  │
│  ┌────────────────────────────┐  │
│  │ 📄  Titre Foncier          │  │
│  │     N° TF-2024-001         │  │
│  │     Émis le 15/01/2024     │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 📄  Carte Grise            │  │
│  │     N° CG-2024-002         │  │
│  │     Émis le 20/02/2024     │  │
│  └────────────────────────────┘  │
│                                  │
│  [État vide si aucun document]   │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Liste des documents
- ✅ Détails (numéro, date)
- ✅ État vide informatif
- ✅ Icône par document

---

### 5. ProprietesScreen (Propriétés)

**Fichier:** `src/screens/ProprietesScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Mes Propriétés                │
└──────────────────────────────────┘
│                                  │
│  ┌────────────────────────────┐  │
│  │ 🏠  Maison Dakar           │  │
│  │     Réf: TF-001            │  │
│  │     150m² - Almadies       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 🚗  Toyota Corolla         │  │
│  │     Réf: VH-002            │  │
│  │     2020 - Gris            │  │
│  └────────────────────────────┘  │
│                                  │
│  [État vide si aucune propriété] │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Liste des biens
- ✅ Icônes différenciées (maison, voiture)
- ✅ Références et détails
- ✅ État vide

---

### 6. DenonciationsScreen (Alertes)

**Fichier:** `src/screens/DenonciationsScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Dénonciations              +  │
└──────────────────────────────────┘
│                                  │
│  ┌────────────────────────────┐  │
│  │ Accident de la route    ⏰  │  │
│  │ ALERT-2024-001             │  │
│  │ Description...             │  │
│  │ 📍 Avenue Bourguiba        │  │
│  │ 15/03/2024    [En attente] │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Incendie                ✅  │  │
│  │ ALERT-2024-002             │  │
│  │ Description...             │  │
│  │ 📍 Médina                  │  │
│  │ 10/03/2024    [Vérifiée]   │  │
│  └────────────────────────────┘  │
│                                  │
│  [+ Lancer une alerte]           │
└──────────────────────────────────┘

[Modal Nouvelle Alerte]
┌──────────────────────────────────┐
│  Nouvelle Alerte             ✕   │
├──────────────────────────────────┤
│  Type d'incident                 │
│  ┌────────────────────────────┐  │
│  │ Ex: Accident, Incendie...  │  │
│  └────────────────────────────┘  │
│                                  │
│  Description                     │
│  ┌────────────────────────────┐  │
│  │ Décrivez l'incident...     │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Localisation            📍      │
│  ┌────────────────────────────┐  │
│  │ Adresse...                 │  │
│  └────────────────────────────┘  │
│                                  │
│  Type de preuve                  │
│  [📷 Image] [🎤 Audio] [🎥 Vidéo]│
│                                  │
│  [Envoyer l'alerte]              │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Liste des alertes
- ✅ Formulaire de création
- ✅ Types de preuve
- ✅ Statuts colorés
- ✅ Géolocalisation

---

### 7. PlaintesScreen (Plaintes)

**Fichier:** `src/screens/PlaintesScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Plaintes                   +  │
└──────────────────────────────────┘
│                                  │
│  ┌────────────────────────────┐  │
│  │ ⚠️ Vol de téléphone [Reçue]│  │
│  │ PLAINT-2024-001            │  │
│  │ Description...             │  │
│  │ Commissariat: Plateau      │  │
│  │ 💰 Amende: 50,000 FCFA     │  │
│  │ 12/03/2024    En cours     │  │
│  └────────────────────────────┘  │
│  (Fond rouge clair)              │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Agression          [Déposée]│  │
│  │ PLAINT-2024-002            │  │
│  │ Description...             │  │
│  │ Commissariat: Médina       │  │
│  │ 08/03/2024    En cours     │  │
│  └────────────────────────────┘  │
│                                  │
│  [+ Déposer une plainte]         │
└──────────────────────────────────┘

[Modal Déposer une plainte]
┌──────────────────────────────────┐
│  Déposer une plainte         ✕   │
├──────────────────────────────────┤
│  Objet de la plainte             │
│  ┌────────────────────────────┐  │
│  │ Ex: Vol, Agression...      │  │
│  └────────────────────────────┘  │
│                                  │
│  Description                     │
│  ┌────────────────────────────┐  │
│  │ Décrivez les faits...      │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Commissariat (optionnel)        │
│  ┌────────────────────────────┐  │
│  │ Choisir un commissariat    │  │
│  └────────────────────────────┘  │
│  Si vide, le plus proche sera    │
│  automatiquement choisi          │
│                                  │
│  [Déposer la plainte]            │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Plaintes reçues/déposées
- ✅ Distinction visuelle
- ✅ Amendes affichées
- ✅ Formulaire de dépôt
- ✅ Sélection commissariat

---

### 8. RevenusScreen (Revenus)

**Fichier:** `src/screens/RevenusScreen.tsx`

**Layout:**
```
┌──────────────────────────────────┐
│  ← Revenus                       │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Solde disponible           │  │
│  │ 125,000 FCFA               │  │
│  │                            │  │
│  │    [Transférer]            │  │
│  └────────────────────────────┘  │
│  (Fond bleu semi-transparent)    │
└──────────────────────────────────┘
│                                  │
│  Historique des transactions     │
│                                  │
│  ┌────────────────────────────┐  │
│  │ ⬇️  Gain - Alerte vérifiée │  │
│  │     15/03/2024             │  │
│  │              +25,000 FCFA  │  │
│  │              Complété      │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ ⬆️  Retrait - Mobile Money │  │
│  │     10/03/2024             │  │
│  │              -50,000 FCFA  │  │
│  │              Complété      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘

[Modal Transférer les fonds]
┌──────────────────────────────────┐
│  Transférer les fonds        ✕   │
├──────────────────────────────────┤
│  Montant                         │
│  ┌────────────────────────────┐  │
│  │ 0                          │  │
│  └────────────────────────────┘  │
│  Disponible: 125,000 FCFA        │
│                                  │
│  Méthode de transfert            │
│  [📱 Mobile Money] [🏦 Banque]   │
│                                  │
│  Numéro de téléphone             │
│  ┌────────────────────────────┐  │
│  │ +221 XX XXX XX XX          │  │
│  └────────────────────────────┘  │
│                                  │
│  [Confirmer le transfert]        │
└──────────────────────────────────┘
```

**Fonctionnalités:**
- ✅ Affichage du solde
- ✅ Historique transactions
- ✅ Formulaire transfert
- ✅ Choix méthode
- ✅ Validation solde

---

## 🎨 Système de Design

### Couleurs Principales

```
Primary (Bleu):     #3b82f6  ████████
Secondary (Vert):   #10b981  ████████
Destructive (Rouge):#ef4444  ████████
Background:         #ffffff  ████████
Foreground:         #0f172a  ████████
Muted:              #f1f5f9  ████████
Border:             #e2e8f0  ████████
```

### Typographie

- **Titres**: 24-32px, Bold
- **Sous-titres**: 18-20px, Semi-bold
- **Corps**: 14-16px, Regular
- **Petits textes**: 12px, Regular

### Espacements

- **Padding écrans**: 24px
- **Marges cartes**: 16px
- **Espacements internes**: 8-12px

### Composants Réutilisables

1. **Button** - 3 variantes (default, outline, ghost)
2. **Input** - Avec label et erreur
3. **Toast** - 3 types (success, error, info)
4. **Card** - Conteneur avec bordure
5. **Modal** - Overlay avec contenu

---

## 📊 Flux de Données

```
User Action → Screen Component → API Call → Backend
                    ↓
              Update State
                    ↓
              Re-render UI
                    ↓
              Toast Feedback
                    ↓
              Update Storage
```

---

## ✅ Checklist de Fonctionnalités

### AuthScreen
- [x] Connexion
- [x] Inscription
- [x] Vérification OTP
- [x] Validation formulaires
- [x] Messages d'erreur

### HomeScreen
- [x] Grille de navigation
- [x] Déconnexion
- [x] Message personnalisé

### ProfileScreen
- [x] Affichage profil
- [x] Édition profil
- [x] Sauvegarde
- [x] Annulation

### DossierScreen
- [x] Liste documents
- [x] État vide
- [x] Détails documents

### ProprietesScreen
- [x] Liste propriétés
- [x] Icônes différenciées
- [x] État vide

### DenonciationsScreen
- [x] Liste alertes
- [x] Création alerte
- [x] Statuts
- [x] Modal formulaire

### PlaintesScreen
- [x] Liste plaintes
- [x] Distinction reçues/déposées
- [x] Création plainte
- [x] Amendes

### RevenusScreen
- [x] Affichage solde
- [x] Historique
- [x] Transfert
- [x] Validation

---

## 🎯 Conclusion

Tous les écrans sont implémentés avec une interface cohérente, moderne et intuitive. Chaque écran respecte les mêmes principes de design et offre une expérience utilisateur fluide.



