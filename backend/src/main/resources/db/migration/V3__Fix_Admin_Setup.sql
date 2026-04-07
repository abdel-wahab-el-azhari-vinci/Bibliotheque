-- Fix: Nettoyer et réinsérer les données admin
DELETE FROM users WHERE id = 1;
DELETE FROM statuses WHERE id IN (1, 2, 3);
DELETE FROM roles WHERE id IN (1, 2, 3);

-- Insert roles
INSERT INTO roles (id, name, description) VALUES (1, 'ADMIN', 'Administrator');
INSERT INTO roles (id, name, description) VALUES (2, 'USER', 'User');
INSERT INTO roles (id, name, description) VALUES (3, 'LIBRARIAN', 'Librarian');

-- Insert statuses
INSERT INTO statuses (id, name, description) VALUES (1, 'ACTIF', 'Active');
INSERT INTO statuses (id, name, description) VALUES (2, 'INACTIF', 'Inactive');
INSERT INTO statuses (id, name, description) VALUES (3, 'SUSPENDU', 'Suspended');

-- Insert admin user
INSERT INTO users (id, email, password, nom, prenom, rue, role_id, status_id)
VALUES (
    1,
    'admin@bibliotheque.com',
    '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy1Z5xa',
    'Admin',
    'Système',
    'N/A',
    1,
    1
);
