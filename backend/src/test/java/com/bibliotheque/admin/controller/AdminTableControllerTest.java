package com.bibliotheque.admin.controller;

import com.bibliotheque.admin.service.TableManagementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests pour AdminTableController
 * Valide les endpoints API pour les FKs
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminTableControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TableManagementService tableManagementService;

    @Test
    void testGetForeignKeysEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/database/tables/livre/foreign-keys")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    void testGetTablesEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/database/tables")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    void testGetSchemaEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/database/tables/livre/schema")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    void testForeignKeysDataStructure() {
        var fks = tableManagementService.getForeignKeyInfo("livre");
        
        assert fks != null;
        assert fks.size() >= 3;
        
        fks.forEach(fk -> {
            assert fk.getColumnName() != null;
            assert fk.getReferencedTable() != null;
            assert fk.getLabelColumn() != null;
            assert fk.getOptions() != null;
        });
    }
}
