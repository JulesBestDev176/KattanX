export type Screen = 'auth' | 'home' | 'profile' | 'dossier' | 'proprietes' | 'denonciations' | 'plaintes' | 'revenus';

export interface User {
  id: string;
  email: string;
  name: string;
  cni: string;
  tel: string;
  photo?: string; // URL de la photo de profil (fournie par la DAF)
}

export interface Dossier {
  id: string;
  type: 'cni' | 'passeport' | 'extrait_naissance' | 'casier_judiciaire' | 'acte_mariage' | 'acte_deces' | 'certificat_residence' | 'permis_conduire' | 'carte_sejour' | 'autre';
  numero: string;
  dateEmission: string;
  dateExpiration?: string;
  statut?: 'valide' | 'expire' | 'en_attente';
}

export interface Propriete {
  id: string;
  type: 'maison' | 'voiture' | 'terrain' | 'appartement' | 'commerce' | 'autre';
  titre: string;
  reference: string;
  adresse?: string;
  superficie?: string;
  details: string;
  dateAcquisition?: string;
}

export interface Denonciation {
  id: string;
  type: string;
  description: string;
  localisation: string;
  preuveType: string;
  status: string;
  createdAt: string;
}

export interface Plainte {
  id: string;
  type: 'reçue' | 'déposée';
  objet: string;
  description: string;
  commissariat?: string;
  amende?: number;
  status: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'gain' | 'retrait';
  method?: string;
  accountNumber?: string;
  date: string;
  status: string;
}

export interface Revenus {
  total: number;
  transactions: Transaction[];
}



