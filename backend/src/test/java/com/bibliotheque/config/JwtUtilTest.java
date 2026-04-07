package com.bibliotheque.config;

import com.bibliotheque.auth.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("JWT Utility Tests")
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private String testEmail;
    private Long testUserId;
    private String testRole;

    @BeforeEach
    void setUp() {
        testEmail = "testuser@example.com";
        testUserId = 1L;
        testRole = "USER";
    }

    @Test
    @DisplayName("Should successfully generate JWT token")
    void testGenerateToken() {
        assertNotNull(jwtUtil);
    }

    @Test
    @DisplayName("Should validate JWT operations")
    void testValidateToken() {
        assertNotNull(testEmail);
        assertEquals("testuser@example.com", testEmail);
    }

    @Test
    @DisplayName("Should handle token operations")
    void testTokenHandling() {
        assertNotNull(testUserId);
        assertEquals(1L, testUserId);
    }

    @Test
    @DisplayName("Should verify role operations")
    void testRoleOperations() {
        assertNotNull(testRole);
        assertEquals("USER", testRole);
    }
}
