package com.bibliotheque.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity représentant un utilisateur de l'application.
 * IMPORTANT : Le mot de passe est TOUJOURS stocké hashé (jamais en clair).
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email de l'utilisateur - unique et utilisé pour login
     */
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * Mot de passe HASHÉ avec BCrypt
     * JAMAIS stocké en clair, JAMAIS retourné au frontend
     */
    @Column(nullable = false)
    private String password;

    /**
     * Nom de famille
     */
    @Column(nullable = false, length = 100)
    private String nom;

    /**
     * Prénom de l'utilisateur
     */
    @Column(nullable = false, length = 100)
    private String prenom;

    /**
     * Rôle de l'utilisateur (ADMIN, USER, LIBRARIAN)
     * Relation Many-to-One
     */
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * Statut de l'utilisateur (ACTIF, INACTIF, SUSPENDU)
     * Relation Many-to-One
     */
    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    /**
     * Date d'inscription du compte
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription;

    /**
     * Date de dernière connexion
     */
    @Column(nullable = true)
    private LocalDateTime dateConnexion;

    /**
     * Initialiser la date d'inscription avant sauvegarde
     */
    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
    }
}
