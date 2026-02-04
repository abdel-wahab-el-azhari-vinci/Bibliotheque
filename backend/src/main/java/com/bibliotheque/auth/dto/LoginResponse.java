package com.bibliotheque.auth.dto;

import lombok.*;

/**
 * DTO retourné au frontend après un login réussi.
 * IMPORTANT : Le password n'est JAMAIS inclus dans cette réponse.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    /**
     * ID de l'utilisateur
     */
    private Long id;

    /**
     * Email de l'utilisateur
     */
    private String email;

    /**
     * Nom de famille
     */
    private String nom;

    /**
     * Prénom de l'utilisateur
     */
    private String prenom;

    /**
     * Rôle de l'utilisateur (utilisé par le frontend pour permissions)
     */
    private String role;

    /**
     * JWT Token à stocker côté frontend et inclure dans les futurs appels
     * Format : Bearer <token>
     */
    private String token;

    /**
     * Statut de l'utilisateur (pour vérifier si compte actif)
     */
    private String status;
}
