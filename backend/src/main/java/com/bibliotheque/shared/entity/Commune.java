package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity Commune - Référentiel des communes
 * Utilisé pour la géolocalisation des utilisateurs
 */
@Entity
@Table(name = "commune")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commune {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom_commune", nullable = false)
    private String nomCommune;
}
