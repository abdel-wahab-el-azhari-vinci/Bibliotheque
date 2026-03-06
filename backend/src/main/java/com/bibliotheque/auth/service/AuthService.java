package com.bibliotheque.auth.service;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.dto.RegisterRequest;
import com.bibliotheque.auth.util.JwtUtil;
import com.bibliotheque.user.entity.Role;
import com.bibliotheque.user.entity.Status;
import com.bibliotheque.user.repository.RoleRepository;
import com.bibliotheque.user.repository.StatusRepository;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

/**
 * AuthService - Logique métier d'authentification
 * 
 * Respecte AI_RULES:
 * ✅ TOUTE la logique auth est ici
 * ✅ Validation des passwords
 * ✅ Génération JWT
 * ✅ Controller appelle seulement ce service
 */
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StatusRepository statusRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    /**
     * Login - Authentification utilisateur
     * Valide email + password, retourne JWT token
     */
    public LoginResponse login(LoginRequest request) {
        
        // Récupérer l'utilisateur par email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));
        
        // Vérifier le password (bcrypt compare)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }
        
        // Vérifier le statut (ACTIVE)
        if (!user.getStatus().getName().equals("ACTIVE")) {
            throw new IllegalArgumentException("Compte désactivé. Contactez l'administrateur");
        }
        
        // Générer les tokens
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().getName());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getId());
        
        // Mettre à jour la dernière connexion
        user.setDateConnexion(LocalDateTime.now());
        userRepository.save(user);
        
        // Construire la réponse
        return LoginResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .userId(user.getId())
            .email(user.getEmail())
            .nom(user.getNom())
            .prenom(user.getPrenom())
            .role(user.getRole().getName())
            .expiresIn(jwtUtil.getExpirationInSeconds())
            .build();
    }
    
    /**
     * Register - Inscription d'un nouvel utilisateur
     * Validation, création de compte avec password hashé
     * Assigne rôle USER et status ACTIVE par défaut
     */
    public LoginResponse register(RegisterRequest request) {
        
        // Validation: email unique
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }
        
        // Validation: passwords correspondent
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }
        
        // Hash le password avec bcrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // Récupérer le rôle par défaut (USER)
        Role userRole = roleRepository.findByName("USER")
            .orElseThrow(() -> new NoSuchElementException("Rôle USER non trouvé en base"));
        
        // Récupérer le statut par défaut (ACTIVE)
        Status activeStatus = statusRepository.findByName("ACTIVE")
            .orElseThrow(() -> new NoSuchElementException("Statut ACTIVE non trouvé en base"));
        
        // Créer l'utilisateur
        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setDateInscription(LocalDateTime.now());
        user.setDateConnexion(LocalDateTime.now());
        user.setRole(userRole);        // ✅ RÔLE ASSIGNÉ
        user.setStatus(activeStatus);  // ✅ STATUT ASSIGNÉ
        
        // Sauvegarder
        User saved = userRepository.save(user);
        
        // Générer les tokens
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getId(), userRole.getName());
        String refreshToken = jwtUtil.generateRefreshToken(saved.getEmail(), saved.getId());
        
        return LoginResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .userId(saved.getId())
            .email(saved.getEmail())
            .nom(saved.getNom())
            .prenom(saved.getPrenom())
            .role(userRole.getName())
            .expiresIn(jwtUtil.getExpirationInSeconds())
            .build();
    }
    
    /**
     * Refresh token - Générer un nouveau token depuis un refresh token valide
     */
    public LoginResponse refreshToken(String refreshToken) {
        
        if (!jwtUtil.isValidToken(refreshToken)) {
            throw new IllegalArgumentException("Refresh token invalide ou expiré");
        }
        
        String email = jwtUtil.getEmail(refreshToken);
        Long userId = jwtUtil.getUserId(refreshToken);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouvé"));
        
        String newToken = jwtUtil.generateToken(email, userId, user.getRole().getName());
        String newRefreshToken = jwtUtil.generateRefreshToken(email, userId);
        
        return LoginResponse.builder()
            .token(newToken)
            .refreshToken(newRefreshToken)
            .userId(userId)
            .email(email)
            .nom(user.getNom())
            .prenom(user.getPrenom())
            .role(user.getRole().getName())
            .expiresIn(jwtUtil.getExpirationInSeconds())
            .build();
    }
}
