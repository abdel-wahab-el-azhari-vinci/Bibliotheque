package com.bibliotheque.shared.service;
import com.bibliotheque.user.entity.User;

import com.bibliotheque.shared.entity.*;
import com.bibliotheque.shared.repository.*;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

/**
 * Service Possession - TABLE PIVOT CRITIQUE
 * Gère la logique de stock et les mouvements des livres dans Terra Sana
 * 
 * Logique d'inventaire:
 * - dateRetour = NULL → Livre EN STOCK (disponible)
 * - dateRetour != NULL → Livre SORTI (prêté, donné, etc.)
 * 
 * Cette classe est le cœur du projet d'inventaire mobile
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PossessionService {
    
    private final PossessionRepository possessionRepository;
    private final LivreRepository livreRepository;
    private final UserRepository userRepository;
    
    /**
     * Enregistrer un livre ENTRANT dans le stock
     * (Nouvel ouvrage reçu, donation, etc.)
     * 
     * @param livreId ID du livre
     * @param dateArrivee Date d'arrivée/emprunt
     * @return La possession enregistrée
     */
    public Possession addLivreToStock(Long livreId, LocalDate dateArrivee) {
        
        Livre livre = livreRepository.findById(livreId)
            .orElseThrow(() -> new RuntimeException("Livre non trouvé"));
        
        // Récupérer l'utilisateur admin/système
        // Pour simplifier: utiliser user ID 1 (à adapter selon votre besoin)
        User user = userRepository.findById(1L)
            .orElseThrow(() -> new RuntimeException("Utilisateur système non trouvé"));
        
        Possession possession = new Possession();
        possession.setLivre(livre);
        possession.setUser(user);
        possession.setDateEmprunt(dateArrivee != null ? dateArrivee : LocalDate.now());
        possession.setDateRetour(null); // NULL = EN STOCK
        
        return possessionRepository.save(possession);
    }
    
    /**
     * Marquer un livre comme SORTI du stock
     * (Prêt, donation, vente, destruction, etc.)
     * 
     * @param possessionId ID de la possession
     * @param dateSortie Date de sortie
     */
    public void markAsOut(Long possessionId, LocalDate dateSortie) {
        
        Possession possession = possessionRepository.findById(possessionId)
            .orElseThrow(() -> new RuntimeException("Possession non trouvée"));
        
        if (possession.getDateRetour() != null) {
            throw new RuntimeException("Ce livre est déjà sorti du stock");
        }
        
        if (dateSortie == null) {
            dateSortie = LocalDate.now();
        }
        
        // Vérifier que la date de sortie est après la date d'entrée
        if (dateSortie.isBefore(possession.getDateEmprunt())) {
            throw new RuntimeException("La date de sortie ne peut pas être avant la date d'arrivée");
        }
        
        possession.setDateRetour(dateSortie);
        possessionRepository.save(possession);
    }
    
    /**
     * Marquer un livre comme RETOURNÉ en stock
     * (Retour de prêt, etc.)
     */
    public void markAsReturned(Long possessionId, LocalDate dateRetour) {
        
        Possession possession = possessionRepository.findById(possessionId)
            .orElseThrow(() -> new RuntimeException("Possession non trouvée"));
        
        if (possession.getDateRetour() != null) {
            throw new RuntimeException("Ce livre est déjà marqué comme sorti");
        }
        
        if (dateRetour == null) {
            dateRetour = LocalDate.now();
        }
        
        possession.setDateRetour(null); // NULL = EN STOCK à nouveau
        possessionRepository.save(possession);
    }
    
    /**
     * Obtenir TOUS les livres actuellement EN STOCK
     * Scène mobile: affichage du catalogue disponible
     */
    public List<Possession> getAllEnStock() {
        return possessionRepository.findAllEnStock();
    }
    
    /**
     * Obtenir TOUS les livres actuellement SORTIS
     */
    public List<Possession> getAllSortis() {
        return possessionRepository.findAllSortis();
    }
    
    /**
     * Obtenir les livres EN STOCK d'un utilisateur spécifique
     */
    public List<Possession> getUserEnStock(Long userId) {
        return possessionRepository.findByUserIdEnStock(userId);
    }
    
    /**
     * Obtenir les livres SORTIS d'un utilisateur spécifique
     */
    public List<Possession> getUserSortis(Long userId) {
        return possessionRepository.findByUserIdSortis(userId);
    }
    
    /**
     * Déterminer le statut d'un livre (En stock / Sorti)
     * @return "EN_STOCK" ou "SORTI"
     */
    public String getStatus(Long livreId) {
        
        List<Possession> possessions = possessionRepository.findByLivreId(livreId);
        
        if (possessions.isEmpty()) {
            return "AUCUN_EXEMPLAIRE";
        }
        
        boolean hasAvailable = possessions.stream().anyMatch(p -> p.getDateRetour() == null);
        return hasAvailable ? "EN_STOCK" : "SORTI";
    }
    
    /**
     * Compter les exemplaires DISPONIBLES d'un livre
     */
    public int countAvailable(Long livreId) {
        return possessionRepository.countEnStock(livreId);
    }
    
    /**
     * Obtenir l'HISTORIQUE complet d'un livre
     * (tous les mouvements: entrées, sorties, retours)
     */
    public List<Possession> getFullHistory(Long livreId) {
        return possessionRepository.findByLivreId(livreId);
    }
}
