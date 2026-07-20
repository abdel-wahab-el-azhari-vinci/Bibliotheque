package com.bibliotheque.admin.service;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TableManagementServiceTest {

    @Test
    void getAllTablesShouldFilterOutNonIdentifierNames() {
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
            .thenReturn(List.of("livre", "users", "bad-name"));

        TableManagementService service = new TableManagementService(jdbcTemplate);

        List<String> tables = service.getAllTables();

        assertEquals(List.of("livre", "users"), tables);
    }
}
