# 🇸🇳 Intégration avec les Organismes Officiels du Sénégal

## Vue d'ensemble

Ce document explique comment les modèles Django s'intègrent avec les organismes officiels sénégalais qui gèrent les données citoyennes et les forces de l'ordre.

## 🏛️ Organismes Officiels

### 1. ANCEC - Agence Nationale de la Carte d'Identité et de l'État Civil

**Rôle** : Gestion des CNI biométriques et de l'état civil

**Services** :

- Délivrance de CNI biométriques
- Enregistrement de l'état civil
- Base de données centralisée des citoyens
- Authentification biométrique

**Contact** :

- 📞 +221 33 889 40 00
- 📧 contact@ancec.sn
- 🌐 https://ancec.sn

**Format CNI** : 13 chiffres (AAAAMMJJNNNNN)

- AAAA : Année de naissance
- MM : Mois de naissance
- JJ : Jour de naissance
- NNNNN : Numéro séquentiel

**Standards biométriques** :

- Empreintes digitales : ISO/IEC 19794-2 (format WSQ ou ANSI/NIST)
- Photo : ISO/IEC 19794-5 (300x400 pixels minimum)
- Reconnaissance faciale : Encodage FaceNet ou équivalent
- Résolution empreintes : 500 DPI minimum

### 2. DGPN - Direction Générale de la Police Nationale

**Rôle** : Administration de la Police Nationale

**Commandement** : Directeur Général de la Police Nationale

**Écoles de formation** :

- **ENP** (École Nationale de Police) : Formation sous-officiers (12 mois)
- **ENOP** (École Nationale des Officiers de Police) : Formation officiers (24 mois)

**Numéro d'urgence** : 17

**Format matricule** : POL-AAAA-NNNNNN

- POL : Code Police
- AAAA : Année d'entrée en service
- NNNNNN : Numéro séquentiel

### 3. HCGN - Haut Commandement de la Gendarmerie Nationale

**Rôle** : Administration de la Gendarmerie Nationale

**Commandement** : Haut-Commandant de la Gendarmerie

**Écoles de formation** :

- **École de Gendarmerie de Ouakam** : Formation gendarmes (12-18 mois)
- **EOGN** (École des Officiers de la Gendarmerie) : Formation officiers (24 mois)

**Numéro d'urgence** : 17

**Format matricule** : GEN-AAAA-NNNNNN

### 4. DNPC - Direction Nationale de la Protection Civile

**Rôle** : Gestion des Sapeurs-Pompiers

**Commandement** : Directeur National de la Protection Civile

**École** : ENSP (École Nationale des Sapeurs-Pompiers)

**Numéro d'urgence** : 18

**Format matricule** : POM-AAAA-NNNNNN

### 5. DTT - Direction des Transports Terrestres

**Rôle** : Gestion des permis de conduire et immatriculations

**Services** :

- Délivrance de permis de conduire
- Immatriculation des véhicules
- Contrôle technique (visite technique)
- Gestion des infractions routières

**Format permis** : PC-AAAA-NNNNNN

**Format immatriculation** : RR-NNNN-LL

- RR : Code région (DK, TH, SL, etc.)
- NNNN : Numéro
- LL : Lettres

### 6. Autres Organismes

- **DGID** : Direction Générale des Impôts et des Domaines (identification fiscale)
- **ANSD** : Agence Nationale de la Statistique et de la Démographie (recensement)
- **MSAS** : Ministère de la Santé (données sanitaires, SAMU: 15)

## 🔐 Gestion Biométrique

### Standards et Formats

#### Empreintes Digitales

**Modèle Django** : `EmpreinteDigitale`

```python
from api.models import EmpreinteDigitale
from api.models.enums import Doigt

empreinte = EmpreinteDigitale(
    doigt=Doigt.POUCE_DROIT,
    template="...",  # Template encodé (WSQ ou ANSI/NIST)
    format='ISO_19794_2',
    qualite=90,  # Score 0-100 (minimum 80 recommandé)
    resolution=500,  # DPI (standard)
    dispositif_capture="Morpho MSO 1300"
)
```

**Dispositifs recommandés** :

- Morpho MSO 1300 (scanner 10 doigts)
- Suprema RealScan (capteur optique)
- Digital Persona U.are.U (capteur USB)

**Qualité minimale** : 80/100 pour acceptation

#### Photo d'Identité

**Modèle Django** : `PhotoIdentite`

```python
from api.models import PhotoIdentite

photo = PhotoIdentite(
    format='JPEG',
    resolution='300x400',  # Minimum requis
    taille_octets=50000,  # Max 100 KB recommandé
    conforme_iso=True,  # ISO/IEC 19794-5
    background_couleur='blanc',
    qualite_score=90
)
```

**Exigences photo** :

- Fond uni (blanc ou bleu clair)
- Visage centré, face caméra
- Éclairage uniforme
- Pas de lunettes à verres teintés
- Pas de couvre-chef (sauf religieux)
- Expression neutre

#### Reconnaissance Faciale

**Modèle Django** : `ReconnaissanceFaciale`

```python
from api.models import ReconnaissanceFaciale
from api.models.enums import AlgorithmeReconnaissance

reconnaissance = ReconnaissanceFaciale(
    encodage_facial="...",  # Vecteur 128-D ou 512-D
    algorithme=AlgorithmeReconnaissance.FACENET,
    version='1.0',
    qualite_image=90,
    confiance=0.95
)
```

**Algorithmes supportés** :

- **FaceNet** : Google (128-D ou 512-D embeddings)
- **ArcFace** : InsightFace (512-D embeddings)
- **DeepFace** : Facebook (4096-D embeddings)

**Seuil de correspondance** : 0.6 (similitude cosinus)

#### Signature

**Modèle Django** : `Signature`

```python
from api.models import Signature
from api.models.enums import TypeCaptureSignature

signature = Signature(
    format='PNG',
    type_capture=TypeCaptureSignature.TABLETTE,
    taille_octets=15000,
    date_capture=datetime.now()
)
```

### Processus d'Enrôlement ANCEC

1. **Prise de rendez-vous** : En ligne ou centre d'enrôlement
2. **Documents requis** : 
   - Extrait de naissance
   - Certificat de nationalité (si nécessaire)
   - Justificatif de domicile
3. **Capture biométrique** :
   - Photo d'identité (conforme ISO)
   - 10 empreintes digitales (qualité > 80)
   - Signature
4. **Vérification** : Agent ANCEC valide les données
5. **Génération CNI** : Carte biométrique produite
6. **Retrait** : 2-3 semaines après enrôlement

### Vérification Biométrique

#### Vérification par empreinte (1:1)

**Endpoint API** : `POST /api/biometrie/verifier-empreinte/`

```python
from api.services.biometrie import ServiceBiometrie
from api.models import EmpreinteDigitale
from api.models.enums import Doigt

# Créer une empreinte capturée
empreinte_capturee = EmpreinteDigitale(
    doigt=Doigt.POUCE_DROIT,
    template="...",
    qualite=90,
    resolution=500
)

# Vérifier
resultat = ServiceBiometrie.verifier_empreinte_1_1(
    citoyen_id='citoyen-uuid',
    empreinte_capturee=empreinte_capturee,
    doigt=Doigt.POUCE_DROIT
)

# Résultat
# {
#     'match': True,
#     'confiance': 92.5,
#     'score': 0.925,
#     'seuil': 0.85
# }
```

#### Identification par empreinte (1:N)

**Endpoint API** : `POST /api/biometrie/identifier-personne/`

```python
resultats = ServiceBiometrie.identifier_personne_1_n(
    empreinte_capturee=empreinte_capturee,
    doigt=Doigt.POUCE_DROIT
)

# Retourne une liste de résultats triés par score
# [
#     {
#         'citoyen_id': 'uuid',
#         'numero_cni': '1995032512345',
#         'nom': 'SARR',
#         'prenom': 'Mamadou',
#         'score': 0.95,
#         'confiance': 95.0
#     },
#     ...
# ]
```

## 👮 Relation Citoyen ↔ Force de l'Ordre

### Principe Fondamental

**Un agent des forces de l'ordre EST D'ABORD un citoyen.**

Le modèle `Agent` est une **extension** du modèle `Citoyen`, pas une entité séparée.

### Processus de Recrutement

```python
from api.models import Citoyen, Agent
from api.models.enums import TypeForceOrdre, GradePolice

# ÉTAPE 1: Le citoyen existe déjà dans le système
citoyen = Citoyen.objects.get(numero_cni='1995032512345')

# ÉTAPE 2: Concours de recrutement (externe)
# - Épreuves écrites
# - Tests physiques
# - Examen médical
# - Enquête de moralité

# ÉTAPE 3: Si admis, création du profil Agent
agent = Agent.objects.create(
    citoyen=citoyen,  # ⚠️ LIEN OBLIGATOIRE
    matricule='POL-2024-001234',
    type_force=TypeForceOrdre.POLICE_NATIONALE,
    grade_police=GradePolice.GARDIEN_PAIX,
    date_entree_service=date(2024, 1, 20),
    statut='ACTIF'
)

# ÉTAPE 4: Formation à l'école (ENP, EOGN, etc.)
# Durée: 12-24 mois selon le niveau

# ÉTAPE 5: Affectation et entrée en service
```

### Synchronisation des Données

```python
# Les modifications du citoyen affectent l'agent
def mettre_a_jour_citoyen(citoyen_id, nouvelle_adresse):
    # 1. Mettre à jour le profil citoyen
    citoyen = Citoyen.objects.get(id=citoyen_id)
    citoyen.adresse_actuelle = nouvelle_adresse
    citoyen.save()
    
    # 2. Si c'est un agent, notifier le service
    try:
        agent = Agent.objects.get(citoyen=citoyen)
        # Notifier le changement d'adresse
        notifier_changement_adresse(agent)
    except Agent.DoesNotExist:
        pass
```

### Accès aux Données

```python
# Récupérer un profil complet d'agent
def get_profil_complet_agent(agent_id):
    agent = Agent.objects.get(id=agent_id)
    citoyen = agent.citoyen  # Accès direct via ForeignKey
    
    return {
        'agent': agent,
        'citoyen': citoyen,
        'biometrie': citoyen.biometrie if citoyen.biometrie else None
    }
```

## 📊 Hiérarchie des Grades

### Police Nationale

```
HAUT OFFICIER (Niveau 11-13)
├─ Directeur Général (13)
├─ Inspecteur Général (12)
└─ Contrôleur Général (11)

OFFICIER SUPÉRIEUR (Niveau 8-10)
├─ Colonel (10)
├─ Lieutenant-Colonel (9)
└─ Commandant (8)

OFFICIER SUBALTERNE (Niveau 5-7)
├─ Capitaine (7)
├─ Lieutenant (6)
└─ Sous-Lieutenant (5)

SOUS-OFFICIER (Niveau 1-4)
├─ Major de Police (4)
├─ Brigadier-Chef (3)
├─ Brigadier (2)
└─ Gardien de la Paix (1)
```

### Gendarmerie Nationale

```
OFFICIER GÉNÉRAL (Niveau 14-17)
├─ Haut-Commandant (17)
├─ Général de Corps d'Armée (16)
├─ Général de Division (15)
└─ Général de Brigade (14)

OFFICIER SUPÉRIEUR (Niveau 11-13)
├─ Colonel (13)
├─ Lieutenant-Colonel (12)
└─ Chef d'Escadron (11)

OFFICIER SUBALTERNE (Niveau 8-10)
├─ Capitaine (10)
├─ Lieutenant (9)
└─ Sous-Lieutenant (8)

SOUS-OFFICIER (Niveau 3-7)
├─ Major (7)
├─ Adjudant-Chef (6)
├─ Adjudant (5)
├─ Maréchal des Logis-Chef (4)
└─ Maréchal des Logis (3)

HOMME DU RANG (Niveau 1-2)
├─ Gendarme-Chef (2)
└─ Gendarme (1)
```

### Utilisation de la Hiérarchie

```python
from api.models.utils import (
    obtenir_niveau_grade,
    peut_commander,
    obtenir_categorie_grade
)
from api.models.enums import GradePolice, TypeForceOrdre

# Vérifier si un agent peut commander un autre
capitaine = GradePolice.CAPITAINE
lieutenant = GradePolice.LIEUTENANT

peut_commander = peut_commander(
    capitaine,
    lieutenant,
    TypeForceOrdre.POLICE_NATIONALE
)  # True

# Obtenir la catégorie d'un grade
categorie = obtenir_categorie_grade(
    GradePolice.COMMANDANT,
    TypeForceOrdre.POLICE_NATIONALE
)  # "OFFICIER_SUPERIEUR"

# Utilisation avec les modèles Agent
agent1 = Agent.objects.get(matricule='POL-2024-001234')
agent2 = Agent.objects.get(matricule='POL-2024-001235')

if agent1.peut_commander(agent2):
    print(f"{agent1.matricule} peut commander {agent2.matricule}")
```

## 🔄 Flux de Données

### Création d'un Citoyen avec Biométrie

```
1. Prise de rendez-vous → ANCEC
2. Présentation au centre d'enrôlement
3. Vérification documents
4. Capture biométrique
   ├─ 10 empreintes digitales (scanner Morpho)
   ├─ Photo d'identité (appareil conformeISO)
   └─ Signature (tablette graphique)
5. Validation par agent ANCEC
6. Enregistrement dans base ANCEC
7. Production CNI biométrique
8. Remise au citoyen (2-3 semaines)
```

### Recrutement d'un Agent

```
1. Citoyen postule (doit avoir CNI)
2. Vérification casier judiciaire
3. Tests et concours
4. Si admis → Création profil Agent
5. Formation à l'école (ENP/EOGN/ENSP)
6. Affectation première unité
7. Début de service
```

## 🔒 Sécurité et Conformité

### Protection des Données

- **RGPD/Loi sénégalaise** : Respect de la vie privée
- **Chiffrement** : Données biométriques chiffrées au repos
- **Accès restreint** : Authentification multi-facteurs
- **Audit** : Journalisation de tous les accès
- **Rétention** : Durée limitée selon la loi

### Authentification

```python
from api.services.biometrie import ServiceBiometrie
from api.models import Agent, EmpreinteDigitale
from api.models.enums import Doigt

def authentifier_agent(matricule, empreinte_capturee):
    """
    Authentification d'un agent par empreinte digitale
    """
    # 1. Trouver l'agent par matricule
    try:
        agent = Agent.objects.get(matricule=matricule)
    except Agent.DoesNotExist:
        return {'success': False, 'error': 'Agent non trouvé'}
    
    # 2. Récupérer le citoyen lié
    citoyen = agent.citoyen
    
    # 3. Vérifier l'empreinte
    resultat = ServiceBiometrie.verifier_empreinte_1_1(
        str(citoyen.id),
        empreinte_capturee,
        Doigt.POUCE_DROIT
    )
    
    if resultat.get('match') and resultat.get('confiance', 0) > 85:
        return {
            'success': True,
            'agent': agent,
            'confiance': resultat['confiance']
        }
    
    return {
        'success': False,
        'error': 'Empreinte non reconnue',
        'confiance': resultat.get('confiance', 0)
    }
```

## 📞 Contacts Utiles

### Numéros d'Urgence

- **Police/Gendarmerie** : 17
- **Pompiers** : 18
- **SAMU** : 15
- **SOS Médecins** : 1515
- **Police Secours** : 800 00 20 20

### Organismes

- **ANCEC** : +221 33 889 40 00
- **DTT** : +221 33 889 11 00
- **DGID** : +221 33 889 35 00
- **ANSD** : +221 33 869 21 39

## 🔧 API Endpoints

### Biométrie

- `POST /api/biometrie/verifier-empreinte/` : Vérification 1:1 par empreinte
- `POST /api/biometrie/identifier-personne/` : Identification 1:N par empreinte
- `POST /api/biometrie/verifier-faciale/` : Vérification par reconnaissance faciale

### Vérification

- `POST /api/verification/valider-cni/` : Valider le format d'un numéro CNI
- `POST /api/verification/valider-matricule/` : Valider le format d'un matricule

### Exemple d'utilisation

```bash
# Valider un numéro CNI
curl -X POST http://localhost:8000/api/verification/valider-cni/ \
  -H "Content-Type: application/json" \
  -d '{
    "numero_cni": "1995032512345"
  }'

# Vérifier une empreinte
curl -X POST http://localhost:8000/api/biometrie/verifier-empreinte/ \
  -H "Content-Type: application/json" \
  -d '{
    "citoyen_id": "uuid-du-citoyen",
    "doigt": "POUCE_DROIT",
    "template": "base64-encoded-template",
    "qualite": 90,
    "resolution": 500
  }'
```

## 📚 Références

- **Standards ISO** : ISO/IEC 19794 (Biométrie)
- **ANCEC** : https://ancec.sn
- **DGPN** : Ministère de l'Intérieur
- **HCGN** : Ministère des Forces Armées

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 2.0.0

