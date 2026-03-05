package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Livre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour Livre - Accès BD aux ouvrages
 * Fonctionnalités:
 * - GET all livres
 * - Search by titre, auteur, genre
 * - GET by ISBN
 */
@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    
    /**
     * Rechercher par ISBN
     */
    Optional<Livre> findByIsbn(String isbn);
    
    /**
     * Rechercher par titre (case-insensitive)
     */
    List<Livre> findByTitreContainingIgnoreCase(String titre);
    
    /**
     * Rechercher par auteur
     */
    @Query("SELECT l FROM Livre l WHERE LOWER(l.auteur.nom) LIKE LOWER(CONCAT('%', :auteur, '%'))")
    List<Livre> findByAuteur(@Param("auteur") String auteur);
    
    /**
     * Rechercher par genre
     */
    List<Livre> findByGenreId(Long genreId);
    
    /**
     * Rechercher par langue
     */
    List<Livre> findByLangueId(Long langueId);
    
    /**
     * Recherche complexe: titre OU auteur OU genre
     */
    @Query("SELECT l FROM Livre l WHERE " +
           "LOWER(l.titre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.auteur.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.genre.libelle) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Livre> searchLivres(@Param("search") String search);
}
