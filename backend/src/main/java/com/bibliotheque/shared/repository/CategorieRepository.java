package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour Catégorie - Catégories de livres
 */
@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
}
