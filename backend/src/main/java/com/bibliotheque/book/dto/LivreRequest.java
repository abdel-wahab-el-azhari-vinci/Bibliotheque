package com.bibliotheque.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO LivreRequest - Entrée API pour créer/modifier un livre
 * 
 * Règle AI_RULES: 
 * ✅ Validations intégrées
 * ✅ JAMAIS l'entité Livre
 * ✅ IDs seulement pour les dépendances
 * ❌ Pas de logique métier
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivreRequest {
    
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    
    private String isbn;
    
    private String resume;
    
    private LocalDate datePublication;
    
    @NotNull(message = "L'auteur est obligatoire")
    private Long auteurId;
    
    @NotNull(message = "Le genre est obligatoire")
    private Long genreId;
    
    @NotNull(message = "La langue est obligatoire")
    private Long langueId;
}
