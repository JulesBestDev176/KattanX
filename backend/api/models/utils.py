"""
Utilitaires pour la gestion des grades et hiérarchies
"""
from .enums import (
    TypeForceOrdre, GradePolice, GradeGendarmerie, GradePompiers,
    CategorieGrade, HIERARCHIE_POLICE, HIERARCHIE_GENDARMERIE, HIERARCHIE_POMPIERS
)


def obtenir_niveau_grade(grade, type_force):
    """
    Obtient le niveau hiérarchique d'un grade
    
    Args:
        grade: Le grade (GradePolice, GradeGendarmerie ou GradePompiers)
        type_force: Le type de force (TypeForceOrdre)
    
    Returns:
        int: Le niveau hiérarchique (0 si non trouvé)
    """
    if type_force == TypeForceOrdre.POLICE_NATIONALE:
        return HIERARCHIE_POLICE.get(grade, 0)
    elif type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
        return HIERARCHIE_GENDARMERIE.get(grade, 0)
    elif type_force == TypeForceOrdre.SAPEURS_POMPIERS:
        return HIERARCHIE_POMPIERS.get(grade, 0)
    return 0


def est_grade_superieur(grade1, grade2, type_force):
    """
    Compare deux grades et retourne si le premier est supérieur au second
    
    Args:
        grade1: Premier grade
        grade2: Second grade
        type_force: Type de force
    
    Returns:
        bool: True si grade1 > grade2
    """
    niveau1 = obtenir_niveau_grade(grade1, type_force)
    niveau2 = obtenir_niveau_grade(grade2, type_force)
    return niveau1 > niveau2


def peut_commander(grade_commandant, grade_subordonne, type_force):
    """
    Vérifie si un agent peut commander un autre agent
    
    Args:
        grade_commandant: Grade de l'agent commandant
        grade_subordonne: Grade de l'agent subordonné
        type_force: Type de force
    
    Returns:
        bool: True si le commandant peut commander le subordonné
    """
    return est_grade_superieur(grade_commandant, grade_subordonne, type_force)


def obtenir_categorie_grade(grade, type_force):
    """
    Obtient la catégorie d'un grade (homme du rang, sous-officier, officier, etc.)
    
    Args:
        grade: Le grade
        type_force: Type de force
    
    Returns:
        str: La catégorie du grade
    """
    niveau = obtenir_niveau_grade(grade, type_force)
    
    if type_force == TypeForceOrdre.POLICE_NATIONALE:
        if niveau <= 4:
            return CategorieGrade.SOUS_OFFICIER
        elif niveau <= 7:
            return CategorieGrade.OFFICIER_SUBALTERNE
        elif niveau <= 10:
            return CategorieGrade.OFFICIER_SUPERIEUR
        else:
            return CategorieGrade.HAUT_OFFICIER
    
    elif type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
        if niveau <= 2:
            return CategorieGrade.HOMME_DU_RANG
        elif niveau <= 7:
            return CategorieGrade.SOUS_OFFICIER
        elif niveau <= 10:
            return CategorieGrade.OFFICIER_SUBALTERNE
        elif niveau <= 13:
            return CategorieGrade.OFFICIER_SUPERIEUR
        else:
            return CategorieGrade.OFFICIER_GENERAL
    
    elif type_force == TypeForceOrdre.SAPEURS_POMPIERS:
        if niveau <= 2:
            return CategorieGrade.HOMME_DU_RANG
        elif niveau <= 8:
            return CategorieGrade.SOUS_OFFICIER
        elif niveau <= 11:
            return CategorieGrade.OFFICIER_SUBALTERNE
        elif niveau <= 14:
            return CategorieGrade.OFFICIER_SUPERIEUR
        else:
            return CategorieGrade.HAUT_COMMANDEMENT
    
    return CategorieGrade.INCONNU


def obtenir_grades_inferieurs(grade, type_force):
    """
    Obtient tous les grades inférieurs à un grade donné
    
    Args:
        grade: Le grade de référence
        type_force: Type de force
    
    Returns:
        list: Liste des grades inférieurs
    """
    niveau_grade = obtenir_niveau_grade(grade, type_force)
    
    if type_force == TypeForceOrdre.POLICE_NATIONALE:
        hierarchie = HIERARCHIE_POLICE
    elif type_force == TypeForceOrdre.GENDARMERIE_NATIONALE:
        hierarchie = HIERARCHIE_GENDARMERIE
    elif type_force == TypeForceOrdre.SAPEURS_POMPIERS:
        hierarchie = HIERARCHIE_POMPIERS
    else:
        return []
    
    return [
        g for g, niveau in hierarchie.items()
        if niveau < niveau_grade
    ]

