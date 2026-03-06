package com.bibliotheque.book.controller;

import com.bibliotheque.shared.service.PossessionService;
import com.bibliotheque.shared.entity.Possession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST API Controller - Gestion des Possessions (Inventaire)
 * 
 * Une Possession = 1 exemplaire physique d'un Livre
 * Gère le stock: ajout, sortie, retour
 */
@RestController
@RequestMapping("/api/possessions")
@RequiredArgsConstructor
public class PossessionController {
    
    private final PossessionService possessionService;
    
    /**
     * GET /api/possessions/en-stock
     * Tous les livres actuellement en stock
     */
    @GetMapping("/en-stock")
    public ResponseEntity<List<Possession>> getAllEnStock() {
        List<Possession> possessions = possessionService.getAllEnStock();
        return ResponseEntity.ok(possessions);
    }
    
    /**
     * GET /api/possessions/sortis
     * Tous les livres qui ont été sortis
     */
    @GetMapping("/sortis")
    public ResponseEntity<List<Possession>> getAllSortis() {
        List<Possession> possessions = possessionService.getAllSortis();
        return ResponseEntity.ok(possessions);
    }
    
    /**
     * GET /api/possessions/livre/{livreId}
     * Historique complet d'un livre (acquisitions, sorties, retours)
     */
    @GetMapping("/livre/{livreId}")
    public ResponseEntity<List<Possession>> getFullHistory(@PathVariable Long livreId) {
        List<Possession> historique = possessionService.getFullHistory(livreId);
        return ResponseEntity.ok(historique);
    }
    
    /**
     * GET /api/possessions/livre/{livreId}/statut
     * Statut d'un livre: EN_STOCK, SORTI, AUCUN_EXEMPLAIRE
     */
    @GetMapping("/livre/{livreId}/statut")
    public ResponseEntity<String> getStatus(@PathVariable Long livreId) {
        String status = possessionService.getStatus(livreId);
        return ResponseEntity.ok(status);
    }
    
    /**
     * POST /api/possessions/ajouter-stock
     * Ajouter un exemplaire au stock
     * Body: { "livreId": 1, "userId": 1 }
     */
    @PostMapping("/ajouter-stock")
    public ResponseEntity<Possession> addToStock(
        @RequestParam Long livreId,
        @RequestParam Long userId
    ) {
        Possession possession = possessionService.addLivreToStock(livreId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(possession);
    }
    
    /**
     * PATCH /api/possessions/{id}/sortir
     * Marquer un livre comme sorti/emprunté
     */
    @PatchMapping("/{id}/sortir")
    public ResponseEntity<Possession> markAsOut(
        @PathVariable Long id,
        @RequestParam(required = false) LocalDate dateRetour
    ) {
        Possession possession = possessionService.markAsOut(id, dateRetour);
        return ResponseEntity.ok(possession);
    }
    
    /**
     * PATCH /api/possessions/{id}/retourner
     * Marquer un livre comme retourné
     */
    @PatchMapping("/{id}/retourner")
    public ResponseEntity<Possession> markAsReturned(@PathVariable Long id) {
        Possession possession = possessionService.markAsReturned(id);
        return ResponseEntity.ok(possession);
    }
}
