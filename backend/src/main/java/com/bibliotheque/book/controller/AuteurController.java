package com.bibliotheque.book.controller;

import com.bibliotheque.book.dto.AuteurResponse;
import com.bibliotheque.book.mapper.AuteurMapper;
import com.bibliotheque.shared.service.AuteurService;
import com.bibliotheque.shared.entity.Auteur;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST API Controller - Auteurs
 * Pour la dropdown "Sélectionner un auteur" et l'affichage de profils
 */
@RestController
@RequestMapping("/api/auteurs")
@RequiredArgsConstructor
public class AuteurController {
    
    private final AuteurService auteurService;
    private final AuteurMapper auteurMapper;
    
    /**
     * GET /api/auteurs
     * Liste tous les auteurs (pour dropdown)
     */
    @GetMapping
    public ResponseEntity<List<AuteurResponse>> getAllAuteurs() {
        List<Auteur> auteurs = auteurService.getAllAuteurs();
        
        List<AuteurResponse> responses = auteurs.stream()
            .map(auteurMapper::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * GET /api/auteurs/{id}
     * Détail d'un auteur
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuteurResponse> getAuteurById(@PathVariable Long id) {
        Auteur auteur = auteurService.getAuteurById(id);
        AuteurResponse response = auteurMapper.toResponse(auteur);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/auteurs/search?nom=...
     * Recherche d'auteurs par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<AuteurResponse>> searchAuteurs(@RequestParam String nom) {
        List<Auteur> auteurs = auteurService.searchByNom(nom);
        
        List<AuteurResponse> responses = auteurs.stream()
            .map(auteurMapper::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}
