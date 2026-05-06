package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request pour payer une pénalité
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayPenaltyRequest {
    private Long penaltyId;
    private String paymentMethod;  // CARD, CASH, CHECK
}
