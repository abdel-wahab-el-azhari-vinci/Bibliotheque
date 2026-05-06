package com.bibliotheque.admin.controller;

import com.bibliotheque.admin.dto.ForeignKeyInfoDTO;
import com.bibliotheque.admin.service.TableManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * REST Controller pour l'administration des tables
 * UNIQUEMENT pour les utilisateurs avec le rôle ADMIN
 */
@RestController
@RequestMapping("/api/admin/database")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTableController {

    private final TableManagementService tableManagementService;

    /**
     * GET /api/admin/database/tables
     * Récupère la liste de toutes les tables de la base de données
     */
    @GetMapping("/tables")
    public ResponseEntity<Map<String, Object>> getTables() {
        try {
            List<String> tables = tableManagementService.getAllTables();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tables", tables);
            response.put("count", tables.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * GET /api/admin/database/tables/{tableName}/schema
     * Récupère le schéma (colonnes) d'une table spécifique
     */
    @GetMapping("/tables/{tableName}/schema")
    public ResponseEntity<Map<String, Object>> getTableSchema(@PathVariable String tableName) {
        try {
            List<Map<String, Object>> schema = tableManagementService.getTableSchema(tableName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tableName", tableName);
            response.put("schema", schema);
            response.put("columns", schema.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * GET /api/admin/database/tables/{tableName}/foreign-keys
     * Récupère les informations des clés étrangères d'une table
     * Inclut les options de chaque clé étrangère avec labels lisibles
     */
    @GetMapping("/tables/{tableName}/foreign-keys")
    public ResponseEntity<Map<String, Object>> getForeignKeyInfo(@PathVariable String tableName) {
        try {
            List<ForeignKeyInfoDTO> foreignKeys = tableManagementService.getForeignKeyInfo(tableName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tableName", tableName);
            response.put("foreignKeys", foreignKeys);
            response.put("count", foreignKeys.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/database/tables/{tableName}/insert
     * Insère une nouvelle ligne dans la table
     * Body contient les colonnes et valeurs
     */
    @PostMapping("/tables/{tableName}/insert")
    public ResponseEntity<Map<String, Object>> insertIntoTable(
            @PathVariable String tableName,
            @RequestBody Map<String, Object> data) {
        try {
            tableManagementService.insertIntoTable(tableName, data);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Data inserted successfully into " + tableName);
            response.put("tableName", tableName);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * GET /api/admin/database/tables/{tableName}/data
     * Récupère les données d'une table (max 100 lignes)
     */
    @GetMapping("/tables/{tableName}/data")
    public ResponseEntity<Map<String, Object>> getTableData(@PathVariable String tableName) {
        try {
            List<Map<String, Object>> data = tableManagementService.getTableData(tableName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tableName", tableName);
            response.put("data", data);
            response.put("rowCount", data.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * GET /api/admin/database/tables/{tableName}/dependents
     * Récupère les tables qui dépendent de cette table via FK
     */
    @GetMapping("/tables/{tableName}/dependents")
    public ResponseEntity<Map<String, Object>> getDependentTables(@PathVariable String tableName) {
        try {
            List<String> dependents = tableManagementService.getDependentTables(tableName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tableName", tableName);
            response.put("dependents", dependents);
            response.put("count", dependents.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/database/tables/{tableName}/clear
     * Vide une table et toutes ses dépendances
     * Réinitialise les auto-increments
     */
    @DeleteMapping("/tables/{tableName}/clear")
    public ResponseEntity<Map<String, Object>> clearTable(@PathVariable String tableName) {
        try {
            List<String> clearedTables = tableManagementService.clearTable(tableName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Table cleared successfully");
            response.put("tableName", tableName);
            response.put("clearedTables", clearedTables);
            response.put("count", clearedTables.size());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
