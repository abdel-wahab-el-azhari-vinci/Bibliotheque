package com.bibliotheque.auth.controller;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.dto.RegisterRequest;
import com.bibliotheque.auth.dto.RegisterResponse;
import com.bibliotheque.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller pour gérer l'authentification (Login & Register)
 * Route : /api/auth/
 *
 * Responsabilités :
 * - Recevoir les requêtes HTTP (Request)
 * - Valider les DTOs avec @Valid + GlobalExceptionHandler
 * - Appeler le Service pour la logique métier
 * - Retourner les réponses HTTP (Response)
 *
 * RÈGLE STRICTE : AUCUNE logique métier ici !
 * RÈGLE STRICTE : Controllers ne font que du HTTP
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
     * Endpoint de LOGIN
     *
     * HTTP : POST /api/auth/login
     * 
     * @param loginRequest validé via @Valid
     *        - email : requis, format email valide
     *        - password : requis, min 6 caractères
     *
     * @return 200 OK avec LoginResponse (id, email, nom, prenom, role, token, status)
     *         400 Bad Request si validation échoue (via GlobalExceptionHandler)
     *         401 Unauthorized si credentials invalides (via GlobalExceptionHandler)
     *
     * @throws IllegalArgumentException transformée en 401 par GlobalExceptionHandler
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("��� Requête de LOGIN reçue pour: {}", loginRequest.getEmail());

        try {
            LoginResponse response = authService.login(loginRequest);
            log.info("✅ Login réussi pour: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("❌ Erreur de login: {}", e.getMessage());
            // Note : L'exception est relancée et traitée par GlobalExceptionHandler
            throw e;
        }
    }

    /**
     * Endpoint de REGISTER (Inscription)
     *
     * HTTP : POST /api/auth/register
     *
     * @param registerRequest validé via @Valid
     *        - email : requis, format email valide, unique
     *        - password : requis, min 6 caractères
     *        - nom : requis, 2-100 caractères
     *        - prenom : requis, 2-100 caractères
     *
     * @return 201 Created avec RegisterResponse (id, email, nom, prenom, role, token, status, message)
     *         400 Bad Request si validation échoue (via GlobalExceptionHandler)
     *         409 Conflict si email déjà utilisé (via GlobalExceptionHandler)
     *
     * Comportement :
     * - Crée un nouvel utilisateur avec rôle "USER" et statut "ACTIF"
     * - Hash le mot de passe avec BCrypt (jamais stocké en clair)
     * - Génère un JWT token (login automatique)
     * - Retourne le token + infos pour que le frontend reste authentifié
     *
     * @throws IllegalArgumentException transformée en 400/409 par GlobalExceptionHandler
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("��� Requête de REGISTER reçue pour: {}", registerRequest.getEmail());

        try {
            RegisterResponse response = authService.register(registerRequest);
            log.info("Register réussi - Nouvel utilisateur: {} (ID: {})", 
                    registerRequest.getEmail(), response.getId());
            
            // 201 Created : l'utilisateur a été créé avec succès
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn(" Erreur de register: {}", e.getMessage());
            // Note : L'exception est relancée et traitée par GlobalExceptionHandler
            throw e;
        }
    }
}
