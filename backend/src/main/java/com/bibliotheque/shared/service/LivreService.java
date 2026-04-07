package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.*;
import com.bibliotheque.shared.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Service LivreService
 * Logique métier pour les livres
 */
@Service
@Transactional
@RequiredArgsConstructor
public class LivreService {
    
    private final LivreRepository livreRepository;
    private final AuteurRepository auteurRepository;
    private final GenreRepository genreRepository;
    private final LangueRepository langueRepository;
    private final PossessionRepository possessionRepository;
    
    /**
     * Récupérer tous les livres
     */
    public List<Livre> getAllLivres() {
        return livreRepository.findAll();
    }
    
    /**
     * Récupérer un livre par ID
     */
    public Livre getLivreById(Long id) {
        return livreRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Livre non trouvé avec l'ID: " + id));
    }
    
    /**
     * Recherche par titre
     */
    public List<Livre> searchByTitre(String titre) {
        return livreRepository.findByTitreContainingIgnoreCase(titre);
    }
    
    /**
     * Recherche par auteur (par nom)
     */
    public List<Livre> searchByAuteur(String nomAuteur) {
        return livreRepository.findByAuteur(nomAuteur);
    }
    
    /**
     * Recherche par genre
     */
    public List<Livre> searchByGenre(Long genreId) {
        return livreRepository.findByGenreId(genreId);
    }
    
    /**
     * Recherche par langue
     */
    public List<Livre> searchByLangue(Long langueId) {
        return livreRepository.findByLangueId(langueId);
    }
    
    /**
     * Recherche simple (une seule chaîne)
     */
    public List<Livre> searchSimple(String search) {
        return livreRepository.searchLivres(search);
    }
    
    /**
     * Recherche avancée avec plusieurs critères
     * Combine les résultats de différentes recherches
     */
    public List<Livre> searchLivresAvances(String titre, Long auteurId, Long genreId, Long langueId) {
        List<Livre> resultats = getAllLivres();
        
        if (titre != null && !titre.isBlank()) {
            List<Livre> parTitre = searchByTitre(titre);
            resultats = resultats.stream()
                .filter(parTitre::contains)
                .collect(Collectors.toList());
        }
        
        if (genreId != null) {
            List<Livre> parGenre = searchByGenre(genreId);
            resultats = resultats.stream()
                .filter(parGenre::contains)
                .collect(Collectors.toList());
        }
        
        if (langueId != null) {
            List<Livre> parLangue = searchByLangue(langueId);
            resultats = resultats.stream()
                .filter(parLangue::contains)
                .collect(Collectors.toList());
        }
        
        return resultats;
    }
    
    /**
     * Créer un nouveau livre
     */
    public Livre createLivre(String titre, Long auteurId, Long genreId, Long langueId,
                            String isbn, String resume, LocalDate datePublication) {
        
        // Validation
        if (titre == null || titre.isBlank()) {
            throw new IllegalArgumentException("Le titre est obligatoire");
        }
        
        if (isbn != null && !isbn.isBlank() && livreRepository.findByIsbn(isbn).isPresent()) {
            throw new IllegalArgumentException("Un livre avec cet ISBN existe déjà");
        }
        
        // Vérifier l'existence des relations
        Auteur auteur = auteurRepository.findById(auteurId)
            .orElseThrow(() -> new NoSuchElementException("Auteur non trouvé"));
        
        Genre genre = genreRepository.findById(genreId)
            .orElseThrow(() -> new NoSuchElementException("Genre non trouvé"));
        
        Langue langue = langueRepository.findById(langueId)
            .orElseThrow(() -> new NoSuchElementException("Langue non trouvée"));
        
        // Créer le livre
        Livre livre = new Livre();
        livre.setTitre(titre);
        livre.setIsbn(isbn);
        livre.setResume(resume);
        livre.setDatePublication(datePublication);
        livre.setAuteur(auteur);
        livre.setGenre(genre);
        livre.setLangue(langue);
        
        return livreRepository.save(livre);
    }
    
    /**
     * Mettre à jour un livre
     */
    public Livre updateLivre(Long id, String titre, Long auteurId, Long genreId, Long langueId,
                            String isbn, String resume, LocalDate datePublication) {
        
        Livre livre = getLivreById(id);
        
        if (titre != null && !titre.isBlank()) {
            livre.setTitre(titre);
        }
        
        if (isbn != null && !isbn.isBlank()) {
            if (!isbn.equals(livre.getIsbn()) && livreRepository.findByIsbn(isbn).isPresent()) {
                throw new IllegalArgumentException("Un livre avec cet ISBN existe déjà");
            }
            livre.setIsbn(isbn);
        }
        
        if (resume != null) {
            livre.setResume(resume);
        }
        
        if (datePublication != null) {
            livre.setDatePublication(datePublication);
        }
        
        if (auteurId != null) {
            Auteur auteur = auteurRepository.findById(auteurId)
                .orElseThrow(() -> new NoSuchElementException("Auteur non trouvé"));
            livre.setAuteur(auteur);
        }
        
        if (genreId != null) {
            Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new NoSuchElementException("Genre non trouvé"));
            livre.setGenre(genre);
        }
        
        if (langueId != null) {
            Langue langue = langueRepository.findById(langueId)
                .orElseThrow(() -> new NoSuchElementException("Langue non trouvée"));
            livre.setLangue(langue);
        }
        
        return livreRepository.save(livre);
    }
    
    /**
     * Supprimer un livre (seulement si aucune possession)
     */
    public void deleteLivre(Long id) {
        Livre livre = getLivreById(id);
        
        // Vérifier s'il y a des possessions
        List<Possession> possessions = possessionRepository.findByLivreId(id);
        if (!possessions.isEmpty()) {
            throw new IllegalStateException("Impossible de supprimer un livre ayant des exemplaires");
        }
        
        livreRepository.delete(livre);
    }
    
    /**
     * Vérifier si un livre est disponible
     */
    public boolean isLivreDisponible(Long livreId) {
        return possessionRepository.isLivreEnStock(livreId);
    }
    
    /**
     * Compter les exemplaires en stock
     */
    public Integer countEnStock(Long livreId) {
        return possessionRepository.countEnStock(livreId);
    }
}
