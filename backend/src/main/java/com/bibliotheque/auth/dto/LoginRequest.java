package com.bibliotheque.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO reçu du frontend pour effectuer un login.
 * VALIDATION : les champs sont vérifiés au niveau du Controller avec @Valid.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    /**
     * Email unique de l'utilisateur
     */
    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être au format valide")
    private String email;

    /**
     * Mot de passe en clair (HTTPS obligatoire)
     * Vérification au frontend : min 6 caractères
     */
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String password;
}
