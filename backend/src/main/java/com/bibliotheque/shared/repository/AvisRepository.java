package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Avis - Avis des utilisateurs sur les livres
 */
@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {
    
    /**
     * Tous les avis sur un livre
     */
    List<Avis> findByLivreId(Long livreId);
    
    /**
     * Tous les avis d'un utilisateur
     */
    List<Avis> findByUserId(Long userId);
}
