import { IndividuVerifie, Vehicule } from '../types';

/**
 * MODE DÉMO - Analyse d'image simulée
 * 
 * Dans une version de production, ces fonctions feraient appel à des services d'IA
 * comme Google Vision API, AWS Rekognition, ou un service personnalisé.
 */

/**
 * Analyse une photo pour reconnaître un visage et récupérer les informations
 * depuis la base de données DAF (simulée)
 */
export async function analyzePhotoForFaceRecognition(
  imageUri: string
): Promise<IndividuVerifie | null> {
  console.log('[DEMO] Analyse de reconnaissance faciale pour:', imageUri);
  
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Retourner des données simulées
  return {
    id: 'demo-face-' + Date.now(),
    cni: '1234567890123',
    nom: 'Diallo',
    prenom: 'Mamadou',
    dateNaissance: '1985-03-15',
    photo: imageUri,
    tel: '+221 77 123 45 67',
    adresse: 'Dakar, Sénégal',
    
    estRecherche: Math.random() > 0.7, // 30% de chance d'être recherché
    motifRecherche: Math.random() > 0.7 ? 'Vol à main armée' : undefined,
    
    amendes: Math.random() > 0.5 ? [
      {
        id: 'amende-1',
        montant: 25000,
        motif: 'Excès de vitesse',
        date: '2024-01-15',
        status: 'impayee',
        commissariat: 'Commissariat Central',
      },
    ] : [],
    totalAmendes: Math.random() > 0.5 ? 25000 : 0,
    
    casierJudiciaire: Math.random() > 0.6 ? [
      {
        id: 'casier-1',
        type: 'condamnation',
        description: 'Vol simple',
        date: '2020-05-10',
        peine: '6 mois avec sursis',
      },
    ] : [],
    estConnuJustice: Math.random() > 0.6,
    
    vehicules: [
      {
        id: 'vehicule-1',
        matricule: 'DK-1234-AB',
        marque: 'Toyota',
        modele: 'Corolla',
        couleur: 'Blanc',
        annee: 2018,
        proprietaireId: 'demo-face-' + Date.now(),
      },
    ],
  };
}

/**
 * Analyse une photo de plaque d'immatriculation pour extraire le numéro
 * et récupérer les informations du véhicule et du propriétaire
 */
export async function analyzeLicensePlate(
  imageUri: string
): Promise<{ matricule: string; vehicule: Vehicule; proprietaire: IndividuVerifie } | null> {
  console.log('[DEMO] Analyse de plaque d\'immatriculation pour:', imageUri);
  
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Générer un matricule aléatoire
  const matricule = `DK-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

  const proprietaire: IndividuVerifie = {
    id: 'demo-plate-' + Date.now(),
    cni: '9876543210987',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    dateNaissance: '1990-07-22',
    tel: '+221 76 987 65 43',
    adresse: 'Thiès, Sénégal',
    
    estRecherche: Math.random() > 0.8,
    motifRecherche: Math.random() > 0.8 ? 'Délit de fuite' : undefined,
    
    amendes: [
      {
        id: 'amende-2',
        montant: 15000,
        motif: 'Stationnement interdit',
        date: '2024-02-20',
        status: 'impayee',
        commissariat: 'Commissariat de Thiès',
      },
    ],
    totalAmendes: 15000,
    
    casierJudiciaire: [],
    estConnuJustice: false,
  };

  const vehicule: Vehicule = {
    id: 'vehicule-demo-' + Date.now(),
    matricule,
    marque: ['Toyota', 'Renault', 'Peugeot', 'Nissan'][Math.floor(Math.random() * 4)],
    modele: ['Corolla', 'Clio', '208', 'Qashqai'][Math.floor(Math.random() * 4)],
    couleur: ['Blanc', 'Noir', 'Gris', 'Bleu'][Math.floor(Math.random() * 4)],
    annee: 2015 + Math.floor(Math.random() * 9),
    proprietaireId: proprietaire.id,
  };

  return {
    matricule,
    vehicule,
    proprietaire,
  };
}

/**
 * Recherche un individu par CNI dans la base de données DAF (simulée)
 */
export async function searchByCNI(cni: string): Promise<IndividuVerifie | null> {
  console.log('[DEMO] Recherche par CNI:', cni);
  
  // Simuler un délai de recherche
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!cni || cni.length < 10) {
    return null;
  }

  return {
    id: 'demo-cni-' + Date.now(),
    cni,
    nom: 'Sow',
    prenom: 'Abdoulaye',
    dateNaissance: '1988-11-30',
    tel: '+221 78 456 78 90',
    adresse: 'Saint-Louis, Sénégal',
    
    estRecherche: Math.random() > 0.75,
    motifRecherche: Math.random() > 0.75 ? 'Fraude fiscale' : undefined,
    
    amendes: Math.random() > 0.4 ? [
      {
        id: 'amende-3',
        montant: 50000,
        motif: 'Conduite sans permis',
        date: '2024-03-10',
        status: 'impayee',
        commissariat: 'Commissariat de Saint-Louis',
      },
      {
        id: 'amende-4',
        montant: 20000,
        motif: 'Feu rouge grillé',
        date: '2024-01-25',
        status: 'payee',
        commissariat: 'Commissariat Central',
      },
    ] : [],
    totalAmendes: Math.random() > 0.4 ? 50000 : 0,
    
    casierJudiciaire: Math.random() > 0.7 ? [
      {
        id: 'casier-2',
        type: 'plainte',
        description: 'Escroquerie',
        date: '2019-08-15',
        lieu: 'Saint-Louis',
      },
    ] : [],
    estConnuJustice: Math.random() > 0.7,
    
    vehicules: [
      {
        id: 'vehicule-2',
        matricule: 'SL-5678-CD',
        marque: 'Renault',
        modele: 'Duster',
        couleur: 'Gris',
        annee: 2020,
        proprietaireId: 'demo-cni-' + Date.now(),
      },
    ],
  };
}

/**
 * Recherche un véhicule par matricule dans la base de données (simulée)
 */
export async function searchByMatricule(matricule: string): Promise<{ vehicule: Vehicule; proprietaire: IndividuVerifie } | null> {
  console.log('[DEMO] Recherche par matricule:', matricule);
  
  // Simuler un délai de recherche
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!matricule || matricule.length < 5) {
    return null;
  }

  const proprietaire: IndividuVerifie = {
    id: 'demo-mat-' + Date.now(),
    cni: '5555666677778',
    nom: 'Ba',
    prenom: 'Aminata',
    dateNaissance: '1992-04-18',
    tel: '+221 77 234 56 78',
    adresse: 'Kaolack, Sénégal',
    
    estRecherche: Math.random() > 0.85,
    motifRecherche: Math.random() > 0.85 ? 'Trafic de stupéfiants' : undefined,
    
    amendes: [],
    totalAmendes: 0,
    
    casierJudiciaire: [],
    estConnuJustice: false,
  };

  const vehicule: Vehicule = {
    id: 'vehicule-3',
    matricule: matricule.toUpperCase(),
    marque: 'Peugeot',
    modele: '3008',
    couleur: 'Noir',
    annee: 2019,
    proprietaireId: proprietaire.id,
  };

  return {
    vehicule,
    proprietaire,
  };
}
