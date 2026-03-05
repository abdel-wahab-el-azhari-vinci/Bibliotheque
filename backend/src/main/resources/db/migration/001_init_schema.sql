-- ============================================================================
-- TERRA SANA - SCHÉMA COMPLET 16 TABLES
-- ============================================================================

-- ============================================================================
-- NIVEAU 0 : TABLES INDÉPENDANTES (Aucune clé étrangère)
-- ============================================================================

DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_roles_name ON roles(name);

DROP TABLE IF EXISTS statuses;
CREATE TABLE statuses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_statuses_name ON statuses(name);

DROP TABLE IF EXISTS pays;
CREATE TABLE pays (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom_pays VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS commune;
CREATE TABLE commune (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom_commune VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS code_postal;
CREATE TABLE code_postal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code_postal VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS langue;
CREATE TABLE langue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    code_iso VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS categorie;
CREATE TABLE categorie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NIVEAU 1 : DÉPENDENT DES TABLES INDÉPENDANTES
-- ============================================================================

DROP TABLE IF EXISTS genre;
CREATE TABLE genre (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    categorie_id BIGINT,
    CONSTRAINT fk_genre_categorie FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS auteur;
CREATE TABLE auteur (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    biographie TEXT,
    date_naissance DATE,
    date_deces DATE,
    pays_id BIGINT,
    langue_id BIGINT,
    CONSTRAINT fk_auteur_pays FOREIGN KEY (pays_id) REFERENCES pays(id) ON DELETE SET NULL,
    CONSTRAINT fk_auteur_langue FOREIGN KEY (langue_id) REFERENCES langue(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NIVEAU 2 : UTILISATEUR ET LIVRE
-- ============================================================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    rue VARCHAR(255),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_connexion TIMESTAMP NULL,
    
    role_id BIGINT NOT NULL,
    status_id BIGINT NOT NULL,
    code_postal_id BIGINT,
    commune_id BIGINT,
    pays_id BIGINT,
    langue_id BIGINT,
    
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_status FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_code_postal FOREIGN KEY (code_postal_id) REFERENCES code_postal(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_commune FOREIGN KEY (commune_id) REFERENCES commune(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_pays FOREIGN KEY (pays_id) REFERENCES pays(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_langue FOREIGN KEY (langue_id) REFERENCES langue(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status_id ON users(status_id);

DROP TABLE IF EXISTS livre;
CREATE TABLE livre (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    date_publication DATE,
    resume TEXT,
    genre_id BIGINT,
    auteur_id BIGINT,
    langue_id BIGINT,
    CONSTRAINT fk_livre_genre FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE SET NULL,
    CONSTRAINT fk_livre_auteur FOREIGN KEY (auteur_id) REFERENCES auteur(id) ON DELETE SET NULL,
    CONSTRAINT fk_livre_langue FOREIGN KEY (langue_id) REFERENCES langue(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_livre_isbn ON livre(isbn);
CREATE INDEX idx_livre_genre_id ON livre(genre_id);

DROP TABLE IF EXISTS auteur_genre;
CREATE TABLE auteur_genre (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auteur_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    CONSTRAINT fk_auteur_genre_auteur FOREIGN KEY (auteur_id) REFERENCES auteur(id) ON DELETE CASCADE,
    CONSTRAINT fk_auteur_genre_genre FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX idx_auteur_genre_unique ON auteur_genre(auteur_id, genre_id);

DROP TABLE IF EXISTS future_parutions;
CREATE TABLE future_parutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date_sortie DATE,
    resume TEXT,
    auteur_id BIGINT,
    CONSTRAINT fk_future_parutions_auteur FOREIGN KEY (auteur_id) REFERENCES auteur(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NIVEAU 3 : TABLES DE LIAISON (USER + LIVRE)
-- ============================================================================

DROP TABLE IF EXISTS possession;
CREATE TABLE possession (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_emprunt DATE NOT NULL,
    date_retour DATE,
    user_id BIGINT NOT NULL,
    livre_id BIGINT NOT NULL,
    CONSTRAINT fk_possession_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_possession_livre FOREIGN KEY (livre_id) REFERENCES livre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_possession_user_id ON possession(user_id);
CREATE INDEX idx_possession_livre_id ON possession(livre_id);

DROP TABLE IF EXISTS avis;
CREATE TABLE avis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    commentaire TEXT,
    note INT,
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    livre_id BIGINT NOT NULL,
    CONSTRAINT fk_avis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_avis_livre FOREIGN KEY (livre_id) REFERENCES livre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS lectures;
CREATE TABLE lectures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_lecture DATE,
    user_id BIGINT NOT NULL,
    livre_id BIGINT NOT NULL,
    CONSTRAINT fk_lectures_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lectures_livre FOREIGN KEY (livre_id) REFERENCES livre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS souhaits;
CREATE TABLE souhaits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_souhait DATE DEFAULT CURDATE(),
    user_id BIGINT NOT NULL,
    livre_id BIGINT NOT NULL,
    CONSTRAINT fk_souhaits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_souhaits_livre FOREIGN KEY (livre_id) REFERENCES livre(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FIN SCHÉMA - 16 TABLES TERRA SANA
-- ============================================================================
