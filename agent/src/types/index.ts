export type Screen = 'auth' | 'home' | 'verification' | 'alerts' | 'profile';

export interface Agent {
  id: string;
  email: string;
  name: string;
  prenom: string;
  nom: string;
  cni: string;
  tel: string;
  corps: 'Police' | 'Gendarmerie' | 'Douane' | 'Armée' | 'Autre';
  matricule: string; // Matricule professionnel
  photo?: string;
  position?: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
  enService: boolean;
  stats?: {
    verificationsEffectuees: number;
    alertesCreees: number;
    arrestations: number;
  };
}

export interface IndividuVerifie {
  id: string;
  cni: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  photo?: string;
  tel?: string;
  adresse?: string;
  
  // Statuts
  estRecherche: boolean;
  motifRecherche?: string;
  
  // Amendes
  amendes: Amende[];
  totalAmendes: number;
  
  // Casier judiciaire
  casierJudiciaire: CasierEntry[];
  estConnuJustice: boolean;
  
  // Véhicules
  vehicules?: Vehicule[];
}

export interface Amende {
  id: string;
  montant: number;
  motif: string;
  date: string;
  status: 'impayee' | 'payee' | 'en_cours';
  commissariat?: string;
  agentId?: string;
}

export interface CasierEntry {
  id: string;
  type: 'condamnation' | 'plainte' | 'garde_a_vue' | 'autre';
  description: string;
  date: string;
  lieu?: string;
  peine?: string;
}

export interface Vehicule {
  id: string;
  matricule: string;
  marque: string;
  modele: string;
  couleur: string;
  annee?: number;
  proprietaireId: string;
}

export interface Alerte {
  id: string;
  type: 'fugitif' | 'vol' | 'incident' | 'autre';
  titre: string;
  description: string;
  
  // Suspect
  suspect?: Suspect;
  
  // Localisation
  localisation: {
    latitude: number;
    longitude: number;
    adresse?: string;
  };
  
  // Médias
  images?: string[];
  
  // Métadonnées
  createdBy: string; // Agent ID
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'resolue' | 'annulee';
  
  // Distance (calculée côté client)
  distance?: number;
}

export interface Suspect {
  // Identification
  nom?: string;
  prenom?: string;
  cni?: string;
  photo?: string;
  
  // Véhicule
  vehicule?: {
    matricule?: string;
    marque?: string;
    modele?: string;
    couleur?: string;
    description?: string;
  };
  
  // Description physique
  sexe?: 'homme' | 'femme' | 'inconnu';
  ageMin?: number;
  ageMax?: number;
  couleurPeau?: 'claire' | 'mate' | 'foncee';
  tailleMin?: number; // en cm
  tailleMax?: number;
  poidsMin?: number; // en kg
  poidsMax?: number;
  signesParticuliers?: string;
}

export interface DemandeArrestation {
  id: string;
  individuId: string;
  individuNom: string;
  individuCNI: string;
  motif: string;
  description?: string;
  agentId: string;
  agentNom: string;
  createdAt: string;
  status: 'en_attente' | 'approuvee' | 'refusee';
  reponse?: {
    approuvePar?: string;
    dateReponse?: string;
    commentaire?: string;
  };
}

export interface VerificationMethod {
  type: 'cni' | 'matricule' | 'photo';
  label: string;
  icon: string;
  description: string;
}
