package com.bibliotheque.book.mapper;

import com.bibliotheque.book.dto.AuteurResponse;
import com.bibliotheque.shared.entity.Auteur;
import org.springframework.stereotype.Component;

/**
 * Mapper AuteurMapper - Convertit Auteur Entity → DTO
 */
@Component
public class AuteurMapper {
    
    /**
     * Auteur Entity → AuteurResponse DTO
     */
    public AuteurResponse toResponse(Auteur auteur) {
        
        if (auteur == null) {
            return null;
        }
        
        return AuteurResponse.builder()
            .id(auteur.getId())
            .nom(auteur.getNom())
            .biographie(auteur.getBiographie())
            .dateNaissance(auteur.getDateNaissance())
            .dateDeces(auteur.getDateDeces())
            .paysNom(auteur.getPays() != null ? auteur.getPays().getNomPays() : null)
            .langueLibelle(auteur.getLangue() != null ? auteur.getLangue().getLibelle() : null)
            .build();
    }
}
