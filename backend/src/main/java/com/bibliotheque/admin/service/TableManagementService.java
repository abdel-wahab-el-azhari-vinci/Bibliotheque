package com.bibliotheque.admin.service;

import com.bibliotheque.admin.dto.ForeignKeyInfoDTO;
import com.bibliotheque.admin.dto.ForeignKeyOptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
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
        String query = "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?";
        return jdbcTemplate.queryForList(query, tableName);
    }

    /**
     * Récupère les informations des clés étrangères d'une table
     * Inclut les options pour chaque clé étrangère
     */
    public List<ForeignKeyInfoDTO> getForeignKeyInfo(String tableName) {
        try {
            // Récupérer les FKs
            List<Map<String, Object>> fks = getForeignKeysForTable(tableName);
            
            List<ForeignKeyInfoDTO> result = new ArrayList<>();
            
            for (Map<String, Object> fk : fks) {
                String columnName = (String) fk.get("COLUMN_NAME");
                String referencedTable = (String) fk.get("REFERENCED_TABLE_NAME");
                
                if (columnName != null && referencedTable != null) {
                    // Déterminer la colonne label pour la table référencée
                    String labelColumn = getLabelColumn(referencedTable);
                    
                    // Récupérer les données de la table référencée
                    List<ForeignKeyOptionDTO> options = getForeignKeyData(referencedTable, labelColumn);
                    
                    ForeignKeyInfoDTO info = new ForeignKeyInfoDTO();
                    info.setColumnName(columnName);
                    info.setReferencedTable(referencedTable);
                    info.setLabelColumn(labelColumn);
                    info.setOptions(options);
                    
                    result.add(info);
                }
            }
            
            return result;
        } catch (Exception e) {
            // Retourner une liste vide si une erreur survient
            return new ArrayList<>();
        }
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
        // Vérifier d'abord dans le mapping statique
        if (TABLE_LABEL_COLUMNS.containsKey(tableName)) {
            return TABLE_LABEL_COLUMNS.get(tableName);
        }
        
        // Liste des noms de colonnes à essayer
        String[] candidateColumns = {"nom", "libelle", "email", "titre", "description", "name", "label"};
        
        try {
            List<Map<String, Object>> columns = getTableSchema(tableName);
            Set<String> columnNames = columns.stream()
                .map(c -> (String) c.get("COLUMN_NAME"))
                .collect(Collectors.toSet());
            
            // Retourner la première colonne candidate qui existe
            for (String candidate : candidateColumns) {
                if (columnNames.contains(candidate)) {
                    return candidate;
                }
            }
            
            // Par défaut, retourner "id" si rien n'est trouvé
            return "id";
        } catch (Exception e) {
            return "id";
        }
    }

    /**
     * Récupère les données d'une table pour les afficher comme options
     * Format: [{id: 1, label: "Valeur 1"}, ...]
     */
    private List<ForeignKeyOptionDTO> getForeignKeyData(String tableName, String labelColumn) {
        try {
            String query = "SELECT id, " + labelColumn + " as label FROM " + tableName + " ORDER BY " + labelColumn;
            
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);
            
            return rows.stream()
                .map(row -> new ForeignKeyOptionDTO(
                    ((Number) row.get("id")).longValue(),
                    String.valueOf(row.get("label"))
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            // Retourner une liste vide si la requête échoue
            return new ArrayList<>();
        }
    }

    /**
     * Insère les données dans une table dynamiquement
     */
    public void insertIntoTable(String tableName, Map<String, Object> data) {
        if (!isValidTableName(tableName)) {
            throw new IllegalArgumentException("Invalid table name: " + tableName);
        }

        List<String> columns = new ArrayList<>(data.keySet());
        StringBuilder query = new StringBuilder("INSERT INTO " + tableName + " (");
        query.append(String.join(", ", columns));
        query.append(") VALUES (");
        
        List<Object> values = new ArrayList<>();
        for (int i = 0; i < columns.size(); i++) {
            query.append("?");
            if (i < columns.size() - 1) {
                query.append(", ");
            }
            values.add(data.get(columns.get(i)));
        }
        query.append(")");

        jdbcTemplate.update(query.toString(), values.toArray());
    }

    /**
     * Valide que le nom de la table existe dans la base de données
     */
    private boolean isValidTableName(String tableName) {
        List<String> tables = getAllTables();
        return tables.contains(tableName);
    }

    /**
     * Récupère tous les enregistrements d'une table
     */
    public List<Map<String, Object>> getTableData(String tableName) {
        String query = "SELECT * FROM " + tableName + " LIMIT 100";
        return jdbcTemplate.queryForList(query);
    }

    /**
     * Récupère les tables qui dépendent de cette table (FK)
     */
    public List<String> getDependentTables(String tableName) {
        String query = "SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
                      "WHERE REFERENCED_TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE()";
        return jdbcTemplate.queryForList(query, String.class, tableName);
    }

    /**
     * Reset une table en vidant ses données
     * Retourne la liste des tables qui ont été vidées
     */
    public List<String> clearTable(String tableName) {
        if (!isValidTableName(tableName)) {
            throw new IllegalArgumentException("Invalid table name: " + tableName);
        }

        List<String> clearedTables = new ArrayList<>();
        
        try {
            // Désactiver les contraintes FK temporairement
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
            
            // Récupérer les tables dépendantes
            List<String> dependents = getDependentTables(tableName);
            
            // Vider les tables dépendantes d'abord
            for (String dependent : dependents) {
                String deleteQuery = "DELETE FROM " + dependent;
                jdbcTemplate.update(deleteQuery);
                clearedTables.add(dependent);
                
                // Réinitialiser l'auto-increment si existe
                tryResetAutoIncrement(dependent);
            }
            
            // Vider la table principale
            String deleteQuery = "DELETE FROM " + tableName;
            jdbcTemplate.update(deleteQuery);
            clearedTables.add(tableName);
            
            // Réinitialiser l'auto-increment
            tryResetAutoIncrement(tableName);
            
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
        try {
            String resetQuery = "ALTER TABLE " + tableName + " AUTO_INCREMENT = 1";
            jdbcTemplate.execute(resetQuery);
        } catch (Exception e) {
            // Silencieusement ignorer si la table n'a pas d'auto-increment
        }
    }
}
