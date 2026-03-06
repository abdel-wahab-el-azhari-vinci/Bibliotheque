package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.shared.repository.PossessionRepository;
import com.bibliotheque.shared.repository.LivreRepository;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service PossessionService
 * Gestion de l'inventaire (stock de livres)
 * 
 * CRITICAL: Possession = exemplaire physique d'un Livre
 * Logique: dateRetour = NULL → EN_STOCK | dateRetour != NULL → SORTI
 */
@Service
@Transactional
@RequiredArgsConstructor
public class PossessionService {
    
    private final PossessionRepository possessionRepository;
    private final LivreRepository livreRepository;
    private final UserRepository userRepository;
    
    /**
     * Ajouter un exemplaire au stock
     */
    public Possession addLivreToStock(Long livreId, Long userId) {
        Livre livre = livreRepository.findById(livreId)
            .orElseThrow(() -> new NoSuchElementException("Livre non trouvé"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouvé"));
        
        Possession possession = new Possession();
        possession.setLivre(livre);
        possession.setUser(user);
        possession.setDateEmprunt(LocalDate.now());
        possession.setDateRetour(null); // En stock
        
        return possessionRepository.save(possession);
    }
    
    /**
     * Marquer un livre comme sorti/emprunté
     */
    public Possession markAsOut(Long possessionId, LocalDate dateRetour) {
        Possession possession = possessionRepository.findById(possessionId)
            .orElseThrow(() -> new NoSuchElementException("Possession non trouvée"));
        
        possession.setDateRetour(dateRetour != null ? dateRetour : LocalDate.now());
        return possessionRepository.save(possession);
    }
    
    /**
     * Marquer un livre comme retourné
     */
    public Possession markAsReturned(Long possessionId) {
        Possession possession = possessionRepository.findById(possessionId)
            .orElseThrow(() -> new NoSuchElementException("Possession non trouvée"));
        
        if (possession.getDateRetour() != null) {
            throw new IllegalStateException("Ce livre est déjà marqué comme retourné");
        }
        
        possession.setDateRetour(LocalDate.now());
        return possessionRepository.save(possession);
    }
    
    /**
     * Récupérer tous les livres EN STOCK
     */
    public List<Possession> getAllEnStock() {
        return possessionRepository.findAllEnStock();
    }
    
    /**
     * Récupérer tous les livres SORTIS
     */
    public List<Possession> getAllSortis() {
        return possessionRepository.findAllSortis();
    }
    
    /**
     * Récupérer l'historique complet des mouvements
     */
    public List<Possession> getFullHistory(Long livreId) {
        return possessionRepository.findByLivreId(livreId);
    }
    
    /**
     * Récupérer le statut d'un livre
     */
    public String getStatus(Long livreId) {
        if (possessionRepository.isLivreEnStock(livreId)) {
            return "EN_STOCK";
        } else if (possessionRepository.findByLivreId(livreId).isEmpty()) {
            return "AUCUN_EXEMPLAIRE";
        } else {
            return "SORTI";
        }
    }
    
    /**
     * Compter les exemplaires disponibles
     */
    public Integer countAvailable(Long livreId) {
        return possessionRepository.countEnStock(livreId);
    }
    
    /**
     * Vérifier si un livre est en stock
     */
    public boolean isLivreEnStock(Long livreId) {
        return possessionRepository.isLivreEnStock(livreId);
    }
}
