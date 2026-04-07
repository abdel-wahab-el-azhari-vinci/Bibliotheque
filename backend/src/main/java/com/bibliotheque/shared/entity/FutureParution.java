package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Entity FutureParution - Livres à paraître
 * Référence les ouvrages qui seront prochainement disponibles
 */
@Entity
@Table(name = "future_parutions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FutureParution {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "titre", nullable = false)
    private String titre;
    
    @Column(name = "date_sortie")
    private LocalDate dateSortie;
    
    @Column(name = "resume", columnDefinition = "LONGTEXT")
    private String resume;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id")
    private Auteur auteur;
}
