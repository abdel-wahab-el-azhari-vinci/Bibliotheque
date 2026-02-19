package com.bibliotheque.auth.service;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.dto.RegisterRequest;
import com.bibliotheque.auth.dto.RegisterResponse;
import com.bibliotheque.auth.util.JwtUtil;
import com.bibliotheque.user.entity.Role;
import com.bibliotheque.user.entity.Status;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.RoleRepository;
import com.bibliotheque.user.repository.StatusRepository;
import com.bibliotheque.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service d'authentification - LOGIQUE MÉTIER
 * 
 * Responsable de :
 * - Authentifier les utilisateurs (LOGIN)
 * - Créer de nouveaux comptes (REGISTER)
 * - Générer les JWT tokens
 * - Valider les credentials
 *
 * AUCUNE logique HTTP ici - c'est pour le Controller
 * AUCUN accès Direct à la BD - c'est pour les Repositories
 */
@Service
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StatusRepository statusRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            StatusRepository statusRepository,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.statusRepository = statusRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * LOGIN - Authentifie un utilisateur existant
     *
     * Flux :
     * 1. Cherche l'utilisateur par email
     * 2. Vérifie le mot de passe avec BCrypt
     * 3. Vérifie que le compte est actif
     * 4. Génère un JWT token
     * 5. Retourne les infos utilisateur + token
     *
     * @param loginRequest contient email et password
     * @return LoginResponse avec token et infos utilisateur
     * @throws IllegalArgumentException si credentials invalides ou compte inactif
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

    /**
     * REGISTER - Crée un nouveau compte utilisateur
     *
     * Flux :
     * 1. Valide que l'email n'existe pas déjà
     * 2. Hash le mot de passe avec BCrypt
     * 3. Récupère le rôle par défaut (USER)
     * 4. Récupère le statut par défaut (ACTIF)
     * 5. Crée et sauvegarde le nouvel utilisateur
     * 6. Génère un JWT token (login automatique)
     * 7. Retourne les infos + token
     *
     * Règles importantes (Schéma BD) :
     * - email : UNIQUE, doit être vérifié
     * - role_id : TOUJOURS 2 (USER) - pas l'utilisateur qui décide
     * - status_id : TOUJOURS 1 (ACTIF) - créé actif par défaut
     * - password : JAMAIS stocké en clair - hashé avec BCrypt
     *
     * @param registerRequest contient email, password, nom, prenom
     * @return RegisterResponse avec token et infos utilisateur
     * @throws IllegalArgumentException si email déjà utilisé ou rôle/statut introuvable
     */
    @Transactional
    public RegisterResponse register(RegisterRequest registerRequest) {
        log.debug("Tentative de création de compte pour: {}", registerRequest.getEmail());

        // Étape 1 : Vérifier que l'email n'existe pas déjà (UNIQUE constraint)
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            log.warn("Email déjà utilisé: {}", registerRequest.getEmail());
            throw new IllegalArgumentException("Cet email est déjà utilisé. Veuillez en choisir un autre ou vous connecter.");
        }

        // Étape 2 : Hash le mot de passe avec BCrypt
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        log.debug("Mot de passe hashé pour: {}", registerRequest.getEmail());

        // Étape 3 : Récupérer le rôle par défaut (USER)
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> {
                    log.error("Rôle USER introuvable en BD - vérifier 002_insert_data.sql");
                    return new IllegalArgumentException("Erreur système : rôle par défaut introuvable");
                });

        // Étape 4 : Récupérer le statut par défaut (ACTIF)
        Status activeStatus = statusRepository.findByName("ACTIF")
                .orElseThrow(() -> {
                    log.error("Statut ACTIF introuvable en BD - vérifier 002_insert_data.sql");
                    return new IllegalArgumentException("Erreur système : statut par défaut introuvable");
                });

        // Étape 5 : Créer et sauvegarder le nouvel utilisateur
        User newUser = User.builder()
                .email(registerRequest.getEmail())
                .password(hashedPassword)
                .nom(registerRequest.getNom())
                .prenom(registerRequest.getPrenom())
                .role(userRole)
                .status(activeStatus)
                // date_inscription : géré par BD (@Temporal ou DEFAULT CURRENT_TIMESTAMP)
                // date_connexion : NULL au départ, rempli au premier login
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Nouvel utilisateur créé : {} (ID: {})", savedUser.getEmail(), savedUser.getId());

        // Étape 6 : Générer un JWT token (login automatique après inscription)
        String token = jwtUtil.generateToken(savedUser.getEmail(), userRole.getName());

        // Étape 7 : Construire et retourner la réponse
        RegisterResponse response = RegisterResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .nom(savedUser.getNom())
                .prenom(savedUser.getPrenom())
                .role(userRole.getName())
                .status(activeStatus.getName())
                .token(token)
                .message("Compte créé avec succès ! Vous êtes maintenant connecté.")
                .build();

        log.info("Register réussi pour: {}", registerRequest.getEmail());
        return response;
    }
}
