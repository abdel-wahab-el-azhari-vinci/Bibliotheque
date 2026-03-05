package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Auteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Auteur
 * Permet de gérer les auteurs du catalogue
 */
@Repository
public interface AuteurRepository extends JpaRepository<Auteur, Long> {
    
    /**
     * Rechercher par nom (case-insensitive)
     */
    List<Auteur> findByNomContainingIgnoreCase(String nom);
    
    /**
     * Vérifier si un auteur existe par nom
     */
    boolean existsByNom(String nom);
}
