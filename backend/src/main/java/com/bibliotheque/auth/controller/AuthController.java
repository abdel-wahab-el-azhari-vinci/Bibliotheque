package com.bibliotheque.auth.controller;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller pour gérer l'authentification.
 * Route : /api/auth/
 *
 * Responsabilités :
 * - Recevoir les requêtes HTTP
 * - Valider les DTOs
 * - Appeler le Service
 * - Retourner les réponses HTTP
 *
 * IMPORTANT : AUCUNE logique métier ici !
 */
@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint de login
     *
     * @param loginRequest contient email et password
     * @return 200 OK avec LoginResponse (token + user infos)
     * @throws IllegalArgumentException si credentials invalides (transformée en 400)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Requête de login reçue pour: {}", loginRequest.getEmail());

        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Erreur de login: {}", e.getMessage());
            // Note : On relance l'exception, qui sera traitée par GlobalExceptionHandler
            throw e;
        }
    }
}
