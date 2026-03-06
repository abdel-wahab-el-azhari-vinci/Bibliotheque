package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO AuteurResponse - Pour l'affichage des auteurs
 * Utilisé notamment dans les listes déroulantes du formulaire "Nouvel Ouvrage"
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuteurResponse {
    
    private Long id;
    private String nom;
    private String biographie;
    private LocalDate dateNaissance;
    private LocalDate dateDeces;
    private String paysNom;
    private String langueLibelle;
}
