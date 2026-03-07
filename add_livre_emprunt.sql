-- ========================================
-- SCRIPT POUR AJOUTER UN LIVRE A EMPRUNTER
-- ========================================

USE bibliotheque;

-- 1. VERIFIER LES DONNEES DE BASE
SELECT 'Langues:' as info;
SELECT * FROM langue;

SELECT 'Genres:' as info;
SELECT * FROM genre;

SELECT 'Auteurs:' as info;
SELECT * FROM auteur;

-- 2. AJOUTER LE LIVRE
INSERT INTO livre (titre, isbn, date_publication, resume, genre_id, auteur_id, langue_id)
VALUES (
    'Le Hobbit',
    '978-2253048580',
    '1937-09-21',
    'Une aventure fantastique merveilleuse qui marque le commencement de l\'épopée de Frodon le Sacquet.',
    (SELECT id FROM genre WHERE libelle = 'Fantastique' LIMIT 1),
    (SELECT id FROM auteur WHERE nom = 'J.R.R. Tolkien' LIMIT 1),
    (SELECT id FROM langue WHERE code_iso = 'fr' LIMIT 1)
);

-- 3. AJOUTER UN UTILISATEUR S'IL N'EXISTE PAS
INSERT IGNORE INTO users (email, password, nom, prenom, rue, role_id, status_id)
VALUES (
    'utilisateur@bibliotheque.fr',
    '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', -- hash BCrypt
    'Test',
    'Utilisateur',
    '123 Rue de la Bibliothèque',
    (SELECT id FROM role WHERE name = 'USER' LIMIT 1),
    (SELECT id FROM status WHERE name = 'ACTIVE' LIMIT 1)
);

-- 4. CREER UNE POSSESSION POUR L'UTILISATEUR (LIVRE EN STOCK)
INSERT INTO possession (date_emprunt, date_retour, user_id, livre_id)
VALUES (
    DATE(NOW()),
    NULL,  -- NULL = Livre en stock, disponible pour emprunt
    (SELECT id FROM users WHERE email = 'utilisateur@bibliotheque.fr' LIMIT 1),
    (SELECT id FROM livre WHERE titre = 'Le Hobbit' LIMIT 1)
);

-- 5. VERIFIER LES RESULTATS
SELECT 'Livres disponibles:' as info;
SELECT l.id, l.titre, a.nom as auteur, g.libelle as genre
FROM livre l
LEFT JOIN auteur a ON l.auteur_id = a.id
LEFT JOIN genre g ON l.genre_id = g.id;

SELECT 'Possessions (en stock):' as info;
SELECT p.id, u.email, l.titre, p.date_emprunt, p.date_retour
FROM possession p
JOIN users u ON p.user_id = u.id
JOIN livre l ON p.livre_id = l.id
WHERE p.date_retour IS NULL;

SELECT 'SUCCESS: Livre ajouté et prêt à être emprunté!' as result;
