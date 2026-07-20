package com.bibliotheque.shared.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.shared.repository.PenaltyRepository;
import com.bibliotheque.shared.repository.PossessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@DisplayName("PenaltyService Tests")
class PenaltyServiceTest {
    
    @Mock
    private PenaltyRepository penaltyRepository;
    
    @Mock
    private PossessionRepository possessionRepository;
    
    @InjectMocks
    private PenaltyService penaltyService;
    
    private User testUser;
    private Livre testLivre;
    private Possession testPossession;
    private Penalty testPenalty;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
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
        
        testPenalty = new Penalty();
        testPenalty.setId(1L);
        testPenalty.setUser(testUser);
        testPenalty.setLivre(testLivre);
        testPenalty.setPossession(testPossession);
        testPenalty.setStatus(Penalty.PenaltyStatus.PENDING);
        testPenalty.setMontantTotal(new BigDecimal("5.00"));
    }
    
    @Test
    @DisplayName("Should create penalty when book returned late")
    void testCreatePenaltyIfLate_WithLateReturn() {
        LocalDate expectedReturnDate = testPossession.getDateEmprunt().plusDays(14);
        LocalDate actualReturnDate = expectedReturnDate.plusDays(3);
        
        when(possessionRepository.findById(1L)).thenReturn(Optional.of(testPossession));
        when(penaltyRepository.findByPossessionId(1L)).thenReturn(Optional.empty());
        when(penaltyRepository.save(any(Penalty.class))).thenReturn(testPenalty);
        
        Penalty result = penaltyService.createPenaltyIfLate(1L, actualReturnDate);
        
        assertNotNull(result);
        assertEquals(Penalty.PenaltyStatus.PENDING, result.getStatus());
        verify(penaltyRepository, times(1)).save(any(Penalty.class));
    }
    
    @Test
    @DisplayName("Should not create penalty when book returned on time")
    void testCreatePenaltyIfLate_WithOnTimeReturn() {
        LocalDate expectedReturnDate = testPossession.getDateEmprunt().plusDays(14);
        LocalDate actualReturnDate = expectedReturnDate;
        
        when(possessionRepository.findById(1L)).thenReturn(Optional.of(testPossession));
        when(penaltyRepository.findByPossessionId(1L)).thenReturn(Optional.empty());
        
        Penalty result = penaltyService.createPenaltyIfLate(1L, actualReturnDate);
        
        assertNull(result);
        verify(penaltyRepository, never()).save(any(Penalty.class));
    }
    
    @Test
    @DisplayName("Should throw exception if possession not found")
    void testCreatePenaltyIfLate_PossessionNotFound() {
        when(possessionRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThrows(IllegalArgumentException.class, 
            () -> penaltyService.createPenaltyIfLate(999L, LocalDate.now()));
    }
    
    @Test
    @DisplayName("Should get all penalties for user")
    void testGetUserPenalties() {
        List<Penalty> penalties = List.of(testPenalty);
        when(penaltyRepository.findByUserId(1L)).thenReturn(penalties);
        
        List<Penalty> result = penaltyService.getUserPenalties(1L);
        
        assertEquals(1, result.size());
        assertEquals(testPenalty.getId(), result.get(0).getId());
    }
    
    @Test
    @DisplayName("Should get only pending penalties for user")
    void testGetUserPendingPenalties() {
        List<Penalty> pendingPenalties = List.of(testPenalty);
        when(penaltyRepository.findByUserIdAndStatus(1L, Penalty.PenaltyStatus.PENDING))
            .thenReturn(pendingPenalties);
        
        List<Penalty> result = penaltyService.getUserPendingPenalties(1L);
        
        assertEquals(1, result.size());
        assertEquals(Penalty.PenaltyStatus.PENDING, result.get(0).getStatus());
    }
    
    @Test
    @DisplayName("Should calculate total pending amount for user")
    void testGetUserTotalPendingAmount() {
        BigDecimal totalAmount = new BigDecimal("25.00");
        when(penaltyRepository.getTotalPendingAmountForUser(1L)).thenReturn(totalAmount);
        
        BigDecimal result = penaltyService.getUserTotalPendingAmount(1L);
        
        assertEquals(totalAmount, result);
    }
    
    @Test
    @DisplayName("Should allow borrow when no pending penalties")
    void testCanBorrow_NoPenalties() {
        when(penaltyRepository.getTotalPendingAmountForUser(1L))
            .thenReturn(BigDecimal.ZERO);
        
        boolean result = penaltyService.canBorrow(1L);
        
        assertTrue(result);
    }
    
    @Test
    @DisplayName("Should allow borrow when penalties < 100")
    void testCanBorrow_LowPenalties() {
        when(penaltyRepository.getTotalPendingAmountForUser(1L))
            .thenReturn(new BigDecimal("50.00"));
        
        boolean result = penaltyService.canBorrow(1L);
        
        assertTrue(result);
    }
    
    @Test
    @DisplayName("Should block borrow when penalties >= 100")
    void testCanBorrow_HighPenalties() {
        when(penaltyRepository.getTotalPendingAmountForUser(1L))
            .thenReturn(new BigDecimal("150.00"));
        
        boolean result = penaltyService.canBorrow(1L);
        
        assertFalse(result);
    }
    
    @Test
    @DisplayName("Should mark penalty as paid")
    void testPayPenalty() {
        when(penaltyRepository.findById(1L)).thenReturn(Optional.of(testPenalty));
        testPenalty.setStatus(Penalty.PenaltyStatus.PENDING);
        when(penaltyRepository.save(any(Penalty.class))).thenReturn(testPenalty);
        
        Penalty result = penaltyService.payPenalty(1L);
        
        assertEquals(Penalty.PenaltyStatus.PAID, result.getStatus());
        assertNotNull(result.getDatePaiement());
    }
    
    @Test
    @DisplayName("Should throw exception when paying non-pending penalty")
    void testPayPenalty_NotPending() {
        testPenalty.setStatus(Penalty.PenaltyStatus.PAID);
        when(penaltyRepository.findById(1L)).thenReturn(Optional.of(testPenalty));
        
        assertThrows(IllegalArgumentException.class, 
            () -> penaltyService.payPenalty(1L));
    }
    
    @Test
    @DisplayName("Should cancel penalty with reason")
    void testCancelPenalty() {
        String reason = "User was sick";
        when(penaltyRepository.findById(1L)).thenReturn(Optional.of(testPenalty));
        when(penaltyRepository.save(any(Penalty.class))).thenReturn(testPenalty);
        
        Penalty result = penaltyService.cancelPenalty(1L, reason);
        
        assertEquals(Penalty.PenaltyStatus.CANCELLED, result.getStatus());
        assertEquals(reason, result.getNotes());
    }
    
    @Test
    @DisplayName("Should waive penalty with reason")
    void testWaivePenalty() {
        String reason = "Library discount program";
        when(penaltyRepository.findById(1L)).thenReturn(Optional.of(testPenalty));
        when(penaltyRepository.save(any(Penalty.class))).thenReturn(testPenalty);
        
        Penalty result = penaltyService.waivePenalty(1L, reason);
        
        assertEquals(Penalty.PenaltyStatus.WAIVED, result.getStatus());
        assertEquals(reason, result.getNotes());
    }
}
