package com.bibliotheque.admin.service;

import com.bibliotheque.admin.dto.ForeignKeyInfoDTO;
import com.bibliotheque.admin.dto.ForeignKeyOptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service pour gérer les tables dynamiquement
 * Permet aux admins de voir et d'insérer dans les tables
 */
@Service
@RequiredArgsConstructor
public class TableManagementService {

    private final JdbcTemplate jdbcTemplate;

    // Mapping des tables avec leurs colonnes de label
    private static final Map<String, String> TABLE_LABEL_COLUMNS = Map.ofEntries(
        Map.entry("auteur", "nom"),
        Map.entry("genre", "libelle"),
        Map.entry("langue", "libelle"),
        Map.entry("pays", "nom_pays"),
        Map.entry("categorie", "libelle"),
        Map.entry("users", "email"),
        Map.entry("livre", "titre"),
        Map.entry("commune", "nom"),
        Map.entry("code_postal", "code")
    );

    /**
     * Récupère la liste de toutes les tables de la base de données
     */
    public List<String> getAllTables() {
        String query = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()";
        return jdbcTemplate.queryForList(query, String.class);
    }

    /**
     * Récupère le schéma (colonnes) d'une table spécifique
     */
    public List<Map<String, Object>> getTableSchema(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        String query = "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?";
        return jdbcTemplate.queryForList(query, validatedTableName);
    }

    /**
     * Récupère les informations des clés étrangères d'une table
     * Inclut les options pour chaque clé étrangère
     */
    public List<ForeignKeyInfoDTO> getForeignKeyInfo(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        List<Map<String, Object>> fks = getForeignKeysForTable(validatedTableName);

        List<ForeignKeyInfoDTO> result = new ArrayList<>();

        for (Map<String, Object> fk : fks) {
            String columnName = (String) fk.get("COLUMN_NAME");
            String referencedTable = (String) fk.get("REFERENCED_TABLE_NAME");

            if (columnName != null && referencedTable != null) {
                String validatedReferencedTable = requireExistingTable(referencedTable);
                String labelColumn = getLabelColumn(validatedReferencedTable);
                List<ForeignKeyOptionDTO> options = getForeignKeyData(validatedReferencedTable, labelColumn);

                ForeignKeyInfoDTO info = new ForeignKeyInfoDTO();
                info.setColumnName(columnName);
                info.setReferencedTable(validatedReferencedTable);
                info.setLabelColumn(labelColumn);
                info.setOptions(options);

                result.add(info);
            }
        }

        return result;
    }

    /**
     * Récupère les clés étrangères d'une table
     */
    private List<Map<String, Object>> getForeignKeysForTable(String tableName) {
        String query = "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME " +
                      "FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
                      "WHERE TABLE_SCHEMA = DATABASE() " +
                      "AND TABLE_NAME = ? " +
                      "AND REFERENCED_TABLE_NAME IS NOT NULL";
        return jdbcTemplate.queryForList(query, tableName);
    }

    /**
     * Détecte la colonne à afficher comme label pour une table
     * Essaie plusieurs colonnes communes (nom, libelle, email, titre, etc.)
     */
    private String getLabelColumn(String tableName) {
        Set<String> columnNames = getTableColumns(tableName);

        String mappedLabel = TABLE_LABEL_COLUMNS.get(tableName);
        if (mappedLabel != null && columnNames.contains(mappedLabel)) {
            return mappedLabel;
        }

        String[] candidateColumns = {"nom", "libelle", "email", "titre", "description", "name", "label"};
        for (String candidate : candidateColumns) {
            if (columnNames.contains(candidate)) {
                return candidate;
            }
        }

        if (columnNames.contains("id")) {
            return "id";
        }

        throw new IllegalArgumentException("No display column found for table: " + tableName);
    }

    /**
     * Récupère les données d'une table pour les afficher comme options
     * Format: [{id: 1, label: "Valeur 1"}, ...]
     */
    private List<ForeignKeyOptionDTO> getForeignKeyData(String tableName, String labelColumn) {
        String validatedTableName = requireExistingTable(tableName);
        validateColumns(validatedTableName, List.of("id", labelColumn));

        String query = "SELECT " + quoteIdentifier("id") + ", " +
                      quoteIdentifier(labelColumn) + " AS label FROM " +
                      quoteIdentifier(validatedTableName) +
                      " ORDER BY " + quoteIdentifier(labelColumn);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);

        return rows.stream()
            .map(row -> new ForeignKeyOptionDTO(
                ((Number) row.get("id")).longValue(),
                String.valueOf(row.get("label"))
            ))
            .collect(Collectors.toList());
    }

    /**
     * Insère les données dans une table dynamiquement
     */
    public void insertIntoTable(String tableName, Map<String, Object> data) {
        String validatedTableName = requireExistingTable(tableName);

        if (data == null || data.isEmpty()) {
            throw new IllegalArgumentException("Insert data cannot be empty");
        }

        validateColumns(validatedTableName, data.keySet());

        List<String> columns = new ArrayList<>(data.keySet());
        String quotedColumns = columns.stream()
            .map(this::quoteIdentifier)
            .collect(Collectors.joining(", "));
        String placeholders = String.join(", ", Collections.nCopies(columns.size(), "?"));

        String query = "INSERT INTO " + quoteIdentifier(validatedTableName) + " (" + quotedColumns + ") VALUES (" + placeholders + ")";

        List<Object> values = columns.stream()
            .map(data::get)
            .collect(Collectors.toList());

        jdbcTemplate.update(query, values.toArray());
    }

    /**
     * Récupère tous les enregistrements d'une table
     */
    public List<Map<String, Object>> getTableData(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        String query = "SELECT * FROM " + quoteIdentifier(validatedTableName) + " LIMIT 100";
        return jdbcTemplate.queryForList(query);
    }

    /**
     * Récupère les tables qui dépendent de cette table (FK)
     */
    public List<String> getDependentTables(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        String query = "SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
                      "WHERE REFERENCED_TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE()";
        return jdbcTemplate.queryForList(query, String.class, validatedTableName);
    }

    /**
     * Reset une table en vidant ses données
     * Retourne la liste des tables qui ont été vidées
     */
    public List<String> clearTable(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        List<String> clearedTables = new ArrayList<>();

        try {
            // Désactiver les contraintes FK temporairement
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

            // Récupérer les tables dépendantes
            List<String> dependents = getDependentTables(validatedTableName);

            // Vider les tables dépendantes d'abord
            for (String dependent : dependents) {
                String validatedDependent = requireExistingTable(dependent);
                String deleteQuery = "DELETE FROM " + quoteIdentifier(validatedDependent);
                jdbcTemplate.update(deleteQuery);
                clearedTables.add(validatedDependent);

                // Réinitialiser l'auto-increment si existe
                tryResetAutoIncrement(validatedDependent);
            }

            // Vider la table principale
            String deleteQuery = "DELETE FROM " + quoteIdentifier(validatedTableName);
            jdbcTemplate.update(deleteQuery);
            clearedTables.add(validatedTableName);

            // Réinitialiser l'auto-increment
            tryResetAutoIncrement(validatedTableName);

        } finally {
            // Réactiver les contraintes FK
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
        }

        return clearedTables;
    }

    /**
     * Tente de réinitialiser l'auto-increment d'une table
     */
    private void tryResetAutoIncrement(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        try {
            String resetQuery = "ALTER TABLE " + quoteIdentifier(validatedTableName) + " AUTO_INCREMENT = 1";
            jdbcTemplate.execute(resetQuery);
        } catch (Exception e) {
            // Silencieusement ignorer si la table n'a pas d'auto-increment
        }
    }

    private void validateColumns(String tableName, Collection<String> columnNames) {
        Set<String> availableColumns = getTableColumns(tableName);
        List<String> missingColumns = columnNames.stream()
            .filter(column -> !availableColumns.contains(column))
            .distinct()
            .collect(Collectors.toList());

        if (!missingColumns.isEmpty()) {
            throw new IllegalArgumentException("Unknown column(s) for table " + tableName + ": " + String.join(", ", missingColumns));
        }
    }

    private Set<String> getTableColumns(String tableName) {
        String validatedTableName = requireExistingTable(tableName);
        String query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?";
        List<String> columns = jdbcTemplate.queryForList(query, String.class, validatedTableName);
        return new HashSet<>(columns);
    }

    private String requireExistingTable(String tableName) {
        if (tableName == null || tableName.isBlank()) {
            throw new IllegalArgumentException("Table name cannot be empty");
        }

        List<String> tables = getAllTables();
        if (!tables.contains(tableName)) {
            throw new IllegalArgumentException("Unknown table: " + tableName);
        }

        return tableName;
    }

    private String quoteIdentifier(String identifier) {
        return "`" + identifier.replace("`", "``") + "`";
    }
}
