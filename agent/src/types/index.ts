export type Screen = 'auth' | 'home' | 'verification' | 'alerts' | 'profile' | 'reports' | 'newReport';

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

// Report Types
export type ReportType =
  | 'mission'
  | 'verification'
  | 'alert'
  | 'judicial'
  | 'bolo';

export type ReportStatus =
  | 'draft'
  | 'pending'
  | 'validated'
  | 'archived';

export interface BaseReport {
  id: string;
  type: ReportType;
  status: ReportStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  validatedBy?: string;
  validatedAt?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  media?: {
    photos?: string[];
    videos?: string[];
    audio?: string[];
  };
}

export interface MissionReport extends BaseReport {
  type: 'mission';
  missionId?: string;
  missionTitle: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  actionsPerformed: string[];
  outcome: string;
  personsInvolved?: {
    name: string;
    cni?: string;
    role: 'suspect' | 'witness' | 'victim';
  }[];
}

export interface VerificationReport extends BaseReport {
  type: 'verification';
  individuCNI: string;
  individuName: string;
  verificationType: 'cni' | 'matricule' | 'photo';
  result: 'clean' | 'wanted' | 'has_fines' | 'has_record';
  notes?: string;
}

export interface AlertReport extends BaseReport {
  type: 'alert';
  alertId: string;
  alertType: 'fugitif' | 'vol' | 'incident' | 'autre';
  alertTitle: string;
  resolution?: string;
  resolved: boolean;
}

export interface JudicialReport extends BaseReport {
  type: 'judicial';
  complaintType: 'against_x' | 'against_person';
  plaintiffName: string;
  plaintiffCNI: string;
  accusedName?: string;
  accusedCNI?: string;
  facts: string;
  legalBasis?: string;
  transferredTo?: string;
}

export interface BOLOReport extends BaseReport {
  type: 'bolo';
  suspectDescription: Suspect;
  lastSeenLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  direction?: string;
  reliability: 'low' | 'medium' | 'high';
  boloStatus: 'active' | 'found' | 'cancelled'; // Renamed to avoid conflict with BaseReport.status
}

export type Report =
  | MissionReport
  | VerificationReport
  | AlertReport
  | JudicialReport
  | BOLOReport;

