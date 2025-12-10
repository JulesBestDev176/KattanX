"""
Service de vérification et validation des formats officiels
"""
import re
from typing import Optional, Tuple
from datetime import datetime


class ServiceVerification:
    """Service pour vérifier les formats officiels (CNI, matricules, etc.)"""
    
    @staticmethod
    def valider_format_cni(numero_cni: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format CNI ANCEC: AAAAMMJJNNNNN (13 chiffres)
        
        Args:
            numero_cni: Numéro CNI à valider
        
        Returns:
            (is_valid, error_message)
        """
        if not numero_cni:
            return False, "Le numéro CNI est requis"
        
        # Vérifier que c'est exactement 13 chiffres
        if not re.match(r'^\d{13}$', numero_cni):
            return False, "Le numéro CNI doit contenir exactement 13 chiffres"
        
        # Extraire la date de naissance
        annee = int(numero_cni[0:4])
        mois = int(numero_cni[4:6])
        jour = int(numero_cni[6:8])
        
        # Vérifier la validité de la date
        try:
            date_naissance = datetime(annee, mois, jour)
            annee_actuelle = datetime.now().year
            
            # Vérifier que l'année est raisonnable (entre 1900 et année actuelle)
            if annee < 1900 or annee > annee_actuelle:
                return False, f"Année de naissance invalide: {annee}"
            
            # Vérifier que le mois est valide (1-12)
            if mois < 1 or mois > 12:
                return False, f"Mois invalide: {mois}"
            
            # Vérifier que le jour est valide pour ce mois
            if jour < 1 or jour > 31:
                return False, f"Jour invalide: {jour}"
            
        except ValueError as e:
            return False, f"Date de naissance invalide: {str(e)}"
        
        return True, None
    
    @staticmethod
    def extraire_date_naissance_cni(numero_cni: str) -> Optional[datetime]:
        """
        Extrait la date de naissance depuis un numéro CNI
        
        Returns:
            datetime ou None si invalide
        """
        is_valid, _ = ServiceVerification.valider_format_cni(numero_cni)
        if not is_valid:
            return None
        
        annee = int(numero_cni[0:4])
        mois = int(numero_cni[4:6])
        jour = int(numero_cni[6:8])
        
        try:
            return datetime(annee, mois, jour)
        except:
            return None
    
    @staticmethod
    def valider_format_matricule_police(matricule: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format matricule Police: POL-AAAA-NNNNNN
        """
        pattern = r'^POL-\d{4}-\d{6}$'
        if not re.match(pattern, matricule):
            return False, "Format invalide. Attendu: POL-AAAA-NNNNNN (ex: POL-2024-123456)"
        
        # Extraire l'année
        annee = int(matricule.split('-')[1])
        annee_actuelle = datetime.now().year
        
        if annee < 1950 or annee > annee_actuelle + 1:
            return False, f"Année invalide: {annee}"
        
        return True, None
    
    @staticmethod
    def valider_format_matricule_gendarmerie(matricule: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format matricule Gendarmerie: GEN-AAAA-NNNNNN
        """
        pattern = r'^GEN-\d{4}-\d{6}$'
        if not re.match(pattern, matricule):
            return False, "Format invalide. Attendu: GEN-AAAA-NNNNNN (ex: GEN-2024-123456)"
        
        annee = int(matricule.split('-')[1])
        annee_actuelle = datetime.now().year
        
        if annee < 1950 or annee > annee_actuelle + 1:
            return False, f"Année invalide: {annee}"
        
        return True, None
    
    @staticmethod
    def valider_format_matricule_pompiers(matricule: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format matricule Pompiers: POM-AAAA-NNNNNN
        """
        pattern = r'^POM-\d{4}-\d{6}$'
        if not re.match(pattern, matricule):
            return False, "Format invalide. Attendu: POM-AAAA-NNNNNN (ex: POM-2024-123456)"
        
        annee = int(matricule.split('-')[1])
        annee_actuelle = datetime.now().year
        
        if annee < 1950 or annee > annee_actuelle + 1:
            return False, f"Année invalide: {annee}"
        
        return True, None
    
    @staticmethod
    def valider_format_permis(permis: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format permis de conduire: PC-AAAA-NNNNNN
        """
        pattern = r'^PC-\d{4}-\d{6}$'
        if not re.match(pattern, permis):
            return False, "Format invalide. Attendu: PC-AAAA-NNNNNN (ex: PC-2024-123456)"
        
        return True, None
    
    @staticmethod
    def valider_format_immatriculation(immatriculation: str) -> Tuple[bool, Optional[str]]:
        """
        Valide le format immatriculation: RR-NNNN-LL
        """
        pattern = r'^[A-Z]{2}-\d{4}-[A-Z]{2}$'
        if not re.match(pattern, immatriculation):
            return False, "Format invalide. Attendu: RR-NNNN-LL (ex: DK-1234-AB)"
        
        # Vérifier que le code région est valide
        code_region = immatriculation.split('-')[0]
        regions_valides = ['DK', 'TH', 'SL', 'LG', 'MT', 'TC', 'KD', 'KL', 'SD', 'ZG', 'KC', 'FT', 'DB']
        
        if code_region not in regions_valides:
            return False, f"Code région invalide: {code_region}"
        
        return True, None
    
    @staticmethod
    def generer_matricule_police(annee: int, numero_sequentiel: int) -> str:
        """
        Génère un matricule Police au format POL-AAAA-NNNNNN
        """
        return f"POL-{annee}-{numero_sequentiel:06d}"
    
    @staticmethod
    def generer_matricule_gendarmerie(annee: int, numero_sequentiel: int) -> str:
        """
        Génère un matricule Gendarmerie au format GEN-AAAA-NNNNNN
        """
        return f"GEN-{annee}-{numero_sequentiel:06d}"
    
    @staticmethod
    def generer_matricule_pompiers(annee: int, numero_sequentiel: int) -> str:
        """
        Génère un matricule Pompiers au format POM-AAAA-NNNNNN
        """
        return f"POM-{annee}-{numero_sequentiel:06d}"

