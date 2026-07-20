package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Résumé des pénalités pour un utilisateur
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPenaltySummaryDTO {
    private Long userId;
    private Long pendingPenaltiesCount;      // Nombre de pénalités en attente
    private BigDecimal totalPendingAmount;    // Montant total à payer
    private Boolean canBorrow;                // Peut-il emprunter?
}
