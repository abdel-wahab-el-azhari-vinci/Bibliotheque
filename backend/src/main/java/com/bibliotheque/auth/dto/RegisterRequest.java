package com.bibliotheque.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO reçu du frontend pour effectuer une inscription.
 * 
 * Responsabilité :
 * - Valider les données entrantes avec annotations Jakarta
 * - Servir de contrat entre frontend et backend
 * 
 * IMPORTANT : VALIDATION faite au niveau du Controller avec @Valid
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    /**
     * Email unique de l'utilisateur
     * Vérification :
     * - Format email valide
     * - Unicité en BD (contrôlée par AuthService)
     */
    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être au format valide")
    private String email;

    /**
     * Mot de passe en clair (HTTPS obligatoire)
     * Sera hashé avec BCrypt avant stockage en BD
     * - Min 6 caractères (frontend + backend)
     */
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String password;

    /**
     * Nom de famille de l'utilisateur
     * - Requis et entre 2 et 100 caractères
     */
    @NotBlank(message = "Le nom est requis")
    @Size(min = 2, max = 100, message = "Le nom doit avoir entre 2 et 100 caractères")
    private String nom;

    /**
     * Prénom de l'utilisateur
     * - Requis et entre 2 et 100 caractères
     */
    @NotBlank(message = "Le prénom est requis")
    @Size(min = 2, max = 100, message = "Le prénom doit avoir entre 2 et 100 caractères")
    private String prenom;
}
