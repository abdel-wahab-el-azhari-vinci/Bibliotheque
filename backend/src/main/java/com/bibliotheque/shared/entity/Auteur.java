package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity Auteur - Auteurs de livres
 * Représente un auteur avec ses informations biographiques
 * Peut écrire plusieurs livres et appartenir à plusieurs genres
 */
@Entity
@Table(name = "auteur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auteur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom", nullable = false)
    private String nom;
    
    @Column(name = "biographie", columnDefinition = "LONGTEXT")
    private String biographie;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    @Column(name = "date_deces")
    private LocalDate dateDeces;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pays_id")
    private Pays pays;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "langue_id")
    private Langue langue;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "auteur_genre",
        joinColumns = @JoinColumn(name = "auteur_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();
}
