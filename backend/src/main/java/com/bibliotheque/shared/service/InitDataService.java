package com.bibliotheque.shared.service;

import com.bibliotheque.user.entity.Role;
import com.bibliotheque.user.entity.Status;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.RoleRepository;
import com.bibliotheque.user.repository.StatusRepository;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

/**
 * Service pour initialiser les données par défaut au démarrage
 */
@Service
@RequiredArgsConstructor
public class InitDataService implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final StatusRepository statusRepository;
    private final UserRepository userRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            System.out.println("[*] Starting database initialization...");
            initializeRoles();
            initializeStatuses();
            initializeAdminUser();
            System.out.println("[OK] Database initialization complete");
        } catch (Exception e) {
            System.out.println("[ERROR] Database initialization failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initializeRoles() {
        try {
            long count = roleRepository.count();
            if (count == 0) {
                System.out.println("[*] Creating default roles...");
                roleRepository.save(Role.builder().name("ADMIN").description("Administrator").build());
                roleRepository.save(Role.builder().name("USER").description("User").build());
                roleRepository.save(Role.builder().name("LIBRARIAN").description("Librarian").build());
                System.out.println("[OK] Default roles created (" + roleRepository.count() + " total)");
            } else {
                System.out.println("[OK] Roles already exist (" + count + " total)");
            }
        } catch (Exception e) {
            System.out.println("[ERROR] Failed to initialize roles: " + e.getMessage());
        }
    }

    private void initializeStatuses() {
        try {
            long count = statusRepository.count();
            if (count == 0) {
                System.out.println("[*] Creating default statuses...");
                statusRepository.save(Status.builder().name("ACTIF").description("Active").build());
                statusRepository.save(Status.builder().name("INACTIF").description("Inactive").build());
                statusRepository.save(Status.builder().name("SUSPENDU").description("Suspended").build());
                System.out.println("[OK] Default statuses created (" + statusRepository.count() + " total)");
            } else {
                System.out.println("[OK] Statuses already exist (" + count + " total)");
            }
        } catch (Exception e) {
            System.out.println("[ERROR] Failed to initialize statuses: " + e.getMessage());
        }
    }

    private void initializeAdminUser() {
        try {
            boolean adminExists = userRepository.findByEmail("admin@bibliotheque.com").isPresent();
            
            if (!adminExists) {
                System.out.println("[*] Creating default admin user...");
                
                Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
                Status activeStatus = statusRepository.findByName("ACTIF").orElse(null);
                
                if (adminRole == null) {
                    System.out.println("[ERROR] Could not find ADMIN role");
                    return;
                }
                
                if (activeStatus == null) {
                    System.out.println("[ERROR] Could not find ACTIF status");
                    return;
                }
                
                User admin = User.builder()
                        .email("admin@bibliotheque.com")
                        .password("$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy1Z5xa")
                        .nom("Admin")
                        .prenom("Systeme")
                        .rue("N/A")
                        .role(adminRole)
                        .status(activeStatus)
                        .build();
                
                User saved = userRepository.save(admin);
                System.out.println("[OK] Admin user created successfully");
                System.out.println("    Email: admin@bibliotheque.com");
                System.out.println("    Password: Admin123");
            } else {
                System.out.println("[OK] Admin user already exists");
            }
        } catch (Exception e) {
            System.out.println("[ERROR] Failed to initialize admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
