package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.repository.PenaltyRepository;
import com.bibliotheque.shared.repository.PossessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service PenaltyService
 * Gestion des amendes pour retard de retour
 * 
 * LOGIQUE:
 * 1. Quand un livre est retourné en retard
 * 2. Calculer les jours de retard
 * 3. Créer une Penalty avec montant = jours * tarif journalier
 * 4. Mettre le status à PENDING (en attente de paiement)
 */
@Service
@Transactional
@RequiredArgsConstructor
public class PenaltyService {
    
    private final PenaltyRepository penaltyRepository;
    private final PossessionRepository possessionRepository;
    
    // Tarif par défaut: 0.50€ par jour de retard
    private static final BigDecimal DEFAULT_DAILY_RATE = new BigDecimal("0.50");
    
    // Délai de grâce: 0 jour (pas de tolérance, retard immédiatement pénalisé)
    private static final long GRACE_PERIOD_DAYS = 0;
    
    /**
     * APPELÉ AUTOMATIQUEMENT quand un livre est retourné
     * À intégrer dans PossessionController.returnBook()
     */
    public Penalty createPenaltyIfLate(Long possessionId, LocalDate actualReturnDate) {
        Possession possession = possessionRepository.findById(possessionId)
            .orElseThrow(() -> new IllegalArgumentException("Possession not found"));
        
        // Vérifier s'il y a déjà une pénalité pour cette possession
        if (penaltyRepository.findByPossessionId(possessionId).isPresent()) {
            throw new IllegalArgumentException("Penalty already exists for this possession");
        }
        
        // Calculer les jours de retard
        LocalDate expectedReturnDate = possession.getDateEmprunt().plusDays(14); // 14 jours par défaut
        long daysLate = ChronoUnit.DAYS.between(expectedReturnDate, actualReturnDate);
        
        // S'il y a du retard (après période de grâce)
        if (daysLate > GRACE_PERIOD_DAYS) {
            Penalty penalty = new Penalty();
            penalty.setUser(possession.getUser());
            penalty.setLivre(possession.getLivre());
            penalty.setPossession(possession);
            penalty.setDateCreation(LocalDateTime.now());
            penalty.setDateExpirationEmprunt(expectedReturnDate);
            penalty.setDateRetourActual(actualReturnDate);
            penalty.setNombreJoursRetard((int) daysLate);
            penalty.setTarifJournalier(DEFAULT_DAILY_RATE);
            
            // Montant total = jours * tarif
            BigDecimal montantTotal = DEFAULT_DAILY_RATE.multiply(BigDecimal.valueOf(daysLate));
            penalty.setMontantTotal(montantTotal);
            penalty.setStatus(Penalty.PenaltyStatus.PENDING);
            
            return penaltyRepository.save(penalty);
        }
        
        return null; // Aucune pénalité si retour à temps
    }
    
    /**
     * Récupérer toutes les pénalités, tous utilisateurs confondus (admin)
     */
    public List<Penalty> getAllPenalties() {
        return penaltyRepository.findAllByOrderByDateCreationDesc();
    }

    /**
     * Récupérer toutes les pénalités d'un utilisateur
     */
    public List<Penalty> getUserPenalties(Long userId) {
        return penaltyRepository.findByUserId(userId);
    }
    
    /**
     * Récupérer les pénalités en attente de paiement
     */
    public List<Penalty> getUserPendingPenalties(Long userId) {
        return penaltyRepository.findByUserIdAndStatus(userId, Penalty.PenaltyStatus.PENDING);
    }
    
    /**
     * Montant total des pénalités en attente
     */
    public BigDecimal getUserTotalPendingAmount(Long userId) {
        return penaltyRepository.getTotalPendingAmountForUser(userId);
    }
    
    /**
     * Marquer une pénalité comme payée
     */
    public Penalty payPenalty(Long penaltyId) {
        Penalty penalty = penaltyRepository.findById(penaltyId)
            .orElseThrow(() -> new IllegalArgumentException("Penalty not found"));
        
        if (!penalty.getStatus().equals(Penalty.PenaltyStatus.PENDING)) {
            throw new IllegalArgumentException("Only PENDING penalties can be paid");
        }
        
        penalty.setStatus(Penalty.PenaltyStatus.PAID);
        penalty.setDatePaiement(LocalDateTime.now());
        return penaltyRepository.save(penalty);
    }
    
    /**
     * Annuler une pénalité (admin seulement)
     */
    public Penalty cancelPenalty(Long penaltyId, String reason) {
        Penalty penalty = penaltyRepository.findById(penaltyId)
            .orElseThrow(() -> new IllegalArgumentException("Penalty not found"));
        
        penalty.setStatus(Penalty.PenaltyStatus.CANCELLED);
        penalty.setNotes(reason);
        return penaltyRepository.save(penalty);
    }
    
    /**
     * Faire grâce à une pénalité (admin seulement)
     */
    public Penalty waivePenalty(Long penaltyId, String reason) {
        Penalty penalty = penaltyRepository.findById(penaltyId)
            .orElseThrow(() -> new IllegalArgumentException("Penalty not found"));
        
        penalty.setStatus(Penalty.PenaltyStatus.WAIVED);
        penalty.setNotes(reason);
        return penaltyRepository.save(penalty);
    }
    
    /**
     * Obtenir les détails d'une pénalité
     */
    public Penalty getPenaltyDetails(Long penaltyId) {
        return penaltyRepository.findById(penaltyId)
            .orElseThrow(() -> new IllegalArgumentException("Penalty not found"));
    }
    
    /**
     * Vérifier si un utilisateur a des pénalités impayées
     * → Peut bloquer les emprunts
     */
    public boolean hasPendingPenalties(Long userId) {
        return penaltyRepository.countPendingPenaltiesForUser(userId) > 0;
    }
    
    /**
     * Bloquer les emprunts si trop de pénalités
     * Configuration: Max 100€ de pénalités en attente
     */
    public boolean canBorrow(Long userId) {
        BigDecimal totalPending = getUserTotalPendingAmount(userId);
        BigDecimal maxAllowed = new BigDecimal("100.00");
        return totalPending.compareTo(maxAllowed) <= 0;
    }
}
