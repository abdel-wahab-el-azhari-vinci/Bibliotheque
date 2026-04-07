package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Genre - Genres de livres
 * Permet les filtres par genre
 */
@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    
    /**
     * Genres d'une catégorie
     */
    List<Genre> findByCategorie_Id(Long categorieId);
    
    /**
     * Rechercher par libellé
     */
    List<Genre> findByLibelleContainingIgnoreCase(String libelle);
}
