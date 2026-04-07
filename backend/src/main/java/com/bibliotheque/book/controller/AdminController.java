package com.bibliotheque.book.controller;

import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.shared.service.LivreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LivreService livreService;

    @PatchMapping("/livres/{id}/date")
    public ResponseEntity<String> updateLivreDate(
        @PathVariable Long id,
        @RequestParam String datePublication
    ) {
        try {
            Livre livre = livreService.getLivreById(id);
            livre.setDatePublication(LocalDate.parse(datePublication));
            livreService.updateLivre(
                id,
                livre.getTitre(),
                livre.getAuteur().getId(),
                livre.getGenre().getId(),
                livre.getLangue().getId(),
                livre.getIsbn(),
                livre.getResume(),
                LocalDate.parse(datePublication)
            );
            return ResponseEntity.ok("Date updated to " + datePublication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/init-dates")
    public ResponseEntity<String> initializeDates() {
        try {
            String[][] updates = {
                {"1", "2020-05-15"},
                {"2", "2019-03-20"},
                {"3", "2021-11-10"},
                {"4", "2018-06-01"},
                {"5", "2022-09-14"},
                {"6", "2017-12-25"},
                {"7", "2023-02-28"},
                {"8", "2021-04-10"},
                {"9", "2020-08-19"},
                {"10", "2019-11-05"}
            };
            
            StringBuilder result = new StringBuilder();
            for (String[] update : updates) {
                try {
                    Long livreId = Long.parseLong(update[0]);
                    LocalDate date = LocalDate.parse(update[1]);
                    Livre livre = livreService.getLivreById(livreId);
                    livreService.updateLivre(
                        livreId,
                        livre.getTitre(),
                        livre.getAuteur().getId(),
                        livre.getGenre().getId(),
                        livre.getLangue().getId(),
                        livre.getIsbn(),
                        livre.getResume(),
                        date
                    );
                    result.append("✓ Book ").append(update[0]).append(" -> ").append(update[1]).append("\n");
                } catch (Exception e) {
                    result.append("✗ Book ").append(update[0]).append(" failed\n");
                }
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
