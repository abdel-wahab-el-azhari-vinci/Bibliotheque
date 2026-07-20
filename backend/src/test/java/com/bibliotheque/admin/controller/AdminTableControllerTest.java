package com.bibliotheque.admin.controller;

import com.bibliotheque.admin.service.TableManagementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
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

        assertNotNull(fks);
        assertTrue(fks.size() >= 3);

        fks.forEach(fk -> {
            assertNotNull(fk.getColumnName());
            assertNotNull(fk.getReferencedTable());
            assertNotNull(fk.getLabelColumn());
            assertNotNull(fk.getOptions());
        });
    }

    @Test
    void testSchemaEndpointReturnsBadRequestForUnknownTable() {
        TableManagementService mockedService = mock(TableManagementService.class);
        AdminTableController controller = new AdminTableController(mockedService);
        when(mockedService.getTableSchema("unknown_table")).thenThrow(new IllegalArgumentException("Unknown table: unknown_table"));

        ResponseEntity<Map<String, Object>> response = controller.getTableSchema("unknown_table");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(Boolean.FALSE, response.getBody().get("success"));
    }
}
