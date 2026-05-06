package com.bibliotheque.admin.service;

import com.bibliotheque.admin.dto.ForeignKeyInfoDTO;
import com.bibliotheque.admin.dto.ForeignKeyOptionDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests pour TableManagementService
 * Valide la détection des FKs et la récupération des labels
 */
@SpringBootTest
@ActiveProfiles("test")
public class TableManagementServiceTest {

    @Autowired
    private TableManagementService tableManagementService;

    @BeforeEach
    void setUp() {
        assertNotNull(tableManagementService, "TableManagementService should be autowired");
    }

    @Test
    void testGetAllTables() {
        List<String> tables = tableManagementService.getAllTables();
        assertNotNull(tables, "Tables list should not be null");
        assertTrue(tables.size() > 0, "Database should have at least one table");
        assertTrue(tables.contains("livre"), "Table 'livre' should exist");
    }

    @Test
    void testGetTableSchema() {
        List<Map<String, Object>> schema = tableManagementService.getTableSchema("livre");
        assertNotNull(schema, "Schema should not be null");
        assertTrue(schema.size() > 0, "Schema should have columns");
    }

    @Test
    void testGetForeignKeyInfoForLivre() {
        List<ForeignKeyInfoDTO> fks = tableManagementService.getForeignKeyInfo("livre");
        assertNotNull(fks, "Foreign keys list should not be null");
        assertTrue(fks.size() >= 3, "Table 'livre' should have at least 3 FKs");
        
        List<String> columnNames = fks.stream()
            .map(ForeignKeyInfoDTO::getColumnName)
            .toList();
        
        assertTrue(columnNames.contains("auteur_id"));
        assertTrue(columnNames.contains("genre_id"));
        assertTrue(columnNames.contains("langue_id"));
    }

    @Test
    void testForeignKeyOptionsArePopulated() {
        List<ForeignKeyInfoDTO> fks = tableManagementService.getForeignKeyInfo("livre");
        ForeignKeyInfoDTO auteurFK = fks.stream()
            .filter(fk -> "auteur_id".equals(fk.getColumnName()))
            .findFirst()
            .orElse(null);
        
        assertNotNull(auteurFK, "Should have auteur_id FK");
        assertNotNull(auteurFK.getOptions(), "Options should not be null");
        assertTrue(auteurFK.getOptions().size() > 0, "Should have options");
        
        ForeignKeyOptionDTO option = auteurFK.getOptions().get(0);
        assertNotNull(option.getId(), "Option should have id");
        assertNotNull(option.getLabel(), "Option should have label");
    }

    @Test
    void testLabelColumnDetection() {
        List<ForeignKeyInfoDTO> fks = tableManagementService.getForeignKeyInfo("auteur");
        ForeignKeyInfoDTO langueFk = fks.stream()
            .filter(fk -> "langue_id".equals(fk.getColumnName()))
            .findFirst()
            .orElse(null);
        
        assertNotNull(langueFk);
        assertEquals("libelle", langueFk.getLabelColumn());
    }

    @Test
    void testTableDataRetrieval() {
        List<Map<String, Object>> data = tableManagementService.getTableData("auteur");
        assertNotNull(data, "Table data should not be null");
        assertTrue(data.size() > 0, "Should have data");
    }
}
