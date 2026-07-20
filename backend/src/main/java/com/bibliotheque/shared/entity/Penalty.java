package com.bibliotheque.shared.entity;

import com.bibliotheque.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity Penalty - Amendes pour retard de retour
 * 
 * LOGIQUE:
 * - Quand un livre est retourné en retard (dateRetour > dateExpiration)
 * - On crée une Penalty automatiquement
 * - Le montant = (jours de retard) * (tarif journalier)
 * - Status: PENDING → PAID / CANCELLED
 */
@Entity
@Table(name = "penalties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Penalty {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Qui a la pénalité
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Quel livre
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
    
    // Lien avec l'emprunt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "possession_id", nullable = false)
    private Possession possession;
    
    // Dates
    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;
    
    @Column(name = "date_expiration_emprunt", nullable = false)
    private LocalDate dateExpirationEmprunt;  // Quand le livre devait être retourné
    
    @Column(name = "date_retour_actual")
    private LocalDate dateRetourActual;  // Quand il a été réellement retourné
    
    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;
    
    // Calculs
    @Column(name = "nombre_jours_retard")
    private Integer nombreJoursRetard;  // Nombre de jours de retard
    
    @Column(name = "tarif_journalier", nullable = false)
    private BigDecimal tarifJournalier;  // Tarif par jour (par défaut 0.50€)
    
    @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;  // Montant total = jours * tarif
    
    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PenaltyStatus status;  // PENDING, PAID, CANCELLED, WAIVED
    
    // Notes (si annulée/remise)
    @Column(name = "notes", columnDefinition = "LONGTEXT")
    private String notes;
    
    /**
     * Enum pour les statuts de pénalité
     */
    public enum PenaltyStatus {
        PENDING,      // En attente de paiement
        PAID,         // Payée
        CANCELLED,    // Annulée (admin)
        WAIVED        // Remise (admin excuse)
    }
}
