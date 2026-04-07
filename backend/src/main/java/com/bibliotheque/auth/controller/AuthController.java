package com.bibliotheque.auth.controller;

import com.bibliotheque.auth.dto.LoginRequest;
import com.bibliotheque.auth.dto.LoginResponse;
import com.bibliotheque.auth.dto.RegisterRequest;
import com.bibliotheque.auth.dto.UserResponse;
import com.bibliotheque.auth.service.AuthService;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;

/**
 * REST Controller - Authentification
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserRepository userRepository;
    
    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/auth/me
     * Retour l'utilisateur connecté avec nom/prénom/rôle
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouvé"));
        
        UserResponse response = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .nom(user.getNom())
            .prenom(user.getPrenom())
            .role(user.getRole().getName())
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
}
