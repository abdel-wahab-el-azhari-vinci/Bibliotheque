package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Souhait;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Souhait - Liste de souhaits des utilisateurs
 */
@Repository
public interface SouhaitsRepository extends JpaRepository<Souhait, Long> {
    
    /**
     * Tous les souhaits d'un utilisateur
     */
    List<Souhait> findByUserId(Long userId);
    
    /**
     * Tous les utilisateurs qui souhaitent un livre
     */
    List<Souhait> findByLivreId(Long livreId);
}
