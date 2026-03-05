-- ============================================================================
-- DONNÉES DE BASE TERRA SANA
-- ============================================================================

-- ============================================================================
-- ROLES (Rôles utilisateur)
-- ============================================================================
INSERT INTO roles (name, libelle) VALUES 
('ADMIN', 'Administrateur'),
('LIBRARIAN', 'Bibliothécaire'),
('USER', 'Utilisateur');

-- ============================================================================
-- STATUSES (Statuts utilisateur)
-- ============================================================================
INSERT INTO statuses (name, libelle) VALUES 
('ACTIVE', 'Actif'),
('INACTIVE', 'Inactif'),
('SUSPENDED', 'Suspendu');

-- ============================================================================
-- PAYS
-- ============================================================================
INSERT INTO pays (nom_pays) VALUES 
('Belgique'),
('France'),
('Suisse'),
('Allemagne'),
('Pays-Bas');

-- ============================================================================
-- COMMUNE
-- ============================================================================
INSERT INTO commune (nom_commune) VALUES 
('Bruxelles'),
('Anvers'),
('Gand'),
('Liège'),
('Charleroi');

-- ============================================================================
-- CODE_POSTAL
-- ============================================================================
INSERT INTO code_postal (code_postal) VALUES 
('1000'),
('1040'),
('2000'),
('4000'),
('6000');

-- ============================================================================
-- LANGUE
-- ============================================================================
INSERT INTO langue (libelle, code_iso) VALUES 
('Français', 'fr'),
('Anglais', 'en'),
('Néerlandais', 'nl'),
('Allemand', 'de'),
('Espagnol', 'es');

-- ============================================================================
-- CATÉGORIE
-- ============================================================================
INSERT INTO categorie (libelle) VALUES 
('Fiction'),
('Science-Fiction'),
('Roman Policier'),
('Jeunesse'),
('Documentaire'),
('Histoire'),
('Biographie'),
('Technologie');

-- ============================================================================
-- GENRE
-- ============================================================================
INSERT INTO genre (libelle, categorie_id) VALUES 
('Thriller', 3),
('Fantasy', 1),
('Science-Fiction', 2),
('Conte', 4),
('Essai', 5),
('Mémoires', 7),
('Informatique', 8);

-- ============================================================================
-- AUTEUR
-- ============================================================================
INSERT INTO auteur (nom, biographie, date_naissance, pays_id, langue_id) VALUES 
('Agatha Christie', 'Célèbre auteure britannique de romans policicers', '1890-01-15', 1, 2),
('Jules Verne', 'Écrivain français précurseur de la science-fiction', '1828-02-08', 2, 1),
('Victor Hugo', 'Ecrivain français du 19e siècle', '1802-02-26', 2, 1),
('Isaac Asimov', 'Auteur et professeur de science-fiction', '1920-01-02', 4, 2);

-- ============================================================================
-- LIVRE
-- ============================================================================
INSERT INTO livre (titre, isbn, date_publication, resume, genre_id, auteur_id, langue_id) VALUES 
('Meurtre sur le Nil', '978-2-253-04435-5', '1937-12-01', 'Un roman policier captivant', 1, 1, 1),
('Vingt Mille Lieues sous les mers', '978-2-253-07752-1', '1870-06-01', 'Une aventure océanique extraordinaire', 3, 2, 1),
('Les Misérables', '978-2-07-036269-8', '1862-04-03', 'L\'épopée de Jean Valjean', 5, 3, 1),
('Foundation', '0-553-29438-0', '1951-06-01', 'La science-fiction moderne commence ici', 3, 4, 2);

-- ============================================================================
-- UTILISATEUR DE TEST
-- ============================================================================
-- Password: test123 (hash bcrypt: $2a$10$SlVZQkVWTmZaVE1Oab9He.jrwO2kLDtbVSnAefl/AetSmL0S65Tm2)
INSERT INTO users (email, password, nom, prenom, rue, role_id, status_id, code_postal_id, commune_id, pays_id, langue_id) VALUES 
('test@terra-sana.be', '$2a$10$SlVZQkVWTmZaVE1Oab9He.jrwO2kLDtbVSnAefl/AetSmL0S65Tm2', 'Test', 'User', '14 rue Joseph Buedts', 1, 1, 2, 1, 1, 1);

-- ============================================================================
-- POSSESSION (Stock)
-- ============================================================================
INSERT INTO possession (date_emprunt, date_retour, user_id, livre_id) VALUES 
('2026-01-15', NULL, 1, 1),
('2026-01-10', '2026-03-01', 1, 2),
('2026-02-20', NULL, 1, 3),
('2026-01-05', NULL, 1, 4);

-- ============================================================================
-- FIN DONNÉES DE BASE
-- ============================================================================
