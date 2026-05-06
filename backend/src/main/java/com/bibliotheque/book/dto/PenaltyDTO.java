package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour les réponses API sur les pénalités
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PenaltyDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long livreId;
    private String titreLivre;
    private Long possessionId;
    private LocalDateTime dateCreation;
    private LocalDate dateExpirationEmprunt;
    private LocalDate dateRetourActual;
    private LocalDateTime datePaiement;
    private Integer nombreJoursRetard;
    private BigDecimal tarifJournalier;
    private BigDecimal montantTotal;
    private String status;
    private String notes;
}
