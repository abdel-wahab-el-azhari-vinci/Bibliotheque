-- Insert default roles
INSERT IGNORE INTO roles (id, name, description) VALUES (1, 'ADMIN', 'Administrator - Accès complet');
INSERT IGNORE INTO roles (id, name, description) VALUES (2, 'USER', 'Utilisateur standard');
INSERT IGNORE INTO roles (id, name, description) VALUES (3, 'LIBRARIAN', 'Bibliothécaire - Gestion des livres');

-- Insert default statuses
INSERT IGNORE INTO statuses (id, name, description) VALUES (1, 'ACTIF', 'Utilisateur actif');
INSERT IGNORE INTO statuses (id, name, description) VALUES (2, 'INACTIF', 'Utilisateur inactif');
INSERT IGNORE INTO statuses (id, name, description) VALUES (3, 'SUSPENDU', 'Utilisateur suspendu');
