package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity Pays - Référentiel des pays
 * Représente un pays dans lecontexte de Terra Sana
 * Utilisé pour géolocaliser les auteurs et utilisateurs
 */
@Entity
@Table(name = "pays")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pays {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nom_pays", nullable = false, unique = true)
    private String nomPays;
}
