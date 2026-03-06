package com.bibliotheque.book.mapper;

import com.bibliotheque.book.dto.LivreRequest;
import com.bibliotheque.book.dto.LivreResponse;
import com.bibliotheque.shared.entity.Livre;
import org.springframework.stereotype.Component;

/**
 * Mapper LivreMapper - Convertit Entity ↔ DTO
 * 
 * Règle AI_RULES:
 * ✅ Conversion Entity → DTO (Jamais d'Entity au frontend)
 * ✅ Conversion DTO → Entity (pour les POST/PUT)
 * ❌ Pas de logique métier
 */
@Component
public class LivreMapper {
    
    /**
     * Convertir Livre Entity → LivreResponse DTO
     * Enrichi avec les libellés et données de stock
     */
    public LivreResponse toResponse(Livre livre, String statusStock, Integer nbExemplaires) {
        
        if (livre == null) {
            return null;
        }
        
        return LivreResponse.builder()
            .id(livre.getId())
            .titre(livre.getTitre())
            .isbn(livre.getIsbn())
            .resume(livre.getResume())
            .datePublication(livre.getDatePublication())
            
            .auteurId(livre.getAuteur() != null ? livre.getAuteur().getId() : null)
            .auteurNom(livre.getAuteur() != null ? livre.getAuteur().getNom() : null)
            
            .genreId(livre.getGenre() != null ? livre.getGenre().getId() : null)
            .genreLibelle(livre.getGenre() != null ? livre.getGenre().getLibelle() : null)
            
            .langueId(livre.getLangue() != null ? livre.getLangue().getId() : null)
            .langueLibelle(livre.getLangue() != null ? livre.getLangue().getLibelle() : null)
            
            .statusStock(statusStock)
            .nbExemplairesDisponibles(nbExemplaires)
            
            .build();
    }
    
    /**
     * Overload pour réponses simples sans stock
     */
    public LivreResponse toResponse(Livre livre) {
        return toResponse(livre, null, null);
    }
}
