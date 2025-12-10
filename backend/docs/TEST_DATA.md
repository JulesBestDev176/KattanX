# 📊 Données de Test

## Génération de données de test

Le backend inclut une commande Django pour générer automatiquement des données de test réalistes.

## Utilisation

### Générer les données

```bash
python manage.py generate_test_data
```

Cette commande génère :
- **10 citoyens** avec biométrie complète
- **10 agents** répartis entre :
  - 3 agents Police (Gardien de la Paix, Brigadier, Capitaine)
  - 4 agents Gendarmerie (Gendarme, Maréchal des Logis, Adjudant, Capitaine)
  - 3 agents Pompiers (Sapeur, Sergent, Capitaine)
- **10 véhicules** avec immatriculations sénégalaises

### Supprimer et régénérer

Pour supprimer les données existantes avant de générer :

```bash
python manage.py generate_test_data --clear
```

## Données générées

### Citoyens

Chaque citoyen généré inclut :
- Informations personnelles complètes (nom, prénom, date de naissance, CNI)
- Adresse à Dakar
- Contact (téléphone, email, contact d'urgence)
- Informations parentales
- Biométrie complète :
  - Photo d'identité conforme ISO
  - Signature numérisée
  - Reconnaissance faciale (FaceNet)
  - 3 empreintes digitales (Pouce droit, Index droit, Majeur droit)
- Informations médicales (groupe sanguin, donneur d'organes)

### Agents

Les agents sont créés avec :
- Référence au citoyen (un agent est d'abord un citoyen)
- Matricule au format officiel (POL-AAAA-NNNNNN, GEN-AAAA-NNNNNN, POM-AAAA-NNNNNN)
- Grade selon le corps
- École de formation (ENP, EOGN, ENSP)
- Unité d'affectation
- Statistiques (vérifications, alertes, arrestations)

### Véhicules

Les véhicules incluent :
- Immatriculation au format sénégalais (RR-NNNN-LL)
- Marque et modèle réalistes
- Numéro de carte grise
- Propriétaire (lien vers citoyen)
- Informations techniques (puissance, carburant, nombre de places)
- Dates (immatriculation, visite technique)

## Exemples de données

### Citoyen

```python
{
    "numero_cni": "1995032512345",
    "nom": "SARR",
    "prenom": "Mamadou",
    "date_naissance": "1995-03-25",
    "genre": "M",
    "adresse": {
        "quartier": "Médina",
        "commune": "Dakar-Plateau",
        "region": "DAKAR"
    },
    "biometrie": {
        "numero_enrolement_ancec": "ANCEC-1995-DK-123456",
        "conforme_ancec": true
    }
}
```

### Agent Police

```python
{
    "matricule": "POL-2024-123456",
    "type_force": "POLICE_NATIONALE",
    "grade_police": "GARDIEN_PAIX",
    "unite_affectation": "Commissariat Central de Dakar",
    "statut": "ACTIF",
    "verifications_effectuees": 150
}
```

### Véhicule

```python
{
    "immatriculation": "DK-1234-AB",
    "marque": "TOYOTA",
    "modele": "Corolla",
    "annee_fabrication": 2020,
    "couleur": "Blanc",
    "numero_carte_grise": "CG-DK-2020-1234"
}
```

## Utilisation dans les tests

```python
from django.test import TestCase
from api.models import Citoyen, Agent, Vehicule

class TestCitoyen(TestCase):
    def setUp(self):
        # Générer les données de test
        from django.core.management import call_command
        call_command('generate_test_data')
    
    def test_citoyen_count(self):
        self.assertEqual(Citoyen.objects.count(), 10)
    
    def test_agent_count(self):
        self.assertEqual(Agent.objects.count(), 10)
    
    def test_vehicule_count(self):
        self.assertEqual(Vehicule.objects.count(), 10)
```

## Personnalisation

Pour modifier les données générées, éditez le fichier :
`backend/api/management/commands/generate_test_data.py`

Vous pouvez :
- Changer le nombre d'éléments générés
- Modifier les noms, prénoms, adresses
- Ajuster les grades et affectations
- Changer les marques et modèles de véhicules

## Notes

- Les images ne sont pas générées (sera géré avec MinIO plus tard)
- Les templates biométriques sont simulés (pas de vrais templates WSQ)
- Les données sont réalistes mais fictives
- Les CNI générés suivent le format ANCEC (AAAAMMJJNNNNN)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024

