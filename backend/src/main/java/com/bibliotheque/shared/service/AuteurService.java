package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.Auteur;
import com.bibliotheque.shared.repository.AuteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service Auteur - Gestion des auteurs
 * Permet la création, modification et recherche des auteurs
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuteurService {
    
    private final AuteurRepository auteurRepository;
    
    /**
     * Récupérer tous les auteurs
     */
    public List<Auteur> getAllAuteurs() {
        return auteurRepository.findAll();
    }
    
    /**
     * Récupérer un auteur par ID
     */
    public Auteur getAuteurById(Long id) {
        return auteurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Auteur non trouvé avec ID: " + id));
    }
    
    /**
     * Rechercher par nom
     */
    public List<Auteur> searchByNom(String nom) {
        if (nom == null || nom.isBlank()) {
            return List.of();
        }
        return auteurRepository.findByNomContainingIgnoreCase(nom);
    }
    
    /**
     * Créer un nouvel auteur
     */
    public Auteur createAuteur(String nom) {
        if (nom == null || nom.isBlank()) {
            throw new RuntimeException("Le nom de l'auteur est obligatoire");
        }
        
        if (auteurRepository.existsByNom(nom)) {
            throw new RuntimeException("Un auteur avec ce nom existe déjà");
        }
        
        Auteur auteur = new Auteur();
        auteur.setNom(nom);
        return auteurRepository.save(auteur);
    }
}
