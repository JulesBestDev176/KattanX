/**
 * Service API pour communiquer avec le backend Django
 * Base URL: http://localhost:8000/api (développement)
 */
import { Platform } from 'react-native';
import { API_BASE_URL } from './supabase';
import { LOCAL_IP, DJANGO_PORT } from '../config/api.config';

// Configuration de l'URL du backend Django
// Détection automatique selon la plateforme et l'environnement
const getDjangoApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.citizenportal.sn/api';  // Production
  }
  
  // Pour Android
  if (Platform.OS === 'android') {
    // Sur émulateur Android, utiliser 10.0.2.2 qui pointe vers localhost de la machine hôte
    // Sur appareil physique, utiliser l'IP locale de la machine
    // Note: On ne peut pas détecter automatiquement si c'est un émulateur ou un appareil physique
    // Par défaut, on utilise l'IP locale (modifiable dans api.config.ts)
    return `http://${LOCAL_IP}:${DJANGO_PORT}/api`;
  }
  
  // Pour iOS
  if (Platform.OS === 'ios') {
    // Sur simulateur iOS, utiliser localhost
    // Sur appareil physique, utiliser l'IP locale
    // Note: On ne peut pas détecter automatiquement si c'est un simulateur ou un appareil physique
    // Par défaut, on utilise l'IP locale (modifiable dans api.config.ts)
    return `http://${LOCAL_IP}:${DJANGO_PORT}/api`;
  }
  
  // Pour web, utiliser localhost
  return `http://localhost:${DJANGO_PORT}/api`;
};

const DJANGO_API_BASE_URL = getDjangoApiBaseUrl();

// Log de l'URL utilisée (pour debug)
if (__DEV__) {
  console.log(`[API Config] Backend URL: ${DJANGO_API_BASE_URL}`);
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface InscriptionEtape1Data {
  nom: string;
  prenom: string;
  numeroCNI: string;
  dateNaissance: string; // Format: YYYY-MM-DD
  lieuNaissance: string;
}

export interface InscriptionEtape1Response {
  success: boolean;
  session_id: string;
  message: string;
  verification_ancec: {
    succes: boolean;
    verifications: {
      cniExiste: boolean;
      informationsCoherentes: boolean;
      dateNaissanceCorrecte: boolean;
      cniValide: boolean;
      ageMinimum: boolean;
    };
    donneesANCEC?: {
      numeroCNI: string;
      nom: string;
      prenom: string;
      dateNaissance: string;
      lieuNaissance: string;
      genre: string;
      photo?: string;
      empreintesEnregistrees: boolean;
    };
    erreurs?: string[];
    avertissements?: string[];
    dateVerification: string;
    sourceVerification: string;
  };
  prochaine_etape: string;
}

export interface InscriptionEtape2Data {
  telephone: string; // Format: +221XXXXXXXXX
  email?: string;
  motDePasse: string;
  confirmationMotDePasse: string;
  codeOTP: string;
  sessionId: string;
}

export interface InscriptionEtape2Response {
  success: boolean;
  message: string;
  numero_unique: string;
  prochaine_etape: string;
}

export interface InscriptionEtape3Data {
  sessionId: string;
  donnees_etape1: InscriptionEtape1Data;
  donnees_etape2: {
    telephone: string;
    email?: string;
    mot_de_passe: string;
    numero_unique: string;
    type_inscription: 'CITOYEN' | 'AGENT';
  };
  photo_id?: string;
  empreinte_id?: string;
  photo_url?: string;
}

export interface InscriptionEtape3Response {
  success: boolean;
  message: string;
  utilisateur: {
    id: string;
    numeroIdentificationUnique: string;
    numeroCNI: string;
    nom: string;
    prenom: string;
    telephone: string;
    email?: string;
    roles: string[];
    statutInscription: string;
  };
  tokens: {
    access: string;
    refresh: string;
    expires_in: number;
  };
}

export interface LoginData {
  identifiant: string; // Email, téléphone ou numéro unique
  motDePasse: string;
  typeUtilisateur?: 'CITOYEN' | 'AGENT' | 'CONTROLEUR';
}

export interface LoginResponse {
  success: boolean;
  utilisateur: {
    id: string;
    numeroIdentificationUnique: string;
    nom: string;
    prenom: string;
    numeroCNI: string;
    telephone: string;
    email?: string;
    roles: string[];
    photo?: string;
  };
  tokens: {
    access: string;
    refresh: string;
    expires_in: number;
  };
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  code_otp?: string; // Seulement en développement
  date_expiration: string;
  max_tentatives: number;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  erreur?: string;
}

/**
 * Classe API pour les appels au backend Django
 */
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = DJANGO_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Log pour debug
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    if (options.body) {
      try {
        console.log(`[API] Body:`, JSON.parse(options.body as string));
      } catch (e) {
        console.log(`[API] Body:`, options.body);
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`[API] Response status: ${response.status}`);

      const data = await response.json();
      console.log(`[API] Response data:`, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`[API] Error [${endpoint}]:`, error);
      console.error(`[API] URL attempted: ${url}`);
      throw error;
    }
  }

  // ============================================
  // Inscription - Étape 1
  // ============================================

  async inscriptionEtape1(
    data: InscriptionEtape1Data
  ): Promise<InscriptionEtape1Response> {
    return this.request<InscriptionEtape1Response>(
      '/auth/register/citoyen/etape1',
      {
        method: 'POST',
        body: JSON.stringify({
          nom: data.nom,
          prenom: data.prenom,
          numero_cni: data.numeroCNI,  // Convertir camelCase vers snake_case
          date_naissance: data.dateNaissance,  // Convertir camelCase vers snake_case
          lieu_naissance: data.lieuNaissance,  // Convertir camelCase vers snake_case
        }),
      }
    );
  }

  // ============================================
  // Inscription - Étape 2
  // ============================================

  async sendOTP(telephone: string): Promise<SendOTPResponse> {
    return this.request<SendOTPResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ telephone }),
    });
  }

  async verifyOTP(telephone: string, codeOTP: string): Promise<VerifyOTPResponse> {
    return this.request<VerifyOTPResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ telephone, code_otp: codeOTP }),
    });
  }

  async inscriptionEtape2(
    data: InscriptionEtape2Data
  ): Promise<InscriptionEtape2Response> {
    return this.request<InscriptionEtape2Response>(
      '/auth/register/citoyen/etape2',
      {
        method: 'POST',
        body: JSON.stringify({
          telephone: data.telephone,
          email: data.email,
          mot_de_passe: data.motDePasse,
          confirmation_mot_de_passe: data.confirmationMotDePasse,
          code_otp: data.codeOTP,
          type_inscription: 'CITOYEN',
        }),
      }
    );
  }

  // ============================================
  // Inscription - Étape 3
  // ============================================

  async uploadPhoto(
    photoUri: string,
    citoyenId?: string
  ): Promise<{ success: boolean; photo: { id: string; url: string } }> {
    try {
      // Créer FormData pour React Native
      const formData = new FormData();
      
      // Pour React Native, utiliser l'URI directement avec le format requis
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Format pour React Native FormData
      formData.append('image', {
        uri: photoUri,
        type: type,
        name: filename,
      } as any);
      
      if (citoyenId) {
        formData.append('citoyen_id', citoyenId);
      }

      const url = `${this.baseUrl}/images/upload-photo/`;
      console.log(`[API] Upload photo to: ${url}`);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        headers: {
          // Ne pas définir Content-Type, React Native le fait automatiquement pour FormData
        },
        body: formData,
      });

      const data = await uploadResponse.json();
      console.log(`[API] Upload photo response:`, data);

      if (!uploadResponse.ok) {
        throw new Error(data.error || `HTTP ${uploadResponse.status}`);
      }

      return {
        success: true,
        photo: {
          id: data.id,
          url: data.url || data.image_url,
        },
      };
    } catch (error: any) {
      console.error('[API] Upload photo error:', error);
      throw error;
    }
  }

  async enregistrerEmpreinte(
    empreinteData: {
      citoyen_id?: string;
      doigt: string;
      template?: string;
      qualite: number;
      dispositif: string;
      date_capture?: string;
      type_biometrie?: string;
    }
  ): Promise<{ success: boolean; empreinte_id: string; url?: string }> {
    try {
      // Créer un template à partir des données d'authentification
      // Note: LocalAuthentication ne donne pas accès aux données brutes
      // On crée un identifiant unique basé sur l'authentification réussie
      const template = empreinteData.template || JSON.stringify({
        type: empreinteData.type_biometrie || 'Empreinte digitale',
        date: empreinteData.date_capture || new Date().toISOString(),
        dispositif: empreinteData.dispositif,
        authentification_reussie: true,
        hash: `FP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });

      const formData = new FormData();
      formData.append('doigt', empreinteData.doigt);
      formData.append('qualite', empreinteData.qualite.toString());
      formData.append('dispositif', empreinteData.dispositif);
      formData.append('template', template);

      const url = `${this.baseUrl}/biometrie/upload-empreinte/`;
      console.log(`[API] Upload empreinte to: ${url}`);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        headers: {
          // Ne pas définir Content-Type pour FormData
        },
        body: formData,
      });

      const data = await uploadResponse.json();
      console.log(`[API] Upload empreinte response:`, data);

      if (!uploadResponse.ok) {
        throw new Error(data.error || `HTTP ${uploadResponse.status}`);
      }

      return {
        success: true,
        empreinte_id: data.empreinte_id,
        url: data.url,
      };
    } catch (error: any) {
      console.error('[API] Upload empreinte error:', error);
      throw error;
    }
  }

  async inscriptionEtape3(
    data: InscriptionEtape3Data
  ): Promise<InscriptionEtape3Response> {
    return this.request<InscriptionEtape3Response>(
      '/auth/register/citoyen/etape3',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================
  // Authentification
  // ============================================

  async login(data: LoginData): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifiant: data.identifiant,
        mot_de_passe: data.motDePasse,
        type_utilisateur: data.typeUtilisateur || 'CITOYEN',
      }),
    });
  }

  async refreshToken(refreshToken: string): Promise<{ access: string; refresh: string }> {
    return this.request<{ access: string; refresh: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  // ============================================
  // Services Citoyens - Documents
  // ============================================

  async getDocuments(): Promise<{ documents: any[] }> {
    return this.request<{ documents: any[] }>('/citoyens/documents/', {
      method: 'GET',
    });
  }

  // ============================================
  // Services Citoyens - Dénonciations
  // ============================================

  async getDenonciations(status?: string): Promise<{
    denonciations: any[];
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  }> {
    const url = status ? `/denonciations/?status=${status}` : '/denonciations/';
    return this.request(url, {
      method: 'GET',
    });
  }

  async createDenonciation(data: {
    type: string;
    description: string;
    localisation: string;
    preuveType: string;
    preuve?: any;
  }): Promise<{ success: boolean; denonciation: any }> {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('description', data.description);
    formData.append('localisation', data.localisation);
    formData.append('preuve_type', data.preuveType);
    
    if (data.preuve) {
      formData.append('preuve_fichier', data.preuve);
    }

    return this.request<{ success: boolean; denonciation: any }>(
      '/denonciations/create/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
    );
  }

  async getDenonciationDetail(denonciationId: string): Promise<any> {
    return this.request(`/denonciations/${denonciationId}/`, {
      method: 'GET',
    });
  }

  // ============================================
  // Services Citoyens - Plaintes
  // ============================================

  async getPlaintes(type?: string, status?: string): Promise<{
    plaintes: any[];
    total: number;
    reçues: number;
    déposées: number;
  }> {
    let url = '/plaintes/';
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async createPlainte(data: {
    objet: string;
    description: string;
    commissariat?: string;
    localisation?: { latitude: number; longitude: number; adresse?: string };
  }): Promise<{ success: boolean; plainte: any }> {
    return this.request<{ success: boolean; plainte: any }>(
      '/plaintes/create/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getPlainteDetail(plainteId: string): Promise<any> {
    return this.request(`/plaintes/${plainteId}/`, {
      method: 'GET',
    });
  }

  // ============================================
  // Services Citoyens - Revenus
  // ============================================

  async getRevenus(): Promise<{
    solde: number;
    transactions: any[];
    statistiques: {
      gainsTotaux: number;
      transferts: number;
      retraits: number;
    };
  }> {
    return this.request('/revenus/', {
      method: 'GET',
    });
  }

  async transfer(data: {
    montant: number;
    type: 'mobile_money' | 'bank';
    destinataire: string;
  }): Promise<{
    success: boolean;
    transaction: any;
    nouveauSolde: number;
  }> {
    return this.request<{
      success: boolean;
      transaction: any;
      nouveauSolde: number;
    }>('/transfer/', {
      method: 'POST',
      body: JSON.stringify({
        montant: data.montant,
        type: data.type,
        destinataire: data.destinataire,
      }),
    });
  }

  // ============================================
  // Services Citoyens - Profil
  // ============================================

  async getProfile(): Promise<any> {
    // Utiliser l'endpoint citoyen existant
    return this.request('/citoyens/', {
      method: 'GET',
    });
  }

  async updateProfile(data: Partial<any>): Promise<any> {
    // Utiliser l'endpoint citoyen existant
    return this.request('/citoyens/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // Services Citoyens - Alertes d'Urgence
  // ============================================

  async createAlerteUrgence(data: {
    type: string;
    description?: string;
    localisation?: string;
    latitude: number;
    longitude: number;
  }): Promise<{
    success: boolean;
    message: string;
    alerte: any;
    brigades_notifiees: any[];
  }> {
    return this.request<{
      success: boolean;
      message: string;
      alerte: any;
      brigades_notifiees: any[];
    }>('/alertes-urgence/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAlertesUrgence(): Promise<{ alertes: any[] }> {
    return this.request<{ alertes: any[] }>('/alertes-urgence/', {
      method: 'GET',
    });
  }

  async getAlerteUrgenceDetail(alerteId: string): Promise<any> {
    return this.request(`/alertes-urgence/${alerteId}/`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();

