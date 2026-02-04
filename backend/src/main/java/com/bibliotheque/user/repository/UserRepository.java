package com.bibliotheque.user.repository;

import com.bibliotheque.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour accéder à la table users.
 * Spring Data JPA génère automatiquement les implémentations des méthodes.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Cherche un utilisateur par email
     * Utilisé pour le login et la validation d'unicité
     *
     * @param email l'email à chercher
     * @return Optional contenant l'utilisateur s'il existe
     */
    Optional<User> findByEmail(String email);

    /**
     * Vérifie si un email existe déjà
     * Utile pour la validation d'unicité
     *
     * @param email l'email à vérifier
     * @return true si l'email existe
     */
    boolean existsByEmail(String email);
}
