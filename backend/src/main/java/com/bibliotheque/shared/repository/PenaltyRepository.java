package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
    
    // Récupérer toutes les pénalités (tous utilisateurs), les plus récentes en premier
    List<Penalty> findAllByOrderByDateCreationDesc();

    // Récupérer toutes les pénalités d'un utilisateur
    List<Penalty> findByUserId(Long userId);
    
    // Récupérer les pénalités en attente de paiement pour un utilisateur
    List<Penalty> findByUserIdAndStatus(Long userId, Penalty.PenaltyStatus status);
    
    // Récupérer les pénalités en attente de paiement
    List<Penalty> findByStatus(Penalty.PenaltyStatus status);
    
    // Récupérer les pénalités pour un livre
    List<Penalty> findByLivreId(Long livreId);
    
    // Récupérer les pénalités pour une possession
    Optional<Penalty> findByPossessionId(Long possessionId);
    
    // Vérifier s'il y a une pénalité en attente pour un utilisateur
    @Query("SELECT COUNT(p) FROM Penalty p WHERE p.user.id = :userId AND p.status = 'PENDING'")
    Long countPendingPenaltiesForUser(@Param("userId") Long userId);
    
    // Montant total des pénalités en attente pour un utilisateur
    @Query("SELECT COALESCE(SUM(p.montantTotal), 0) FROM Penalty p WHERE p.user.id = :userId AND p.status = 'PENDING'")
    java.math.BigDecimal getTotalPendingAmountForUser(@Param("userId") Long userId);
}
