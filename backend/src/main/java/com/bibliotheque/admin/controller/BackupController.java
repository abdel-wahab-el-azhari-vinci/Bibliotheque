package com.bibliotheque.admin.controller;

import com.bibliotheque.admin.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/backup")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    private final BackupService backupService;

    /**
     * Crée un nouveau backup de la base de données
     */
    @PostMapping("/create")
    public ResponseEntity<?> createBackup() {
        try {
            String backupId = backupService.createBackup();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("backupId", backupId);
            response.put("message", "Backup created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Liste tous les backups disponibles
     */
    @GetMapping("/list")
    public ResponseEntity<?> listBackups() {
        try {
            List<Map<String, Object>> backups = backupService.listBackups();
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "count", backups.size(),
                "backups", backups
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Restaure la base de données depuis un backup
     */
    @PostMapping("/restore/{backupId}")
    public ResponseEntity<?> restoreBackup(@PathVariable String backupId) {
        try {
            backupService.restoreBackup(backupId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Database restored successfully from " + backupId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
}
