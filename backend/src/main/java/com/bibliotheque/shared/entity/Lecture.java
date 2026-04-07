package com.bibliotheque.shared.entity;
import com.bibliotheque.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Entity Lecture - Historique des lectures
 * Enregistre quand un utilisateur a lu un livre
 */
@Entity
@Table(name = "lectures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "date_lecture")
    private LocalDate dateLecture;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
}
