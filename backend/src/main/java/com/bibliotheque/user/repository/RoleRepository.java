package com.bibliotheque.user.repository;

import com.bibliotheque.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository pour accéder à la table roles.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Cherche un rôle par son nom
     *
     * @param name nom du rôle
     * @return Optional contenant le rôle s'il existe
     */
    Optional<Role> findByName(String name);
}
