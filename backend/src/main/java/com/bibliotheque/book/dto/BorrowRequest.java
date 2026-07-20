package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

/**
 * DTO pour la requête d'emprunt
 * Valide les champs avant qu'ils n'atteignent la business logic
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequest {
    
    @NotNull(message = "livreId is required")
    private Long livreId;
}
