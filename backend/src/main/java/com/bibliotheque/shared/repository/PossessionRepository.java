package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Possession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Possession - TABLE PIVOT CRITIQUE
 * Gère le stock et les mouvements des livres
 * 
 * Logique investaire:
 * - dateRetour = NULL → En stock (disponible)
 * - dateRetour != NULL → Sorti (prêté, donné)
 */
@Repository
public interface PossessionRepository extends JpaRepository<Possession, Long> {
    
    /**
     * Tous les livres ACTUELLEMENT EN STOCK
     * (dateRetour = NULL)
     */
    @Query("SELECT p FROM Possession p WHERE p.dateRetour IS NULL")
    List<Possession> findAllEnStock();
    
    /**
     * Tous les livres SORTIS / EMPRUNTES
     * (dateRetour != NULL)
     */
    @Query("SELECT p FROM Possession p WHERE p.dateRetour IS NOT NULL")
    List<Possession> findAllSortis();
    
    /**
     * Livres d'un utilisateur spécifique EN STOCK
     */
    @Query("SELECT p FROM Possession p WHERE p.user.id = :userId AND p.dateRetour IS NULL")
    List<Possession> findByUserIdEnStock(@Param("userId") Long userId);
    
    /**
     * Livres d'un utilisateur spécifique SORTIS
     */
    @Query("SELECT p FROM Possession p WHERE p.user.id = :userId AND p.dateRetour IS NOT NULL")
    List<Possession> findByUserIdSortis(@Param("userId") Long userId);
    
    /**
     * Toutes les possessions d'un livre
     */
    List<Possession> findByLivreId(Long livreId);
    
    /**
     * Vérifier si un livre est EN STOCK
     */
    @Query("SELECT COUNT(p) > 0 FROM Possession p " +
           "WHERE p.livre.id = :livreId AND p.dateRetour IS NULL")
    boolean isLivreEnStock(@Param("livreId") Long livreId);
    
    /**
     * Compter les exemplaires EN STOCK d'un livre
     */
    @Query("SELECT COUNT(p) FROM Possession p " +
           "WHERE p.livre.id = :livreId AND p.dateRetour IS NULL")
    int countEnStock(@Param("livreId") Long livreId);
}
