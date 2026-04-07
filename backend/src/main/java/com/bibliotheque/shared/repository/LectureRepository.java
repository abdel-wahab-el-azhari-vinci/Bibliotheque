package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour Lecture - Historique des lectures
 */
@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    
    /**
     * Historique de lecture d'un utilisateur
     */
    List<Lecture> findByUserId(Long userId);
    
    /**
     * Historique de lecture d'un livre
     */
    List<Lecture> findByLivreId(Long livreId);
}
