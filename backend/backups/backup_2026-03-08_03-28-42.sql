
-- Table: auteur
DROP TABLE IF EXISTS `auteur`;
CREATE TABLE `auteur` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `biographie` longtext,
  `date_deces` date DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `langue_id` bigint DEFAULT NULL,
  `pays_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd3g30la5fol6mbqueyvofu8o8` (`langue_id`),
  KEY `FKfoh012oif0hg4cm4ibb2brcod` (`pays_id`),
  CONSTRAINT `FKd3g30la5fol6mbqueyvofu8o8` FOREIGN KEY (`langue_id`) REFERENCES `langue` (`id`),
  CONSTRAINT `FKfoh012oif0hg4cm4ibb2brcod` FOREIGN KEY (`pays_id`) REFERENCES `pays` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `auteur` VALUES (1, 'Biographie d\'Asimov', '1992-04-06', '1920-01-02', 'Isaac Asimov', 1, NULL);
INSERT INTO `auteur` VALUES (2, 'Romancière anglaise', '1817-07-18', '1775-12-16', 'Jane Austen', 1, NULL);
INSERT INTO `auteur` VALUES (3, 'Reine du policier', '1976-01-12', '1890-09-15', 'Agatha Christie', 1, NULL);
INSERT INTO `auteur` VALUES (4, 'Créateur de la Terre du Milieu', '1973-09-02', '1892-01-03', 'J.R.R. Tolkien', 1, NULL);
INSERT INTO `auteur` VALUES (5, 'Écrivain français', '1885-05-22', '1802-02-26', 'Victor Hugo', 1, NULL);
INSERT INTO `auteur` VALUES (6, 'Expert en développement personnel', '2012-07-16', '1932-10-24', 'Stephen Covey', 1, NULL);
INSERT INTO `auteur` VALUES (7, 'Créatrice de Harry Potter', NULL, '1965-07-31', 'J.K. Rowling', 1, NULL);
INSERT INTO `auteur` VALUES (8, 'Écrivain suédois', '2004-11-09', '1954-08-15', 'Stieg Larsson', 1, NULL);

-- Table: auteur_genre
DROP TABLE IF EXISTS `auteur_genre`;
CREATE TABLE `auteur_genre` (
  `auteur_id` bigint NOT NULL,
  `genre_id` bigint NOT NULL,
  PRIMARY KEY (`auteur_id`,`genre_id`),
  KEY `FKf2pl577l6qnbfpgnb5cgrp3a8` (`genre_id`),
  CONSTRAINT `FKf2pl577l6qnbfpgnb5cgrp3a8` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`),
  CONSTRAINT `FKm88kha5n2v19heqqj4vf98yi7` FOREIGN KEY (`auteur_id`) REFERENCES `auteur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: avis
DROP TABLE IF EXISTS `avis`;
CREATE TABLE `avis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `commentaire` longtext,
  `date_avis` datetime(6) NOT NULL,
  `note` int DEFAULT NULL,
  `livre_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkuy2rlix4tlqhrmueiyijbxtr` (`livre_id`),
  KEY `FKg8t2riyadxmhnf2qpvkopbfki` (`user_id`),
  CONSTRAINT `FKg8t2riyadxmhnf2qpvkopbfki` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkuy2rlix4tlqhrmueiyijbxtr` FOREIGN KEY (`livre_id`) REFERENCES `livre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: categorie
DROP TABLE IF EXISTS `categorie`;
CREATE TABLE `categorie` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_201klrwuww0os41kte46ac6lq` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categorie` VALUES (6, 'Développement personnel');
INSERT INTO `categorie` VALUES (1, 'Fiction');
INSERT INTO `categorie` VALUES (5, 'Historique');
INSERT INTO `categorie` VALUES (7, 'Jeunesse');
INSERT INTO `categorie` VALUES (3, 'Policier');
INSERT INTO `categorie` VALUES (4, 'Romance');
INSERT INTO `categorie` VALUES (2, 'Science-fiction');
INSERT INTO `categorie` VALUES (8, 'Thriller');

-- Table: code_postal
DROP TABLE IF EXISTS `code_postal`;
CREATE TABLE `code_postal` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code_postal` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3k2cjl6iwc65xsll8pv6txth4` (`code_postal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: commune
DROP TABLE IF EXISTS `commune`;
CREATE TABLE `commune` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom_commune` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: flyway_schema_history
DROP TABLE IF EXISTS `flyway_schema_history`;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `flyway_schema_history` VALUES (1, '1', '<< Flyway Baseline >>', 'BASELINE', '<< Flyway Baseline >>', NULL, 'root', '2026-03-06 02:20:40.0', 0, true);
INSERT INTO `flyway_schema_history` VALUES (2, '2', 'insert data', 'SQL', 'V2__insert_data.sql', 1323128513, 'root', '2026-03-06 03:03:32.0', 64, false);

-- Table: future_parutions
DROP TABLE IF EXISTS `future_parutions`;
CREATE TABLE `future_parutions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_sortie` date DEFAULT NULL,
  `resume` longtext,
  `titre` varchar(255) NOT NULL,
  `auteur_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6lvyjq1ekw49e0c4jylbnmfh` (`auteur_id`),
  CONSTRAINT `FK6lvyjq1ekw49e0c4jylbnmfh` FOREIGN KEY (`auteur_id`) REFERENCES `auteur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: genre
DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `categorie_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKncltq24em1jhy3ve0qxdgbbfd` (`categorie_id`),
  CONSTRAINT `FKncltq24em1jhy3ve0qxdgbbfd` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `genre` VALUES (1, 'Science-fiction', 2);
INSERT INTO `genre` VALUES (2, 'Romance', 4);
INSERT INTO `genre` VALUES (3, 'Policier', 3);
INSERT INTO `genre` VALUES (4, 'Fantastique', 1);
INSERT INTO `genre` VALUES (5, 'Historique', 5);
INSERT INTO `genre` VALUES (6, 'Développement personnel', 6);
INSERT INTO `genre` VALUES (7, 'Jeunesse', 7);
INSERT INTO `genre` VALUES (8, 'Thriller', 8);

-- Table: langue
DROP TABLE IF EXISTS `langue`;
CREATE TABLE `langue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code_iso` varchar(10) DEFAULT NULL,
  `libelle` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `langue` VALUES (1, 'fr', 'Français');
INSERT INTO `langue` VALUES (2, 'en', 'Anglais');
INSERT INTO `langue` VALUES (3, 'es', 'Espagnol');
INSERT INTO `langue` VALUES (4, 'de', 'Allemand');
INSERT INTO `langue` VALUES (5, 'it', 'Italien');

-- Table: lectures
DROP TABLE IF EXISTS `lectures`;
CREATE TABLE `lectures` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_lecture` date DEFAULT NULL,
  `livre_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgol2drsebqbc8vbq00vbw9u73` (`livre_id`),
  KEY `FK2p6fn5t757wjgdpskia7t3l24` (`user_id`),
  CONSTRAINT `FK2p6fn5t757wjgdpskia7t3l24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKgol2drsebqbc8vbq00vbw9u73` FOREIGN KEY (`livre_id`) REFERENCES `livre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: livre
DROP TABLE IF EXISTS `livre`;
CREATE TABLE `livre` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_publication` date DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `resume` longtext,
  `titre` varchar(255) NOT NULL,
  `auteur_id` bigint DEFAULT NULL,
  `genre_id` bigint DEFAULT NULL,
  `langue_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9lix5phlv9fnqt4gsyu0qgb5` (`isbn`),
  KEY `FKh0pb6pxv3ubtgo1s3ev4gebgj` (`auteur_id`),
  KEY `FKg5mlh4g5wfixr8kvk4q5woatr` (`genre_id`),
  KEY `FK4ykrk9138288jlyhxckd88tdo` (`langue_id`),
  CONSTRAINT `FK4ykrk9138288jlyhxckd88tdo` FOREIGN KEY (`langue_id`) REFERENCES `langue` (`id`),
  CONSTRAINT `FKg5mlh4g5wfixr8kvk4q5woatr` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`),
  CONSTRAINT `FKh0pb6pxv3ubtgo1s3ev4gebgj` FOREIGN KEY (`auteur_id`) REFERENCES `auteur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `livre` VALUES (103, '2020-05-15', '978-2070612345', 'Une épopée classique de science-fiction où Isaac Asimov imagine l\'avenir de l\'humanité.', 'Fondation', 1, 1, 1);
INSERT INTO `livre` VALUES (104, '2019-03-20', '978-2253043157', 'Le roman d\'amour classique de Jane Austen, histoire d\'Elizabeth Bennet et Mr Darcy.', 'Orgueil et Préjugés', 2, 2, 1);
INSERT INTO `livre` VALUES (105, '2021-11-10', '978-2253042501', 'Une enquête policière palpitante avec le célèbre détective Hercule Poirot.', 'Assassinat sur le Nil', 3, 3, 1);
INSERT INTO `livre` VALUES (106, '2018-06-01', '978-2253045632', 'L\'épopée fantastique monumentale de Tolkien - un classique incontournable.', 'Le Seigneur des Anneaux', 4, 4, 1);
INSERT INTO `livre` VALUES (107, '2022-09-14', '978-2070306473', 'L\'aventure de Bilbo le Sacquet. Un prélude merveilleux au Seigneur des Anneaux avec des créatures fantastiques et des trésors légendaires.', 'Le Hobbit', 4, 4, 1);

-- Table: pays
DROP TABLE IF EXISTS `pays`;
CREATE TABLE `pays` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom_pays` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ctjitwhl5fxgijaxmtq20u6ak` (`nom_pays`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: possession
DROP TABLE IF EXISTS `possession`;
CREATE TABLE `possession` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_emprunt` date NOT NULL,
  `date_retour` date DEFAULT NULL,
  `livre_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkqh2pr0g93mli1eh1kh006id4` (`livre_id`),
  KEY `FK5ub07e0jjj45wvwikpxhg2n3i` (`user_id`),
  CONSTRAINT `FK5ub07e0jjj45wvwikpxhg2n3i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkqh2pr0g93mli1eh1kh006id4` FOREIGN KEY (`livre_id`) REFERENCES `livre` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `possession` VALUES (5141, '2026-03-08', NULL, 103, 1);
INSERT INTO `possession` VALUES (5142, '2026-03-08', NULL, 104, 1);
INSERT INTO `possession` VALUES (5143, '2026-03-08', NULL, 105, 1);
INSERT INTO `possession` VALUES (5144, '2026-03-08', NULL, 106, 1);
INSERT INTO `possession` VALUES (5145, '2026-03-08', NULL, 107, 1);
INSERT INTO `possession` VALUES (5146, '2026-03-08', NULL, 103, 2);
INSERT INTO `possession` VALUES (5147, '2026-03-08', NULL, 104, 2);
INSERT INTO `possession` VALUES (5148, '2026-03-08', NULL, 105, 2);
INSERT INTO `possession` VALUES (5149, '2026-03-08', NULL, 106, 2);
INSERT INTO `possession` VALUES (5150, '2026-03-08', NULL, 107, 2);
INSERT INTO `possession` VALUES (5151, '2026-03-08', NULL, 103, 3);
INSERT INTO `possession` VALUES (5152, '2026-03-08', NULL, 104, 3);
INSERT INTO `possession` VALUES (5153, '2026-03-08', NULL, 105, 3);
INSERT INTO `possession` VALUES (5154, '2026-03-08', NULL, 106, 3);
INSERT INTO `possession` VALUES (5155, '2026-03-08', NULL, 107, 3);
INSERT INTO `possession` VALUES (5156, '2026-03-08', NULL, 103, 4);
INSERT INTO `possession` VALUES (5157, '2026-03-08', NULL, 104, 4);
INSERT INTO `possession` VALUES (5158, '2026-03-08', NULL, 105, 4);
INSERT INTO `possession` VALUES (5159, '2026-03-08', NULL, 106, 4);
INSERT INTO `possession` VALUES (5160, '2026-03-08', NULL, 107, 4);
INSERT INTO `possession` VALUES (5161, '2026-03-08', NULL, 103, 5);
INSERT INTO `possession` VALUES (5162, '2026-03-08', NULL, 104, 5);
INSERT INTO `possession` VALUES (5163, '2026-03-08', NULL, 105, 5);
INSERT INTO `possession` VALUES (5164, '2026-03-08', NULL, 106, 5);
INSERT INTO `possession` VALUES (5165, '2026-03-08', NULL, 107, 5);
INSERT INTO `possession` VALUES (5166, '2026-03-08', NULL, 103, 6);
INSERT INTO `possession` VALUES (5167, '2026-03-08', NULL, 104, 6);
INSERT INTO `possession` VALUES (5168, '2026-03-08', NULL, 105, 6);
INSERT INTO `possession` VALUES (5169, '2026-03-08', NULL, 106, 6);
INSERT INTO `possession` VALUES (5170, '2026-03-08', NULL, 107, 6);
INSERT INTO `possession` VALUES (5171, '2026-03-08', NULL, 103, 7);
INSERT INTO `possession` VALUES (5172, '2026-03-08', NULL, 104, 7);
INSERT INTO `possession` VALUES (5173, '2026-03-08', NULL, 105, 7);
INSERT INTO `possession` VALUES (5174, '2026-03-08', NULL, 106, 7);
INSERT INTO `possession` VALUES (5175, '2026-03-08', NULL, 107, 7);
INSERT INTO `possession` VALUES (5176, '2026-03-08', NULL, 103, 8);
INSERT INTO `possession` VALUES (5177, '2026-03-08', NULL, 104, 8);
INSERT INTO `possession` VALUES (5178, '2026-03-08', NULL, 105, 8);
INSERT INTO `possession` VALUES (5179, '2026-03-08', NULL, 106, 8);
INSERT INTO `possession` VALUES (5180, '2026-03-08', NULL, 107, 8);
INSERT INTO `possession` VALUES (5181, '2026-03-08', NULL, 103, 9);
INSERT INTO `possession` VALUES (5182, '2026-03-08', NULL, 104, 9);
INSERT INTO `possession` VALUES (5183, '2026-03-08', NULL, 105, 9);
INSERT INTO `possession` VALUES (5184, '2026-03-08', NULL, 106, 9);
INSERT INTO `possession` VALUES (5185, '2026-03-08', NULL, 107, 9);
INSERT INTO `possession` VALUES (5186, '2026-03-08', NULL, 103, 10);
INSERT INTO `possession` VALUES (5187, '2026-03-08', NULL, 104, 10);
INSERT INTO `possession` VALUES (5188, '2026-03-08', NULL, 105, 10);
INSERT INTO `possession` VALUES (5189, '2026-03-08', NULL, 106, 10);
INSERT INTO `possession` VALUES (5190, '2026-03-08', NULL, 107, 10);
INSERT INTO `possession` VALUES (5191, '2026-03-08', NULL, 103, 11);
INSERT INTO `possession` VALUES (5192, '2026-03-08', NULL, 104, 11);
INSERT INTO `possession` VALUES (5193, '2026-03-08', NULL, 105, 11);
INSERT INTO `possession` VALUES (5194, '2026-03-08', NULL, 106, 11);
INSERT INTO `possession` VALUES (5195, '2026-03-08', NULL, 107, 11);
INSERT INTO `possession` VALUES (5196, '2026-03-08', NULL, 103, 12);
INSERT INTO `possession` VALUES (5197, '2026-03-08', NULL, 104, 12);
INSERT INTO `possession` VALUES (5198, '2026-03-08', NULL, 105, 12);
INSERT INTO `possession` VALUES (5199, '2026-03-08', NULL, 106, 12);
INSERT INTO `possession` VALUES (5200, '2026-03-08', NULL, 107, 12);
INSERT INTO `possession` VALUES (5201, '2026-03-08', NULL, 103, 13);
INSERT INTO `possession` VALUES (5202, '2026-03-08', NULL, 104, 13);
INSERT INTO `possession` VALUES (5203, '2026-03-08', NULL, 105, 13);
INSERT INTO `possession` VALUES (5204, '2026-03-08', NULL, 106, 13);
INSERT INTO `possession` VALUES (5205, '2026-03-08', NULL, 107, 13);
INSERT INTO `possession` VALUES (5206, '2026-03-08', NULL, 103, 14);
INSERT INTO `possession` VALUES (5207, '2026-03-08', NULL, 104, 14);
INSERT INTO `possession` VALUES (5208, '2026-03-08', NULL, 105, 14);
INSERT INTO `possession` VALUES (5209, '2026-03-08', NULL, 106, 14);
INSERT INTO `possession` VALUES (5210, '2026-03-08', NULL, 107, 14);
INSERT INTO `possession` VALUES (5211, '2026-03-08', NULL, 103, 15);
INSERT INTO `possession` VALUES (5212, '2026-03-08', NULL, 104, 15);
INSERT INTO `possession` VALUES (5213, '2026-03-08', NULL, 105, 15);
INSERT INTO `possession` VALUES (5214, '2026-03-08', NULL, 106, 15);
INSERT INTO `possession` VALUES (5215, '2026-03-08', NULL, 107, 15);
INSERT INTO `possession` VALUES (5216, '2026-03-08', NULL, 103, 16);
INSERT INTO `possession` VALUES (5217, '2026-03-08', NULL, 104, 16);
INSERT INTO `possession` VALUES (5218, '2026-03-08', NULL, 105, 16);
INSERT INTO `possession` VALUES (5219, '2026-03-08', NULL, 106, 16);
INSERT INTO `possession` VALUES (5220, '2026-03-08', NULL, 107, 16);
INSERT INTO `possession` VALUES (5221, '2026-03-08', NULL, 103, 17);
INSERT INTO `possession` VALUES (5222, '2026-03-08', NULL, 104, 17);
INSERT INTO `possession` VALUES (5223, '2026-03-08', NULL, 105, 17);
INSERT INTO `possession` VALUES (5224, '2026-03-08', NULL, 106, 17);
INSERT INTO `possession` VALUES (5225, '2026-03-08', NULL, 107, 17);
INSERT INTO `possession` VALUES (5226, '2026-03-08', NULL, 103, 18);
INSERT INTO `possession` VALUES (5227, '2026-03-08', NULL, 104, 18);
INSERT INTO `possession` VALUES (5228, '2026-03-08', NULL, 105, 18);
INSERT INTO `possession` VALUES (5229, '2026-03-08', NULL, 106, 18);
INSERT INTO `possession` VALUES (5230, '2026-03-08', NULL, 107, 18);
INSERT INTO `possession` VALUES (5231, '2026-03-08', NULL, 103, 19);
INSERT INTO `possession` VALUES (5232, '2026-03-08', NULL, 104, 19);
INSERT INTO `possession` VALUES (5233, '2026-03-08', NULL, 105, 19);
INSERT INTO `possession` VALUES (5234, '2026-03-08', NULL, 106, 19);
INSERT INTO `possession` VALUES (5235, '2026-03-08', NULL, 107, 19);
INSERT INTO `possession` VALUES (5236, '2026-03-08', NULL, 103, 20);
INSERT INTO `possession` VALUES (5237, '2026-03-08', NULL, 104, 20);
INSERT INTO `possession` VALUES (5238, '2026-03-08', NULL, 105, 20);
INSERT INTO `possession` VALUES (5239, '2026-03-08', NULL, 106, 20);
INSERT INTO `possession` VALUES (5240, '2026-03-08', NULL, 107, 20);
INSERT INTO `possession` VALUES (5241, '2026-03-08', NULL, 103, 21);
INSERT INTO `possession` VALUES (5242, '2026-03-08', NULL, 104, 21);
INSERT INTO `possession` VALUES (5243, '2026-03-08', NULL, 105, 21);
INSERT INTO `possession` VALUES (5244, '2026-03-08', NULL, 106, 21);
INSERT INTO `possession` VALUES (5245, '2026-03-08', NULL, 107, 21);
INSERT INTO `possession` VALUES (5246, '2026-03-08', NULL, 103, 22);
INSERT INTO `possession` VALUES (5247, '2026-03-08', NULL, 104, 22);
INSERT INTO `possession` VALUES (5248, '2026-03-08', NULL, 105, 22);
INSERT INTO `possession` VALUES (5249, '2026-03-08', NULL, 106, 22);
INSERT INTO `possession` VALUES (5250, '2026-03-08', NULL, 107, 22);
INSERT INTO `possession` VALUES (5251, '2026-03-08', NULL, 103, 23);
INSERT INTO `possession` VALUES (5252, '2026-03-08', NULL, 104, 23);
INSERT INTO `possession` VALUES (5253, '2026-03-08', NULL, 105, 23);
INSERT INTO `possession` VALUES (5254, '2026-03-08', NULL, 106, 23);
INSERT INTO `possession` VALUES (5255, '2026-03-08', NULL, 107, 23);
INSERT INTO `possession` VALUES (5256, '2026-03-08', NULL, 103, 24);
INSERT INTO `possession` VALUES (5257, '2026-03-08', NULL, 104, 24);
INSERT INTO `possession` VALUES (5258, '2026-03-08', NULL, 105, 24);
INSERT INTO `possession` VALUES (5259, '2026-03-08', NULL, 106, 24);
INSERT INTO `possession` VALUES (5260, '2026-03-08', NULL, 107, 24);

-- Table: roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` VALUES (1, 'Utilisateur standard', 'USER');
INSERT INTO `roles` VALUES (2, 'Administrateur', 'ADMIN');

-- Table: souhaits
DROP TABLE IF EXISTS `souhaits`;
CREATE TABLE `souhaits` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_souhait` date DEFAULT NULL,
  `livre_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs560knnjw8wqms038h5oc0c82` (`livre_id`),
  KEY `FKhrrs27iar4mfqjyp2eivq6e9h` (`user_id`),
  CONSTRAINT `FKhrrs27iar4mfqjyp2eivq6e9h` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKs560knnjw8wqms038h5oc0c82` FOREIGN KEY (`livre_id`) REFERENCES `livre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table: statuses
DROP TABLE IF EXISTS `statuses`;
CREATE TABLE `statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9ob63rkqg8ppaon1l37w8id2p` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `statuses` VALUES (1, 'Utilisateur actif', 'ACTIVE');
INSERT INTO `statuses` VALUES (2, 'Utilisateur inactif', 'INACTIVE');

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_connexion` datetime(6) DEFAULT NULL,
  `date_inscription` datetime(6) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `role_id` bigint NOT NULL,
  `status_id` bigint NOT NULL,
  `rue` varchar(255) DEFAULT NULL,
  `code_postal_id` bigint DEFAULT NULL,
  `commune_id` bigint DEFAULT NULL,
  `langue_id` bigint DEFAULT NULL,
  `pays_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  KEY `FKpp127ea8ef1s2x9em2o3bhsvo` (`status_id`),
  KEY `FK2hu2bg5lyjulbehtldfmcmtw4` (`code_postal_id`),
  KEY `FKi4hdfrxinycelo1adm78s9bhh` (`commune_id`),
  KEY `FKl6i3ebsdrga8p37yv8opkro6x` (`langue_id`),
  KEY `FKb5xgg1aly1bik4ajy5vmtypf5` (`pays_id`),
  CONSTRAINT `FK2hu2bg5lyjulbehtldfmcmtw4` FOREIGN KEY (`code_postal_id`) REFERENCES `code_postal` (`id`),
  CONSTRAINT `FKb5xgg1aly1bik4ajy5vmtypf5` FOREIGN KEY (`pays_id`) REFERENCES `pays` (`id`),
  CONSTRAINT `FKi4hdfrxinycelo1adm78s9bhh` FOREIGN KEY (`commune_id`) REFERENCES `commune` (`id`),
  CONSTRAINT `FKl6i3ebsdrga8p37yv8opkro6x` FOREIGN KEY (`langue_id`) REFERENCES `langue` (`id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKpp127ea8ef1s2x9em2o3bhsvo` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES (1, 2026-03-07T23:38:38.109888, 2026-03-06T01:30:02.280738, 'mm@gmail.com', 'Ll', '$2a$10$uTXLBl3qPe02keAXX5YlPOvE0dRGonv9WwC7q7gHwaZs/jrfmtc2m', 'Mm', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (2, 2026-03-06T01:34:16.558001, 2026-03-06T01:34:16.558001, 'jean@test.com', 'Dupont', '$2a$10$Ml0RHgDHvHpXNX/6/L2rCuXMnNirNY8MKZtFL8pIA6lsTTc4bg4Tu', 'Jean', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (3, 2026-03-06T01:39:09.934478, 2026-03-06T01:39:09.935063, 'test123@test.com', 'TestNom', '$2a$10$VT73nVyZu/xm.EMoJF3fM.GiYzESvZIR/Wu548OHF8j6L2L7dT2Yy', 'TestPrenom', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (4, 2026-03-06T01:39:14.384451, 2026-03-06T01:39:14.384451, 'marie_1772761154@test.com', 'Dupont', '$2a$10$5k6plAWgn9QAu/6wa2tDJO3NNMB9h5U/qItJD626Cu/xIXqnQLb9u', 'Marie', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (5, 2026-03-06T01:42:31.861340, 2026-03-06T01:42:31.861340, 'test_1772761351@test.com', 'Test', '$2a$10$v7WfI6xxjr8O7LKFnv/8nu2ul54yOda8KyDdUKFgNDbj8GBeF9lsO', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (6, 2026-03-06T02:19:20.146868, 2026-03-06T02:10:29.898939, 'test@test.com', 'Test', '$2a$10$40Nsrxsa4bnxDPGoA0KdrOwXcZRYAAVubwsh2hSne2rvGEajjjTsi', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (7, 2026-03-07T00:04:03.791849, 2026-03-07T00:04:03.794248, 'newtestuser123@test.com', 'Test', '$2a$10$XyUczZIxjpSHVzvpqnz7u.LgRBvDCvcsf3aZVtr.EQTC2xm5w4tBe', 'NewUser', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (8, 2026-03-07T00:07:35.791486, 2026-03-07T00:07:35.792016, 'user@example.com', 'User', '$2a$10$LQQ7sDcH1inBgFwnJu0s5OS8F12/S/47K19ihU40MC8j.xyS2AqvG', 'Test', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (9, 2026-03-07T00:39:59.726402, 2026-03-07T00:39:59.726975, 'test@test.fr', 'Test', '$2a$10$w6biArQe0KPZdpSiY4r5rerpVDKXLQ1t3A8NxzY0SOFNRHqbACHPi', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (10, 2026-03-07T00:48:37.534645, 2026-03-07T00:48:37.535260, 'test2025@example.com', 'Test', '$2a$10$sDhpPh.rNoScQfJYV//5Geam1i1umlREOMTJ2KLI9K1SF3I9qV3S.', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (11, 2026-03-07T00:49:08.912119, 2026-03-07T00:49:08.912119, 'testuser1772844548746@example.com', 'Test', '$2a$10$M6dX7hTa5uceSmdRsWnmFOYA38ZJfskw7OUBtVxHeRuJ35y.QCC1q', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (12, 2026-03-07T00:50:47.938595, 2026-03-07T00:50:47.938595, 'testuser1772844647784@example.com', 'Test', '$2a$10$P6o.g7KagWo6/bZXOcSRs.s5HqgbuE7Ikfj6bHT5lJ0X59vZCM4gK', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (13, 2026-03-07T00:59:49.077600, 2026-03-07T00:59:49.077600, 'testborrow1772845188781@example.com', 'Test', '$2a$10$WjemwDCgu7q.mritFcQbOuGfSM7KHc7Kz/IX3FjjlmvN3P3mjzK1u', 'Borrow', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (14, 2026-03-07T01:00:12.757108, 2026-03-07T01:00:12.757108, 'test1772845212587@ex.com', 'Test', '$2a$10$hpdIu2yHPjYXEC595lUb/.M5Wn4sA7iS0aOks.z9bu/b//1Pvbqyi', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (15, 2026-03-07T01:00:19.949594, 2026-03-07T01:00:19.949594, 'test1772845219776@ex.com', 'Test', '$2a$10$v1VL3wX5yWobTZBa8SyaIOlkN/qnQz9n7RbNSYAuLEUXE/Tq/BTey', 'User', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (16, 2026-03-07T01:01:11.041626, 2026-03-07T01:01:11.041626, 'borrowtest@ex.com', 'Borrow', '$2a$10$W.Zk.Kagb65SqSMr7NWmSO5qezAob0xrdw7mvpoyJCYtDt7EBv/cK', 'Test', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (17, 2026-03-07T01:04:01.870152, 2026-03-07T01:04:01.870711, 'final1772845441524@ex.com', 'Final', '$2a$10$NfhGtYqv0D9IAhReJL0E6.GsNe9XT5xuh1KQ4d8BNcK0SIhem31Ga', 'Test', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (18, 2026-03-07T01:06:03.262069, 2026-03-07T01:06:03.262602, 'testuser1772845563108@ex.com', 'Test', '$2a$10$l4MQw4eaaw3vjOKFxBYBre2qJGwlbNU1Fqa7RKfX3zrt7UsohO44y', 'Emprunter', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (19, 2026-03-07T01:06:26.627248, 2026-03-07T01:06:26.627248, 'realtest1772845586465@ex.com', 'Test', '$2a$10$Lr708bwxvM0OLg4ckj2Qm.y..hUhiWIhhQYSra8Zn446JKEHGcQbS', 'Real', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (20, 2026-03-07T01:09:24.722520, 2026-03-07T01:09:24.723040, 'final1772845764407@ex.com', 'Test', '$2a$10$YblKqtJ/hDX2uQsIMpJPTOhZ3frh4dOj7HdyON0VjOWSovjgRN4JW', 'Final', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (21, 2026-03-07T01:17:07.868011, 2026-03-07T01:17:07.868740, 'testmy1772846227511@ex.com', 'Test', '$2a$10$ZQFtP9J80tlGBxog6Fwc0emqDmWIR0057ej6igOw/exxZ7.n9QGxC', 'My', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (22, 2026-03-07T01:18:37.163842, 2026-03-07T01:18:37.164467, 'testreturn1772846316995@ex.com', 'Test', '$2a$10$nmeF8Y3SmRWO6JDaJ2WnpepXrl8f/WPRCI.KrrFTU0s5ySQD856C.', 'Return', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (23, 2026-03-07T01:21:18.043467, 2026-03-07T01:21:18.043998, 'testfinal1772846477762@ex.com', 'Test', '$2a$10$zttRKBLr4cnzy3g7L3gRiuISx54ngK1q5222hio4x/cCl7eKKOhYy', 'Final', 1, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (24, 2026-03-08T02:24:34.835791, 2026-03-08T00:42:19.478206, 'admin@bibliotheque.com', 'Admin', '$2a$10$8aZuvoLV9lFymt4FjWTW4e3mdxJWOUsSCqtnGH8CtuWnhBUMVoFv2', 'Systeme', 2, 1, 'N/A', NULL, NULL, NULL, NULL);
