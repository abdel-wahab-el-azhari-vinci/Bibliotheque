package com.bibliotheque.shared.entity;
import com.bibliotheque.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Entity Souhait - Liste de souhaits/envies
 * Permet aux utilisateurs de créer une liste des livres qu'ils veulent lire
 */
@Entity
@Table(name = "souhaits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Souhait {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "date_souhait")
    private LocalDate dateSouhait;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
}
