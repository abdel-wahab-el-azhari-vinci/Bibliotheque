package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO pour la requête de paiement de pénalité
 * Valide les champs avant qu'ils n'atteignent la business logic
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayPenaltyRequest {
    
    @NotNull(message = "penaltyId is required")
    private Long penaltyId;
    
    @NotBlank(message = "paymentMethod is required")
    @Pattern(
        regexp = "^(CARD|CASH|CHECK)$",
        message = "paymentMethod must be one of: CARD, CASH, CHECK"
    )
    private String paymentMethod;  // CARD, CASH, CHECK
}
