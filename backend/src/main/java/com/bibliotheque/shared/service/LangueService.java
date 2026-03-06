package com.bibliotheque.shared.service;

import com.bibliotheque.shared.entity.Langue;
import com.bibliotheque.shared.repository.LangueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service LangueService
 * Logique métier pour les langues
 */
@Service
@Transactional
@RequiredArgsConstructor
public class LangueService {
    
    private final LangueRepository langueRepository;
    
    /**
     * Récupérer tous les langues
     */
    public List<Langue> getAllLangues() {
        return langueRepository.findAll();
    }
    
    /**
     * Récupérer une langue par ID
     */
    public Langue getLangueById(Long id) {
        return langueRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Langue non trouvée avec l'ID: " + id));
    }
}
