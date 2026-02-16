-- ============================================================================
-- INSERT DONNÉES DE TEST
-- ============================================================================

-- ============================================================================
-- ROLES
-- ============================================================================
INSERT INTO roles (name) VALUES
('ADMIN'),
('USER'),
('LIBRARIAN');

-- ============================================================================
-- STATUSES
-- ============================================================================
INSERT INTO statuses (name, libelle) VALUES
('ACTIF', 'Utilisateur actif'),
('INACTIF', 'Utilisateur inactif'),
('SUSPENDU', 'Compte suspendu');

-- ============================================================================
-- USERS
-- ============================================================================
-- Password: "password123" hashé en BCrypt
-- Hash: $2a$10$slYQmyNdGzin7olVN3p5Be9DWtkBVGtsDfFjH3vDMVc5aJKJrKMaO

INSERT INTO users (email, password, nom, prenom, role_id, status_id, date_inscription) VALUES
('admin@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be9DWtkBVGtsDfFjH3vDMVc5aJKJrKMaO', 'Dupont', 'Alice', 1, 1, NOW()),
('user@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be9DWtkBVGtsDfFjH3vDMVc5aJKJrKMaO', 'Martin', 'Bob', 2, 1, NOW()),
('librarian@test.com', '$2a$10$slYQmyNdGzin7olVN3p5Be9DWtkBVGtsDfFjH3vDMVc5aJKJrKMaO', 'Durand', 'Charlie', 3, 1, NOW());
