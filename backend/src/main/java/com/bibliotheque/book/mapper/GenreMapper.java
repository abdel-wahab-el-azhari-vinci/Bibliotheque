package com.bibliotheque.book.mapper;

import com.bibliotheque.book.dto.GenreResponse;
import com.bibliotheque.shared.entity.Genre;
import org.springframework.stereotype.Component;

/**
 * Mapper GenreMapper - Convertit Genre Entity → DTO
 */
@Component
public class GenreMapper {
    
    /**
     * Genre Entity → GenreResponse DTO
     */
    public GenreResponse toResponse(Genre genre) {
        
        if (genre == null) {
            return null;
        }
        
        return GenreResponse.builder()
            .id(genre.getId())
            .libelle(genre.getLibelle())
            .categorieId(genre.getCategorie() != null ? genre.getCategorie().getId() : null)
            .categorieLibelle(genre.getCategorie() != null ? genre.getCategorie().getLibelle() : null)
            .build();
    }
}
