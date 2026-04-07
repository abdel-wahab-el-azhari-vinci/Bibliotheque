package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO GenreResponse - Pour les filtres et dropdowns
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenreResponse {
    
    private Long id;
    private String libelle;
    private Long categorieId;
    private String categorieLibelle;
}
