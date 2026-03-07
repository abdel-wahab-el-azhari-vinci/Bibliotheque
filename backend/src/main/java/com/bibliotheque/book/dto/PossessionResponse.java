package com.bibliotheque.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PossessionResponse {
    private Long id;
    private LocalDate dateEmprunt;
    private LocalDate dateRetour;
    private Long livreId;
    private String livreTitre;
    private Long userId;
}
