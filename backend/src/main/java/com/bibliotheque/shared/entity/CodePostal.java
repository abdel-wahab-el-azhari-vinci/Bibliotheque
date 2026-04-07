package com.bibliotheque.shared.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity CodePostal - Référentiel des codes postaux
 * Utilisé pour la localisation complète des utilisateurs
 */
@Entity
@Table(name = "code_postal")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodePostal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "code_postal", nullable = false, unique = true, length = 20)
    private String codePostal;
}
