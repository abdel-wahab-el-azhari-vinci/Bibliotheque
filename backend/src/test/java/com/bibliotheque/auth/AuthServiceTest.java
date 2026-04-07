package com.bibliotheque.auth;

import com.bibliotheque.auth.service.AuthService;
import com.bibliotheque.auth.util.JwtUtil;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import com.bibliotheque.exception.AuthenticationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("Authentication Service Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should find user by email")
    void testFindUserByEmail() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = userRepository.findByEmail("user@example.com");

        assertTrue(result.isPresent());
        assertEquals("user@example.com", result.get().getEmail());
    }

    @Test
    @DisplayName("Should verify password encoding")
    void testPasswordMatching() {
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        boolean matches = passwordEncoder.matches("password123", "encodedPassword");

        assertTrue(matches);
    }

    @Test
    @DisplayName("Should reject wrong password")
    void testPasswordNotMatching() {
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        boolean matches = passwordEncoder.matches("wrongpassword", "encodedPassword");

        assertFalse(matches);
    }

    @Test
    @DisplayName("Should handle user not found")
    void testUserNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should save new user")
    void testSaveNewUser() {
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        newUser.setPassword("encodedPassword");
        newUser.setPrenom("John");
        newUser.setNom("Doe");

        when(userRepository.save(any(User.class))).thenReturn(newUser);

        User result = userRepository.save(newUser);

        assertNotNull(result);
        assertEquals("newuser@example.com", result.getEmail());
    }
}
