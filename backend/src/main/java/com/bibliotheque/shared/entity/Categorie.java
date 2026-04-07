package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity Catégorie - Référentiel des catégories de livres
 * Exemple: Fiction, Science-Fiction, Documentaire, etc.
 */
@Entity
@Table(name = "categorie")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categorie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "libelle", nullable = false, unique = true)
    private String libelle;
}
