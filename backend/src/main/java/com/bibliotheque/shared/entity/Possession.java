package com.bibliotheque.shared.entity;
import com.bibliotheque.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Entity Possession - TABLE PIVOT CRITIQUE
 * Représente le stock et les mouvements d'un livre
 * Enregistre: quand le livre est entré, quand il est sorti
 * NULL dateRetour = Livre en stock (En stock) 
 * Non-NULL dateRetour = Livre sorti (Prêté/Donné)
 * 
 * Cette table est essentielle pour la gestion d'inventaire mobile
 */
@Entity
@Table(name = "possession")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Possession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "date_emprunt", nullable = false)
    private LocalDate dateEmprunt;
    
    @Column(name = "date_retour")
    private LocalDate dateRetour;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
    
    /**
     * Détermine si le livre est actuellement en stock
     * @return true si dateRetour est NULL
     */
    @JsonIgnore
    public boolean isEnStock() {
        return dateRetour == null;
    }
}
