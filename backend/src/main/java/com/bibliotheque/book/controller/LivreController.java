package com.bibliotheque.book.controller;

import com.bibliotheque.book.dto.LivreRequest;
import com.bibliotheque.book.dto.LivreResponse;
import com.bibliotheque.book.mapper.LivreMapper;
import com.bibliotheque.shared.service.LivreService;
import com.bibliotheque.shared.service.PossessionService;
import com.bibliotheque.shared.entity.Livre;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST API Controller - Gestion des Livres
 * 
 * Règles d'or (AI_RULES):
 * ✅ Jamais d'Entité en retour (toujours LivreResponse DTO)
 * ✅ Une seule responsabilité: HTTP (pas de logique métier)
 * ✅ Appel aux Services pour ALL la logique
 * ✅ Validation avec @Valid sur @RequestBody
 */
@RestController
@RequestMapping("/api/livres")
@RequiredArgsConstructor
public class LivreController {
    
    private final LivreService livreService;
    private final PossessionService possessionService;
    private final LivreMapper livreMapper;
    
    /**
     * GET /api/livres
     * Liste tous les livres avec leur statut de stock
     */
    @GetMapping
    public ResponseEntity<List<LivreResponse>> getAllLivres() {
        List<Livre> livres = livreService.getAllLivres();
        
        List<LivreResponse> responses = livres.stream()
            .map(livre -> {
                String status = possessionService.getStatus(livre.getId());
                Integer nbExemplaires = possessionService.countAvailable(livre.getId());
                return livreMapper.toResponse(livre, status, nbExemplaires);
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * GET /api/livres/{id}
     * Détail d'un livre spécifique avec disponibilité
     */
    @GetMapping("/{id}")
    public ResponseEntity<LivreResponse> getLivreById(@PathVariable Long id) {
        Livre livre = livreService.getLivreById(id);
        
        String status = possessionService.getStatus(livre.getId());
        Integer nbExemplaires = possessionService.countAvailable(livre.getId());
        
        LivreResponse response = livreMapper.toResponse(livre, status, nbExemplaires);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/livres/search?titre=...&auteur=...&genre=...
     * Recherche avancée sur titre, auteur, genre
     */
    @GetMapping("/search")
    public ResponseEntity<List<LivreResponse>> searchLivres(
        @RequestParam(required = false) String titre,
        @RequestParam(required = false) Long auteurId,
        @RequestParam(required = false) Long genreId,
        @RequestParam(required = false) Long langueId
    ) {
        List<Livre> livres;
        
        if (titre != null || auteurId != null || genreId != null || langueId != null) {
            livres = livreService.searchLivresAvances(titre, auteurId, genreId, langueId);
        } else {
            livres = livreService.getAllLivres();
        }
        
        List<LivreResponse> responses = livres.stream()
            .map(livre -> {
                String status = possessionService.getStatus(livre.getId());
                Integer nbExemplaires = possessionService.countAvailable(livre.getId());
                return livreMapper.toResponse(livre, status, nbExemplaires);
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * POST /api/livres
     * Créer un nouveau livre (Admin/Librarian uniquement)
     * ✅ @Valid déclenche les validations du DTO
     */
    @PostMapping
    public ResponseEntity<LivreResponse> createLivre(@Valid @RequestBody LivreRequest request) {
        
        Livre livre = livreService.createLivre(
            request.getTitre(),
            request.getAuteurId(),
            request.getGenreId(),
            request.getLangueId(),
            request.getIsbn(),
            request.getResume(),
            request.getDatePublication()
        );
        
        LivreResponse response = livreMapper.toResponse(livre, "AUCUN_EXEMPLAIRE", 0);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * PATCH /api/livres/{id}
     * Mettre à jour un livre existant
     */
    @PatchMapping("/{id}")
    public ResponseEntity<LivreResponse> updateLivre(
        @PathVariable Long id,
        @Valid @RequestBody LivreRequest request
    ) {
        Livre livre = livreService.updateLivre(
            id,
            request.getTitre(),
            request.getAuteurId(),
            request.getGenreId(),
            request.getLangueId(),
            request.getIsbn(),
            request.getResume(),
            request.getDatePublication()
        );
        
        String status = possessionService.getStatus(livre.getId());
        Integer nbExemplaires = possessionService.countAvailable(livre.getId());
        
        LivreResponse response = livreMapper.toResponse(livre, status, nbExemplaires);
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/livres/{id}
     * Supprimer un livre (si aucune possession)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable Long id) {
        livreService.deleteLivre(id);
        return ResponseEntity.noContent().build();
    }
}
