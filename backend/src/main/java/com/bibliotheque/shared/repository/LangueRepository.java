package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Langue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour Langue - Langues disponibles
 */
@Repository
public interface LangueRepository extends JpaRepository<Langue, Long> {
    
    /**
     * Trouver par code ISO (fr, en, nl, etc.)
     */
    Optional<Langue> findByCodeIso(String codeIso);
}
