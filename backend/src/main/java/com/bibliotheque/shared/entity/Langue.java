package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity Langue - Référentiel des langues
 * Représente une langue disponible dans le catalogue
 */
@Entity
@Table(name = "langue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Langue {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String libelle;
    
    @Column(name = "code_iso", length = 10)
    private String codeIso;
}
