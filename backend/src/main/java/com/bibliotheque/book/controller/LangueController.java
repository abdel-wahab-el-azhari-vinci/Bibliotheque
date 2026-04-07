package com.bibliotheque.book.controller;

import com.bibliotheque.shared.service.LangueService;
import com.bibliotheque.shared.entity.Langue;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller - Langues
 * Pour la dropdown "Sélectionner une langue"
 */
@RestController
@RequestMapping("/api/langues")
@RequiredArgsConstructor
public class LangueController {
    
    private final LangueService langueService;
    
    /**
     * GET /api/langues
     * Liste toutes les langues
     */
    @GetMapping
    public ResponseEntity<List<Langue>> getAllLangues() {
        List<Langue> langues = langueService.getAllLangues();
        return ResponseEntity.ok(langues);
    }
    
    /**
     * GET /api/langues/{id}
     * Détail d'une langue
     */
    @GetMapping("/{id}")
    public ResponseEntity<Langue> getLangueById(@PathVariable Long id) {
        Langue langue = langueService.getLangueById(id);
        return ResponseEntity.ok(langue);
    }
}
