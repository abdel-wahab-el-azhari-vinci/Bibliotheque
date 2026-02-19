package com.bibliotheque.auth.dto;

import lombok.*;

/**
 * DTO retourné au frontend après une inscription réussie.
 * 
 * Responsabilité :
 * - Envoyer les infos nécessaires au frontend
 * - Inclure le JWT token pour authenticated calls
 * 
 * IMPORTANT : 
 * - Le password n'est JAMAIS inclus
 * - Le token doit être stocké par le frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponse {

    /**
     * ID de l'utilisateur nouvellement créé
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
     * Rôle par défaut (toujours "USER" au register)
     */
    private String role;

    /**
     * JWT Token à stocker côté frontend et inclure dans les futurs appels
     * Format : Bearer <token>
     * 
     * Permet au frontend de rester authentifié après inscription
     */
    private String token;

    /**
     * Statut de l'utilisateur (toujours "ACTIF" au register)
     */
    private String status;

    /**
     * Message de confirmation pour le frontend
     */
    private String message;
}
