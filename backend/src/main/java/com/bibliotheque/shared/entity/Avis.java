package com.bibliotheque.shared.entity;
import com.bibliotheque.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity Avis - Avis et notes des utilisateurs
 * Permet aux utilisateurs de laisser des commentaires sur les livres
 */
@Entity
@Table(name = "avis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "commentaire", columnDefinition = "LONGTEXT")
    private String commentaire;
    
    @Column(name = "note")
    private Integer note;
    
    @Column(name = "date_avis", nullable = false)
    private LocalDateTime dateAvis;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
}
