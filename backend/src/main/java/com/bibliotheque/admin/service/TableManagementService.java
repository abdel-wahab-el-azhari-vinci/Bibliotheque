package com.bibliotheque.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * Service pour gérer les tables dynamiquement
 * Permet aux admins de voir et d'insérer dans les tables
 */
@Service
@RequiredArgsConstructor
public class TableManagementService {

    private final JdbcTemplate jdbcTemplate;

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
}
