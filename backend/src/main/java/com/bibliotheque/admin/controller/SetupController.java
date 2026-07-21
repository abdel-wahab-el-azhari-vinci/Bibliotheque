package com.bibliotheque.admin.controller;

import com.bibliotheque.user.entity.Role;
import com.bibliotheque.user.entity.Status;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.RoleRepository;
import com.bibliotheque.user.repository.StatusRepository;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Endpoint réservé aux ADMIN existants (ex: recréer/réinitialiser le compte admin par défaut).
 * Ne doit JAMAIS être accessible anonymement: il révèle et fixe le mot de passe admin.
 */
@RestController
@RequestMapping("/api/setup")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SetupController {

    private final RoleRepository roleRepository;
    private final StatusRepository statusRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/init")
    public ResponseEntity<?> initializeDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Try to create admin with active status
            Optional<User> existingAdmin = userRepository.findByEmail("admin@bibliotheque.com");
            
            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            Status activeStatus = statusRepository.findByName("ACTIVE")
                    .or(() -> statusRepository.findByName("ACTIF"))
                    .orElse(null);
            
            if (adminRole == null) {
                response.put("status", "ERROR_NO_ADMIN_ROLE");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (activeStatus == null) {
                response.put("status", "ERROR_NO_ACTIVE_STATUS");
                return ResponseEntity.badRequest().body(response);
            }
            
            String plainPassword = "Admin123";
            String encodedPassword = passwordEncoder.encode(plainPassword);
            
            if (existingAdmin.isPresent()) {
                // Update existing admin's password
                User admin = existingAdmin.get();
                admin.setPassword(encodedPassword);
                userRepository.save(admin);
                response.put("admin", "UPDATED");
            } else {
                // Create new admin
                User admin = User.builder()
                        .email("admin@bibliotheque.com")
                        .password(encodedPassword)
                        .nom("Admin")
                        .prenom("Systeme")
                        .rue("N/A")
                        .role(adminRole)
                        .status(activeStatus)
                        .build();
                userRepository.save(admin);
                response.put("admin", "CREATED");
            }
            
            response.put("admin_email", "admin@bibliotheque.com");
            response.put("admin_password", plainPassword);
            response.put("status", "OK");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
