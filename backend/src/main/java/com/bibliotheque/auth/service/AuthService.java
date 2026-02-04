package com.bibliotheque.auth.service;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.util.JwtUtil;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service d'authentification - LOGIQUE MÉTIER
 * Responsable de :
 * - Valider les credentials (email + password)
 * - Générer les JWT tokens
 * - Construire les réponses
 *
 * AUCUNE logique HTTP ici - c'est pour le Controller
 */
@Service
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Login - valide email et password, retourne un token JWT
     *
     * @param loginRequest contient email et password
     * @return LoginResponse avec token et infos utilisateur
     * @throws IllegalArgumentException si credentials invalides
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest loginRequest) {
        log.debug("Tentative de login pour: {}", loginRequest.getEmail());

        // Étape 1 : Chercher l'utilisateur par email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("Utilisateur non trouvé: {}", loginRequest.getEmail());
                    return new IllegalArgumentException("Email ou mot de passe incorrect");
                });

        // Étape 2 : Vérifier le mot de passe avec BCrypt
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Mot de passe incorrect pour: {}", loginRequest.getEmail());
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        // Étape 3 : Vérifier que l'utilisateur est actif
        if (!"ACTIF".equals(user.getStatus().getName())) {
            log.warn("Utilisateur inactif: {} (statut: {})", loginRequest.getEmail(), user.getStatus().getName());
            throw new IllegalArgumentException("Compte désactivé ou suspendu");
        }

        // Étape 4 : Générer le JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getName());

        // Étape 5 : Construire et retourner la réponse
        LoginResponse response = LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole().getName())
                .status(user.getStatus().getName())
                .token(token)
                .build();

        log.info("Login réussi pour: {}", loginRequest.getEmail());
        return response;
    }
}
