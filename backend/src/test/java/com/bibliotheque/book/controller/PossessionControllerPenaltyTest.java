package com.bibliotheque.book.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.shared.service.PossessionService;
import com.bibliotheque.shared.service.PenaltyService;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@WebMvcTest(PossessionController.class)
@DisplayName("PossessionController Penalty Integration Tests")
class PossessionControllerPenaltyTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PossessionService possessionService;

    @MockBean
    private PenaltyService penaltyService;

    @MockBean
    private UserRepository userRepository;

    private User testUser;
    private Possession testPossession;
    private Livre testLivre;

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        testLivre = new Livre();
        testLivre.setId(1L);
        testLivre.setTitre("Test Book");

        testPossession = new Possession();
        testPossession.setId(1L);
        testPossession.setUser(testUser);
        testPossession.setLivre(testLivre);
        testPossession.setDateEmprunt(LocalDate.now().minusDays(20));
    }

    @Test
    @DisplayName("PATCH /api/possessions/{id}/retourner - Should return book and create penalty if late")
    void testReturnBookLate_CreatesPenalty() throws Exception {
        // Arrange
        LocalDate actualReturn = LocalDate.now().plusDays(3); // 3 days late
        when(possessionService.markAsReturned(1L)).thenReturn(testPossession);
        
        Penalty createdPenalty = new Penalty();
        createdPenalty.setId(1L);
        createdPenalty.setStatus(Penalty.PenaltyStatus.PENDING);
        createdPenalty.setMontantTotal(new BigDecimal("1.50"));
        when(penaltyService.createPenaltyIfLate(1L, actualReturn))
            .thenReturn(createdPenalty);

        // Act & Assert
        mockMvc.perform(
            patch("/api/possessions/1/retourner")
                .param("dateRetourActual", actualReturn.toString())
        )
        .andExpect(status().isOk());
        
        // Verify penalty service was called
        verify(penaltyService, times(1)).createPenaltyIfLate(1L, actualReturn);
    }

    @Test
    @DisplayName("PATCH /api/possessions/{id}/retourner - Should not create penalty if on time")
    void testReturnBookOnTime_NoPenalty() throws Exception {
        // Arrange
        LocalDate expectedReturn = testPossession.getDateEmprunt().plusDays(14);
        when(possessionService.markAsReturned(1L)).thenReturn(testPossession);
        when(penaltyService.createPenaltyIfLate(1L, expectedReturn))
            .thenReturn(null); // No penalty

        // Act & Assert
        mockMvc.perform(
            patch("/api/possessions/1/retourner")
                .param("dateRetourActual", expectedReturn.toString())
        )
        .andExpect(status().isOk());
        
        verify(penaltyService, times(1)).createPenaltyIfLate(1L, expectedReturn);
    }

    @Test
    @DisplayName("POST /api/possessions/borrow - Should fail if user has high penalties")
    void testBorrow_BlockedByHighPenalties() throws Exception {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(penaltyService.canBorrow(1L)).thenReturn(false); // User blocked
        
        // Setup security context
        setupSecurityContext(testUser.getEmail());

        // Act & Assert
        mockMvc.perform(
            post("/api/possessions/borrow")
                .contentType("application/json")
                .content("{\"livreId\": 1}")
        )
        .andExpect(status().isForbidden());
        
        verify(possessionService, never()).borrowBook(anyLong(), anyLong());
    }

    @Test
    @DisplayName("POST /api/possessions/borrow - Should allow if penalties < 100€")
    void testBorrow_AllowedWithLowPenalties() throws Exception {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(penaltyService.canBorrow(1L)).thenReturn(true); // User allowed
        when(possessionService.borrowBook(1L, 1L)).thenReturn(testPossession);
        
        setupSecurityContext(testUser.getEmail());

        // Act & Assert
        mockMvc.perform(
            post("/api/possessions/borrow")
                .contentType("application/json")
                .content("{\"livreId\": 1}")
        )
        .andExpect(status().isOk());
        
        verify(possessionService, times(1)).borrowBook(1L, 1L);
    }

    /**
     * Helper to setup security context for authentication
     */
    private void setupSecurityContext(String email) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
    }
}
