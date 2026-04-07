package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO LivreResponse - Sortie API pour les livres
 * 
 * Règle AI_RULES:
 * ✅ Retourne JAMAIS l'entité Livre
 * ✅ Contient seulement ce que le mobile a besoin
 * ✅ Références aux auteurs/genres/langues en IDs et libellés
 * ❌ Pas d'entités complexes
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LivreResponse {
    
    private Long id;
    private String titre;
    private String isbn;
    private String resume;
    private LocalDate datePublication;
    
    // Références aux dépendances (IDs + libellés pour affichage)
    private Long auteurId;
    private String auteurNom;
    
    private Long genreId;
    private String genreLibelle;
    
    private Long langueId;
    private String langueLibelle;
    
    // Données de stock (calculées depuis le service)
    private String statusStock; // EN_STOCK ou SORTI
    private Integer nbExemplairesDisponibles;
}
