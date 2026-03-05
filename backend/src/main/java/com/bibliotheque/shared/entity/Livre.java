package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Entity Livre - Cœur du référentiel de Terra Sana
 * Représente un ouvrage
 * Lié à un Auteur, Genre et Langue
 * Peut avoir plusieurs Possessions (stock), Avis et Lectures
 */
@Entity
@Table(name = "livre")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "titre", nullable = false)
    private String titre;
    
    @Column(name = "isbn", length = 20, unique = true)
    private String isbn;
    
    @Column(name = "date_publication")
    private LocalDate datePublication;
    
    @Column(name = "resume", columnDefinition = "LONGTEXT")
    private String resume;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id")
    private Auteur auteur;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "langue_id")
    private Langue langue;
}
