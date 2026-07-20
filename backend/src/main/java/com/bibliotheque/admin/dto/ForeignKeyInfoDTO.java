package com.bibliotheque.admin.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour les informations des clés étrangères d'une table
 * Contient le nom de la colonne FK et ses options de valeurs
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForeignKeyInfoDTO {
    
    /**
     * Nom de la colonne qui est une clé étrangère
     */
    private String columnName;
    
    /**
     * Nom de la table référencée
     */
    private String referencedTable;
    
    /**
     * Colonne affichée comme label (ex: "nom", "libelle", "email")
     */
    private String labelColumn;
    
    /**
     * Liste des options disponibles pour cette clé étrangère
     */
    private List<ForeignKeyOptionDTO> options;
}
