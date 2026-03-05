package com.bibliotheque.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.bibliotheque.shared.entity.*;

/**
 * Entity User - Utilisateur de l'application Terra Sana
 * Conforme au schéma Terra Sana avec tous les champs géographiques
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
     * Adresse postale
     */
    @Column(name = "rue", length = 255)
    private String rue;

    /**
     * Rôle de l'utilisateur (ADMIN, USER, LIBRARIAN)
     * Relation Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * Statut de l'utilisateur (ACTIF, INACTIF, SUSPENDU)
     * Relation Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    /**
     * Code postal de l'utilisateur
     * Pour gérer sa localisation précise
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_postal_id")
    private CodePostal codePostal;

    /**
     * Commune de l'utilisateur
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commune_id")
    private Commune commune;

    /**
     * Pays de l'utilisateur
     * Important pour identifier son origine/destination géographique
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pays_id")
    private Pays pays;

    /**
     * Langue préférée de l'utilisateur
     * Pour l'interface et les préférences de contenu
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "langue_id")
    private Langue langue;

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
