package com.bibliotheque.user.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity représentant un rôle utilisateur (ADMIN, USER, LIBRARIAN, etc.)
 * Utilisée pour gérer les permissions et responsabilités des utilisateurs.
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nom du rôle : ADMIN, USER, LIBRARIAN
     * Format : MAJUSCULES sans espaces, préfixé par ROLE_
     */
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /**
     * Description lisible du rôle
     */
    @Column(nullable = true, length = 255)
    private String description;

    @Override
    public String toString() {
        return name;
    }
}
