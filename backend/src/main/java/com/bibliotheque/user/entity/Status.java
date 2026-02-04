package com.bibliotheque.user.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity représentant un statut utilisateur (ACTIF, INACTIF, SUSPENDU, etc.)
 * Utilisée pour contrôler l'accès des utilisateurs à l'application.
 */
@Entity
@Table(name = "statuses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nom du statut : ACTIF, INACTIF, SUSPENDU
     * Format : MAJUSCULES sans espaces
     */
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /**
     * Description lisible du statut
     */
    @Column(nullable = true, length = 255)
    private String description;

    @Override
    public String toString() {
        return name;
    }
}
