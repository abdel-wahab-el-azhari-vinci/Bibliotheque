package com.bibliotheque.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO LoginResponse - Output après authentification réussie
 * Contient le token JWT à utiliser pour les requêtes suivantes
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    
    private String token;
    private String refreshToken;
    private Long userId;
    private String email;
    private String nom;
    private String prenom;
    private String role;
    private Long expiresIn;  // Durée de vie du token en secondes
}
