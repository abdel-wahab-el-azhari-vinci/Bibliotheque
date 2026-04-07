package com.bibliotheque.book.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO pour les réponses des emprunts (possessions)
 * Contient toutes les infos nécessaires au frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingResponse {
    // Possession info
    private Long id;
    private String statut; // "EN_COURS" ou "RETOURNE"
    
    @JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEmprunt;
    
    @JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateRetourPrevu; // Toujours dateEmprunt + 14 jours
    
    @JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateRetourEffectif; // NULL si EN_COURS, sinon dateRetour
    
    // Livre info
    private Long livreId;
    private String titre;
    private String auteur; // auteurNom
    private String genre;
    private String isbn;
    private Integer anneePub;
    
    // User info
    private Long utilisateurId;
}
