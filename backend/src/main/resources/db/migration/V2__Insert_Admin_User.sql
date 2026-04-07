-- Insert admin user
INSERT IGNORE INTO users (id, email, password, nom, prenom, rue, role_id, status_id)
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
