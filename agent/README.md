# Agent Portal KattanX

Application mobile pour les agents de sécurité (Police, Gendarmerie, Douane, etc.) permettant de vérifier des individus, gérer des alertes, et collaborer en temps réel.

## 🚀 Fonctionnalités

### Authentification
- Connexion avec email/téléphone et mot de passe
- Inscription avec validation DAF et base de données des hommes de tenue (mode démo)
- Vérification OTP via WhatsApp

### Vérification d'Individus
- **Par CNI**: Saisie manuelle du numéro CNI
- **Par Matricule Auto**: Saisie ou scan de plaque d'immatriculation
- **Par Photo**: Capture photo avec reconnaissance faciale (IA simulée)
- Affichage des informations:
  - Statut: Recherché / Sous amendes / Casier judiciaire
  - Liste des amendes impayées
  - Historique judiciaire

### Actions sur Individus
- Demander autorisation d'arrestation au central
- Créer une amende payable en ligne
- Partager une alerte

### Système d'Alertes
- Créer des alertes pour personnes en fuite
- Partager avec tous les agents de la zone
- Informations suspect:
  - Photo avec analyse IA
  - Matricule auto avec reconnaissance de plaque
  - Description physique (sexe, âge, couleur peau, taille, poids)
  - Description du véhicule
- Voir les alertes actives à proximité
- Mise à jour en temps réel

### Géolocalisation
- Partage de position en temps réel quand en service
- Affichage des alertes par distance
- Calcul de distance aux suspects

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer l'application
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios
```

## 🛠️ Technologies

- **React Native** avec Expo
- **TypeScript** pour le typage
- **Supabase** pour l'authentification et la base de données
- **Expo Location** pour la géolocalisation
- **Expo Camera** pour la capture photo
- **Expo Image Picker** pour la sélection d'images

## 🎨 Design

Le design est basé sur le portail citoyen avec:
- Couleur primaire: Bleu Bic (#003D7A)
- Interface moderne et intuitive
- Navigation par cartes

## 🔐 Sécurité

- Authentification sécurisée avec Supabase
- Validation avec bases de données DAF (mode démo)
- Permissions caméra et localisation

## 📝 Mode Démo

Cette version fonctionne en mode démo avec:
- Données DAF simulées
- Analyse IA simulée (reconnaissance faciale et plaques)
- Système d'autorisation d'arrestation automatique
- Géolocalisation en temps réel activée

## 📄 License

Propriétaire - KattanX
