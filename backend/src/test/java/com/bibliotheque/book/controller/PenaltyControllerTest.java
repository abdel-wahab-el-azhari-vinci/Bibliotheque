package com.bibliotheque.book.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.service.PenaltyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

@WebMvcTest(PenaltyController.class)
@DisplayName("PenaltyController Tests")
class PenaltyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PenaltyService penaltyService;

    private Penalty testPenalty;

    @BeforeEach
    void setUp() {
        testPenalty = new Penalty();
        testPenalty.setId(1L);
        testPenalty.setStatus(Penalty.PenaltyStatus.PENDING);
        testPenalty.setMontantTotal(new BigDecimal("5.00"));
        testPenalty.setNombreJoursRetard(10);
    }

    @Test
    @DisplayName("GET /api/penalties/my-penalties - Should return user penalties")
    void testGetMyPenalties() throws Exception {
        List<Penalty> penalties = List.of(testPenalty);
        when(penaltyService.getUserPenalties(anyLong())).thenReturn(penalties);

        mockMvc.perform(
            get("/api/penalties/my-penalties")
                .header("Authorization", "Bearer token123")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    @DisplayName("GET /api/penalties/summary - Should return penalty summary")
    void testGetPenaltySummary() throws Exception {
        List<Penalty> pending = List.of(testPenalty);
        when(penaltyService.getUserPendingPenalties(anyLong())).thenReturn(pending);
        when(penaltyService.getUserTotalPendingAmount(anyLong()))
            .thenReturn(new BigDecimal("5.00"));
        when(penaltyService.canBorrow(anyLong())).thenReturn(true);

        mockMvc.perform(
            get("/api/penalties/summary")
                .header("Authorization", "Bearer token123")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.canBorrow").value(true));
    }

    @Test
    @DisplayName("GET /api/penalties/summary - Should show blocking status")
    void testGetPenaltySummary_Blocking() throws Exception {
        when(penaltyService.getUserTotalPendingAmount(anyLong()))
            .thenReturn(new BigDecimal("150.00"));
        when(penaltyService.canBorrow(anyLong())).thenReturn(false);

        mockMvc.perform(
            get("/api/penalties/summary")
                .header("Authorization", "Bearer token123")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.canBorrow").value(false));
    }

    @Test
    @DisplayName("GET /api/penalties/{id} - Should return penalty details")
    void testGetPenaltyDetails() throws Exception {
        when(penaltyService.getPenaltyDetails(1L)).thenReturn(testPenalty);

        mockMvc.perform(get("/api/penalties/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("POST /api/penalties/{id}/pay - Should mark penalty as paid")
    void testPayPenalty() throws Exception {
        testPenalty.setStatus(Penalty.PenaltyStatus.PAID);
        when(penaltyService.payPenalty(1L)).thenReturn(testPenalty);

        mockMvc.perform(
            post("/api/penalties/1/pay")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"penaltyId\": 1}")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("PAID"));
    }

    @Test
    @DisplayName("POST /api/penalties/{id}/cancel - Should cancel penalty")
    void testCancelPenalty() throws Exception {
        testPenalty.setStatus(Penalty.PenaltyStatus.CANCELLED);
        when(penaltyService.cancelPenalty(1L, "User sick"))
            .thenReturn(testPenalty);

        mockMvc.perform(
            post("/api/penalties/1/cancel?reason=User%20sick")
                .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("CANCELLED"));
    }
}
