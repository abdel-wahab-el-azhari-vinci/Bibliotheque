package com.bibliotheque.book.controller;

import com.bibliotheque.shared.service.PossessionService;
import com.bibliotheque.shared.service.PenaltyService;
import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.book.dto.BorrowRequest;
import com.bibliotheque.book.dto.PossessionResponse;
import com.bibliotheque.book.dto.BorrowingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;

import java.time.LocalDate;
import java.util.NoSuchElementException;
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
    private final PenaltyService penaltyService;
    private final UserRepository userRepository;
    
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
     * GET /api/possessions/me
     * Récupérer les emprunts de l'utilisateur authentifié avec infos complètes
     * Response: List<BorrowingResponse> avec titre, auteur, dates, statut
     */
    @GetMapping("/me")
    public ResponseEntity<List<BorrowingResponse>> getMyBorrowings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        List<Possession> borrowings = possessionService.getUserBorrowings(user.getId());
        
        List<BorrowingResponse> response = borrowings.stream()
            .map(this::toBorrowingResponse)
            .toList();
        
        return ResponseEntity.ok(response);
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
     * IMPORTANT: Auto-déclenche la création d'une pénalité si le retour est EN RETARD
     * Response: BorrowingResponse pour éviter les erreurs de sérialisation Hibernate
     */
    @PatchMapping("/{id}/retourner")
    public ResponseEntity<BorrowingResponse> markAsReturned(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate dateRetourActual) {
        
        // Récupérer la possession avant retour
        Possession possession = possessionService.markAsReturned(id);
        
        // Si dateRetourActual n'est pas fournie, utiliser aujourd'hui
        LocalDate actualDate = dateRetourActual != null ? dateRetourActual : LocalDate.now();
        
        // VÉRIFIER PÉNALITÉ: Si retour en retard, créer automatiquement une pénalité
        try {
            penaltyService.createPenaltyIfLate(id, actualDate);
        } catch (Exception e) {
            // Log but don't fail: penalty creation error shouldn't block return
            System.err.println("Penalty creation failed for possession " + id + ": " + e.getMessage());
        }
        
        return ResponseEntity.ok(toBorrowingResponse(possession));
    }
    
    /**
     * POST /api/possessions/borrow
     * Emprunter un livre (utilisateur authentifié)
     * Body: { "livreId": 1 }
     * Response: BorrowingResponse avec tous les détails
     */
    @PostMapping("/borrow")
    public ResponseEntity<BorrowingResponse> borrow(@Valid @RequestBody BorrowRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        // VÉRIFIER BLOCAGE: Impossible d'emprunter si penalties > 100€
        if (!penaltyService.canBorrow(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .build();  // Blocage: trop de pénalités
        }
        
        Possession possession = possessionService.borrowBook(request.getLivreId(), user.getId());
        
        return ResponseEntity.ok(toBorrowingResponse(possession));
    }
    
    /**
     * Convertir une Possession en BorrowingResponse enrichie
     */
    private BorrowingResponse toBorrowingResponse(Possession possession) {
        LocalDate dateRetour = possession.getDateRetour();
        String statut = (dateRetour == null) ? "EN_COURS" : "RETOURNE";
        LocalDate dateRetourPrevu = possession.getDateEmprunt().plusDays(14);
        LocalDate dateRetourEffectif = dateRetour;
        
        return new BorrowingResponse(
            possession.getId(),
            statut,
            possession.getDateEmprunt(),
            dateRetourPrevu,
            dateRetourEffectif,
            possession.getLivre().getId(),
            possession.getLivre().getTitre(),
            possession.getLivre().getAuteur().getNom(),
            possession.getLivre().getGenre().getLibelle(),
            possession.getLivre().getIsbn(),
            possession.getLivre().getDatePublication() != null ? possession.getLivre().getDatePublication().getYear() : null,
            possession.getUser().getId()
        );
    }
}
