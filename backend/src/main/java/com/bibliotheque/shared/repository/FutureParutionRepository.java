package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.FutureParution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour FutureParution - Livres à paraître
 */
@Repository
public interface FutureParutionRepository extends JpaRepository<FutureParution, Long> {
    
    /**
     * Futures parutions d'un auteur
     */
    List<FutureParution> findByAuteurId(Long auteurId);
}
