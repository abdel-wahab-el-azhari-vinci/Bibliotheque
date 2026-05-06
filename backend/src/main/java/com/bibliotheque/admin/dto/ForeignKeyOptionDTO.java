package com.bibliotheque.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour les options de clés étrangères
 * Utilisé pour afficher des paires id/label dans le formulaire dynamique
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForeignKeyOptionDTO {
    
    /**
     * ID de la valeur dans la table référencée
     */
    private Long id;
    
    /**
     * Label/Description à afficher à l'utilisateur
     */
    private String label;
}
