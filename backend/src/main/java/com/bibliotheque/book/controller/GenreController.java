package com.bibliotheque.book.controller;

import com.bibliotheque.book.dto.GenreResponse;
import com.bibliotheque.book.mapper.GenreMapper;
import com.bibliotheque.shared.service.GenreService;
import com.bibliotheque.shared.entity.Genre;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST API Controller - Genres
 * Pour la dropdown "Sélectionner un genre" et les filtres
 */
@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {
    
    private final GenreService genreService;
    private final GenreMapper genreMapper;
    
    /**
     * GET /api/genres
     * Liste tous les genres (pour filtre/dropdown)
     */
    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres() {
        List<Genre> genres = genreService.getAllGenres();
        
        List<GenreResponse> responses = genres.stream()
            .map(genreMapper::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * GET /api/genres/{id}
     * Détail d'un genre
     */
    @GetMapping("/{id}")
    public ResponseEntity<GenreResponse> getGenreById(@PathVariable Long id) {
        Genre genre = genreService.getGenreById(id);
        GenreResponse response = genreMapper.toResponse(genre);
        return ResponseEntity.ok(response);
    }
}
