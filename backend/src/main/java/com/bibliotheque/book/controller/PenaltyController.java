package com.bibliotheque.book.controller;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.service.PenaltyService;
import com.bibliotheque.book.dto.PenaltyDTO;
import com.bibliotheque.book.dto.PayPenaltyRequest;
import com.bibliotheque.book.dto.UserPenaltySummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller pour les pénalités
 * Endpoints: /api/penalties/*
 */
@RestController
@RequestMapping("/api/penalties")
@RequiredArgsConstructor
public class PenaltyController {
    
    private final PenaltyService penaltyService;
    
    /**
     * GET: Récupérer toutes les pénalités de l'utilisateur connecté
     * GET /api/penalties/my-penalties
     */
    @GetMapping("/my-penalties")
    public ResponseEntity<List<PenaltyDTO>> getMyPenalties(
            @RequestHeader("Authorization") String token) {
        // TODO: Extraire userId du token JWT
        Long userId = 1L;  // Pour le test
        
        List<Penalty> penalties = penaltyService.getUserPenalties(userId);
        List<PenaltyDTO> dtos = penalties.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * GET: Récupérer le résumé des pénalités (montant total, count, etc)
     * GET /api/penalties/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<UserPenaltySummaryDTO> getPenaltySummary(
            @RequestHeader("Authorization") String token) {
        // TODO: Extraire userId du token JWT
        Long userId = 1L;  // Pour le test
        
        long pendingCount = penaltyService.getUserPendingPenalties(userId).size();
        BigDecimal totalAmount = penaltyService.getUserTotalPendingAmount(userId);
        boolean canBorrow = penaltyService.canBorrow(userId);
        
        UserPenaltySummaryDTO summary = new UserPenaltySummaryDTO();
        summary.setUserId(userId);
        summary.setPendingPenaltiesCount(pendingCount);
        summary.setTotalPendingAmount(totalAmount);
        summary.setCanBorrow(canBorrow);
        
        return ResponseEntity.ok(summary);
    }
    
    /**
     * GET: Récupérer les pénalités en attente de paiement
     * GET /api/penalties/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<PenaltyDTO>> getPendingPenalties(
            @RequestHeader("Authorization") String token) {
        // TODO: Extraire userId du token JWT
        Long userId = 1L;  // Pour le test
        
        List<Penalty> penalties = penaltyService.getUserPendingPenalties(userId);
        List<PenaltyDTO> dtos = penalties.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * GET: Détails d'une pénalité
     * GET /api/penalties/{penaltyId}
     */
    @GetMapping("/{penaltyId}")
    public ResponseEntity<PenaltyDTO> getPenaltyDetails(@PathVariable Long penaltyId) {
        Penalty penalty = penaltyService.getPenaltyDetails(penaltyId);
        return ResponseEntity.ok(convertToDTO(penalty));
    }
    
    /**
     * POST: Payer une pénalité
     * POST /api/penalties/{penaltyId}/pay
     */
    @PostMapping("/{penaltyId}/pay")
    public ResponseEntity<PenaltyDTO> payPenalty(
            @PathVariable Long penaltyId,
            @RequestBody PayPenaltyRequest request) {
        try {
            Penalty penalty = penaltyService.payPenalty(penaltyId);
            return ResponseEntity.ok(convertToDTO(penalty));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * POST: Annuler une pénalité (Admin only)
     * POST /api/penalties/{penaltyId}/cancel
     */
    @PostMapping("/{penaltyId}/cancel")
    public ResponseEntity<PenaltyDTO> cancelPenalty(
            @PathVariable Long penaltyId,
            @RequestParam String reason) {
        try {
            Penalty penalty = penaltyService.cancelPenalty(penaltyId, reason);
            return ResponseEntity.ok(convertToDTO(penalty));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * POST: Faire grâce à une pénalité (Admin only)
     * POST /api/penalties/{penaltyId}/waive
     */
    @PostMapping("/{penaltyId}/waive")
    public ResponseEntity<PenaltyDTO> waivePenalty(
            @PathVariable Long penaltyId,
            @RequestParam String reason) {
        try {
            Penalty penalty = penaltyService.waivePenalty(penaltyId, reason);
            return ResponseEntity.ok(convertToDTO(penalty));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Convertir Penalty Entity → PenaltyDTO
     */
    private PenaltyDTO convertToDTO(Penalty penalty) {
        PenaltyDTO dto = new PenaltyDTO();
        dto.setId(penalty.getId());
        dto.setUserId(penalty.getUser().getId());
        dto.setUserName(penalty.getUser().getEmail());  // Ou prénom/nom
        dto.setLivreId(penalty.getLivre().getId());
        dto.setTitreLivre(penalty.getLivre().getTitre());
        dto.setPossessionId(penalty.getPossession().getId());
        dto.setDateCreation(penalty.getDateCreation());
        dto.setDateExpirationEmprunt(penalty.getDateExpirationEmprunt());
        dto.setDateRetourActual(penalty.getDateRetourActual());
        dto.setDatePaiement(penalty.getDatePaiement());
        dto.setNombreJoursRetard(penalty.getNombreJoursRetard());
        dto.setTarifJournalier(penalty.getTarifJournalier());
        dto.setMontantTotal(penalty.getMontantTotal());
        dto.setStatus(penalty.getStatus().toString());
        dto.setNotes(penalty.getNotes());
        return dto;
    }
}
