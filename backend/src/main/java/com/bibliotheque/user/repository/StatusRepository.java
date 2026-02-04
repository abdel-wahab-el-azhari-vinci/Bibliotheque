package com.bibliotheque.user.repository;

import com.bibliotheque.user.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour accéder à la table statuses.
 */
@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {

    /**
     * Cherche un statut par son nom
     *
     * @param name nom du statut
     * @return Optional contenant le statut s'il existe
     */
    Optional<Status> findByName(String name);
}
