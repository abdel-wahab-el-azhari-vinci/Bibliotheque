# AI PROJECT RULES

## 1. OBJECTIF DU PROJET

Créer une application mobile professionnelle avec :

- Frontend : React Native + TypeScript
- Backend : Spring Boot (Java)
- Architecture : Monolith (un dossier frontend + un dossier backend)

Le projet doit respecter des bonnes pratiques proches du monde professionnel.
L'IA agit comme professeur technique et guide.

Structure racine :

/frontend  
/backend  
AI_RULES.md  

---

## 2. ARCHITECTURE GLOBALE

Architecture 3-tiers :

Mobile (React Native)
→ API REST (Spring Boot)
→ Base de données

Communication uniquement via HTTP/HTTPS (JSON).

Pas de microservices.
Un seul backend Spring Boot.

---

## 3. BACKEND — SPRING BOOT (OBLIGATOIRE)

Architecture en couches :

controller/
service/
repository/
entity/
dto/
mapper/
exception/
config/

Règles STRICTES :

- Controller :
  - Gère uniquement HTTP (Request / Response)
  - AUCUNE logique métier

- Service :
  - Contient toute la logique métier
  - Gère les transactions

- Repository :
  - Accès base de données uniquement

- Entity :
  - Représente la DB
  - JAMAIS envoyée au frontend

- DTO :
  - Obligatoire pour toutes les entrées/sorties API

- Mapper :
  - Convertit Entity ↔ DTO

- Validation :
  - @Valid + annotations

- Erreurs :
  - Gestion centralisée avec @ControllerAdvice

INTERDICTIONS :

❌ Entity exposée au frontend  
❌ Logique métier dans Controller  
❌ Accès DB hors Repository  
❌ Code magique  
❌ Gros fichiers sans séparation  

---

## 4. FRONTEND — REACT NATIVE (OBLIGATOIRE)

Architecture par features :

src/features/
  auth/
  products/
  etc...

Chaque feature contient :

screens/
components/
api/
types.ts

Partagé :

shared/api/httpClient.ts

Règles STRICTES :

- Les screens ne font JAMAIS d'axios/fetch
- Tous les appels passent par api/
- Un seul httpClient global
- Token géré globalement
- TypeScript strict
- Séparation UI / logique / réseau

---

## 5. AUTHENTIFICATION & SÉCURITÉ

Backend :

- JWT
- Mots de passe hashés (bcrypt)
- DTO pour login/register
- Refresh token optionnel

Frontend :

- Token stocké proprement
- Injecté automatiquement dans httpClient
- Gestion 401 globale

---

## 6. CONVENTIONS DE NOMMAGE

Backend Java :

ProductController  
ProductService  
ProductRepository  

DTO :

ProductRequest  
ProductResponse  

Frontend :

productApi.ts  
ProductListScreen.tsx  

---

## 7. RÈGLES DE CODAGE

Toujours :

✅ expliquer AVANT coder  
✅ avancer par petites étapes  
✅ commenter le code  
✅ expliquer le rôle de chaque fichier  

Jamais :

❌ balancer 500 lignes d'un coup  
❌ sauter les explications  
❌ inventer des structures  
❌ modifier l'architecture sans demander  

---

## 8. COMPORTEMENT DE L'IA

Tu es mon professeur technique.

Tu dois :

- Enseigner la théorie avant la pratique
- Respecter strictement cette architecture
- Découper les problèmes
- Demander confirmation avant grosses implémentations
- Toujours expliquer pourquoi

Toute réponse qui ne respecte pas ces règles est considérée comme incorrecte.

---

# 9. RAPPORT DE STAGE - TERRA SANA ASB

## CONTEXTE DU PROJET

**Institut supérieur de formation continue d'Etterbeek**  
Enseignement de Promotion Sociale  
14, rue Joseph Buedts  
1040 Bruxelles

**Rapport de stage d'intégration professionnelle**  
**Entreprise :** TERRA SANA ASBL  
**Maître de stage :** M. Didier SERVAYE  
**Superviseur pédagogique :** M. Didier VAN OUDENHOVE

### Description de l'entreprise

**Terra Sana ASBL** est une organisation à but non lucratif fondée en 2019 à Bruxelles. Elle a pour mission de :

- Soutenir les producteurs locaux et promouvoir le circuit court
- Sensibiliser à un modèle durable basé sur la réduction des déchets, le tri, le recyclage et le réemploi
- Accompagner des personnes en situation de décrochage avec des formations pratiques (informatique, réparation, bonnes pratiques professionnelles)
- Promouvoir une alimentation saine dans les écoles, entreprises et institutions
- Offrir un accompagnement numérique aux projets locaux

L'équipe est composée d'ouvriers en réinsertion, d'employés, bénévoles et stagiaires contribuant à des projets concrets d'impact positif pour la communauté.

### Objectifs du projet

L'objectif est de doter Terra Sana d'un **outil de gestion de stock mobile professionnel**, permettant de piloter l'inventaire des livres avec la même rigueur qu'un logiciel de type "Dbgest".

**Objectifs spécifiques :**

1. **Professionnalisation de l'inventaire** : Remplacer les méthodes manuelles par une interface mobile intuitive permettant aux collaborateurs de connaître instantanément l'état du stock.

2. **Optimisation de l'expérience terrain** : Créer une interface pensée pour l'efficacité avec navigation rapide, listes claires et accès simplifié aux fonctions de recherche.

3. **Cohérence et synchronisation** : L'outil mobile doit être parfaitement synchronisé avec les données centrales de l'asbl. Une mise à jour de stock sur le smartphone doit être immédiatement visible en Web.

4. **Validation par prototype local** : Finaliser un prototype 100% opérationnel fonctionnant sur un serveur local avant déploiement sur terminaux physiques.

### Besoins fonctionnels

- **Authentification sécurisée** : Connexion des collaborateurs à leur session personnelle
- **Consultation et recherche d'inventaire** : Parcourir le catalogue et rechercher par titre, auteur ou genre
- **Gestion des mouvements de stock** : Modifier en temps réel le statut d'un livre (disponible, sorti, prêté)
- **Encodage d'ouvrages** : Ajouter de nouveaux livres en garantissant la cohérence des référentiels existants

### Besoins non-fonctionnels

- **Intégrité des données** : Respecter les contraintes du schéma relationnel
- **Ergonomie et réactivité** : Interface intuitive avec temps de réponse optimisés
- **Sécurité** : Stockage et vérification sécurisés des identifiants

---

# 10. SCHÉMA DE BASE DE DONNÉES - TERRA SANA

## Structure relationnelle complète

Le projet repose sur une base de données relationnelle de **16 tables interconnectées** assurant une normalisation complète des informations.

### 1. CRÉATION DES TABLES INDÉPENDANTES (Aucune clé étrangère)

```sql
CREATE TABLE code_postal (
    id_code_postal INT AUTO_INCREMENT PRIMARY KEY,
    code_postal VARCHAR(20) NOT NULL
);

CREATE TABLE pays (
    id_pays INT AUTO_INCREMENT PRIMARY KEY,
    nom_pays VARCHAR(100) NOT NULL
);

CREATE TABLE statut (
    id_statut INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE commune (
    id_commune INT AUTO_INCREMENT PRIMARY KEY,
    nom_commune VARCHAR(150) NOT NULL
);

CREATE TABLE role (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL
);

CREATE TABLE categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL
);

CREATE TABLE langue (
    id_langue INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    code_iso VARCHAR(10)
);
```

### 2. CRÉATION DES TABLES DE NIVEAU 1 (Dépendent des tables indépendantes)

```sql
CREATE TABLE genre (
    id_genre INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    fk_categorie INT,
    FOREIGN KEY (fk_categorie) REFERENCES categorie(id_categorie)
);

CREATE TABLE auteur (
    id_auteur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    biographie TEXT,
    date_naissance DATE,
    date_deces DATE,
    fk_pays INT,
    fk_langue INT,
    FOREIGN KEY (fk_pays) REFERENCES pays(id_pays),
    FOREIGN KEY (fk_langue) REFERENCES langue(id_langue)
);
```

### 3. CRÉATION DES TABLES DE NIVEAU 2 (Dépendent des niveaux précédents)

```sql
CREATE TABLE utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    rue VARCHAR(255),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription DATETIME,
    date_connexion DATETIME,
    fk_code_postal INT,
    fk_commune INT,
    fk_pays INT,
    fk_role INT,
    fk_langue INT,
    fk_statut INT,
    FOREIGN KEY (fk_code_postal) REFERENCES code_postal(id_code_postal),
    FOREIGN KEY (fk_commune) REFERENCES commune(id_commune),
    FOREIGN KEY (fk_pays) REFERENCES pays(id_pays),
    FOREIGN KEY (fk_role) REFERENCES role(id_role),
    FOREIGN KEY (fk_langue) REFERENCES langue(id_langue),
    FOREIGN KEY (fk_statut) REFERENCES statut(id_statut)
);

CREATE TABLE livre (
    id_livre INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    date_publication DATE,
    resume TEXT,
    fk_genre INT,
    fk_auteur INT,
    fk_langue INT,
    FOREIGN KEY (fk_genre) REFERENCES genre(id_genre),
    FOREIGN KEY (fk_auteur) REFERENCES auteur(id_auteur),
    FOREIGN KEY (fk_langue) REFERENCES langue(id_langue)
);

CREATE TABLE auteur_genre (
    id_auteur_genre INT AUTO_INCREMENT PRIMARY KEY,
    fk_auteur INT,
    fk_genre INT,
    FOREIGN KEY (fk_auteur) REFERENCES auteur(id_auteur),
    FOREIGN KEY (fk_genre) REFERENCES genre(id_genre)
);

CREATE TABLE future_parutions (
    id_future_parution INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date_sortie DATE,
    resume TEXT,
    fk_auteur INT,
    FOREIGN KEY (fk_auteur) REFERENCES auteur(id_auteur)
);
```

### 4. CRÉATION DES TABLES DE LIAISON (Dépendent d'Utilisateur et de Livre)

```sql
CREATE TABLE avis (
    id_avis INT AUTO_INCREMENT PRIMARY KEY,
    commentaire TEXT,
    date_avis DATETIME,
    fk_utilisateur INT,
    fk_livre INT,
    FOREIGN KEY (fk_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (fk_livre) REFERENCES livre(id_livre)
);

CREATE TABLE lectures (
    id_lecture INT AUTO_INCREMENT PRIMARY KEY,
    date_lecture DATE,
    fk_utilisateur INT,
    fk_livre INT,
    FOREIGN KEY (fk_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (fk_livre) REFERENCES livre(id_livre)
);

CREATE TABLE possession (
    id_possession INT AUTO_INCREMENT PRIMARY KEY,
    date_emprunt DATE,
    date_retour DATE,
    fk_utilisateur INT,
    fk_livre INT,
    FOREIGN KEY (fk_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (fk_livre) REFERENCES livre(id_livre)
);

CREATE TABLE souhaits (
    id_souhait INT AUTO_INCREMENT PRIMARY KEY,
    date_souhait DATE,
    fk_utilisateur INT,
    fk_livre INT,
    FOREIGN KEY (fk_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (fk_livre) REFERENCES livre(id_livre)
);
```

## Segmentation fonctionnelle des données (Pôles métier)

### 1. Gestion des utilisateurs et sécurité
- Tables : `utilisateur`, `role`, `statut`, `pays`, `commune`, `code_postal`
- Rôle : Pivot des accès et authentification
- Permet à l'application mobile d'identifier précisément l'origine/destination des ouvrages

### 2. Référentiel du catalogue (Les Livres)
- Tables : `livre`, `genre`, `auteur`, `langue`, `categorie`, `auteur_genre`
- Cœur de l'inventaire enrichi par des tables de nomenclature
- Garantit la propreté des données affichées sur mobile
- Permet des recherches croisées complexes

### 3. Suivi des flux et possessions
- Table clé : `possession` (lie utilisateur ↔ livre)
- Enregistre dates d'emprunt et retour
- Permet d'afficher en temps réel si un ouvrage est "En stock" ou "Sorti"
- Table critique pour la gestion d'inventaire mobile

### 4. Modules d'interactivité
- Tables : `avis`, `lectures`, `souhaits`, `future_parutions`
- Offrent des perspectives d'évolution pour enrichir l'expérience utilisateur
- Au-delà de la simple gestion de stock

## Principe de source unique de vérité (Single Source of Truth)

L'application mobile et la plateforme Web partagent cette ressource de données commune. 

**Implications :**
- Tout modification mobile doit être instantanément cohérente en Web
- L'application mobile doit utiliser les identifiants et relations établis par le schéma
- Respect strict de l'intégrité référentielle

---

# 11. ENTITÉS MÉTIER TERRA SANA

## Classe Livre (Modèle de données)

Calque de la table `livre` utilisée pour stocker les informations détaillées des ouvrages.

**Attributs :**
- `id` (Int) : Identifiant unique
- `titre` (String) : Titre de l'ouvrage
- `isbn` (String) : Code ISBN
- `datePublication` (DateTime) : Date de publication
- `resume` (String) : Résumé du livre
- `fk_genre` (Int) : Clé étrangère vers Génre
- `fk_auteur` (Int) : Clé étrangère vers Auteur
- `fk_langue` (Int) : Clé étrangère vers Langue

**Garanties :**
- Intégrité référentielle : Chaque livre créé via mobile est correctement lié aux tables de nomenclature

## Classe Utilisateur (Gestion de session)

Gère l'état de l'utilisateur connecté, de l'écran de login à la validation des actions.

**Attributs :**
- `id` (Int) : Identifiant unique
- `nom` (String) : Nom de famille
- `prenom` (String) : Prénom
- `email` (String) : Adresse e-mail unique
- `motDePasse` (String) : Hachage sécurisé
- `role` (String) : Rôle/Permissions

**Méthodes critiques :**
- `authentifier()` : Interroge table utilisateur pour valider droits d'accès
- Sécurité : Mot de passe jamais exposé, toujours traité en hachage

## Classe Possession (Logique de stock)

Classe pivot de l'application portant la logique métier des flux d'entrées/sorties.

**Attributs :**
- `id_possession` (Int) : Identifiant unique
- `dateEmprunt` (DateTime) : Date d'emprunt/arrivée
- `dateRetour` (DateTime) : Date de retour (NULL si En stock)
- `fk_utilisateur` (Int) : Clé vers Utilisateur
- `fk_livre` (Int) : Clé vers Livre

**Méthodes critiques :**
- `updateStatus()` : Met à jour la disponibilité d'un ouvrage en temps réel
- Directement liée aux indicateurs visuels (En stock / Sorti) de l'interface mobile

## Classe DataService (Accès SQL)

Classe technique centralisant tous les échanges entre application mobile et base de données.

**Méthodes :**
- `getAllBooks()` : Exécute requêtes SQL optimisées, peuple dynamiquement liste d'inventaire
- `addBook()` : Gère insertion sécurisée via formulaire "Nouvel Ouvrage"
- `getAvailableBooks()` : Filtre par statut (En stock / Sorti)
- Validation : Assure que données obligatoires (ISBN, Titre) sont présentes avant envoi

---

FIN DES RÈGLES
