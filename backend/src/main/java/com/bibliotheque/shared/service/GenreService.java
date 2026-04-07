package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.Genre;
import com.bibliotheque.shared.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service GenreService
 * Logique métier pour les genres
 */
@Service
@Transactional
@RequiredArgsConstructor
public class GenreService {
    
    private final GenreRepository genreRepository;
    
    /**
     * Récupérer tous les genres
     */
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
    
    /**
     * Récupérer un genre par ID
     */
    public Genre getGenreById(Long id) {
        return genreRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Genre non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer genres par catégorie
     */
    public List<Genre> getGenresByCategorie(Long categorieId) {
        return genreRepository.findByCategorie_Id(categorieId);
    }
}
