package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Pays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour Pays - Référentiel géographique
 */
@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {
    
    /**
     * Trouver par nom
     */
    Optional<Pays> findByNomPaysIgnoreCase(String nomPays);
}
