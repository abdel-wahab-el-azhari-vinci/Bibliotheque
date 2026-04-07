package com.bibliotheque.config;

import com.bibliotheque.shared.entity.*;
import com.bibliotheque.shared.repository.*;
import com.bibliotheque.user.entity.Role;
import com.bibliotheque.user.entity.Status;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.RoleRepository;
import com.bibliotheque.user.repository.StatusRepository;
import com.bibliotheque.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final StatusRepository statusRepository;
    private final LangueRepository langueRepository;
    private final CategorieRepository categorieRepository;
    private final GenreRepository genreRepository;
    private final AuteurRepository auteurRepository;
    private final LivreRepository livreRepository;
    private final UserRepository userRepository;
    private final PossessionRepository possessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n=== DataInitializer START ===");
        try {
            initRoles();
            initStatuses();
            initLangues();
            initCategories();
            initGenres();
            initAuteurs();
            initLivres();
            initUsers();
            initPossessions();  // ← TOUJOURS réinitialiser les possessions
            System.out.println("=== DataInitializer SUCCESS ===\n");
        } catch (Exception e) {
            System.err.println("❌ ERROR in DataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initRoles() {
        if (roleRepository.count() > 0) return;
        roleRepository.save(new Role(null, "USER", "Utilisateur"));
        roleRepository.save(new Role(null, "ADMIN", "Admin"));
        System.out.println("✅ Rôles: 2");
    }

    private void initStatuses() {
        if (statusRepository.count() > 0) return;
        statusRepository.save(new Status(null, "ACTIVE", "Actif"));
        statusRepository.save(new Status(null, "INACTIVE", "Inactif"));
        System.out.println("✅ Statuts: 2");
    }

    private void initLangues() {
        if (langueRepository.count() > 0) return;
        langueRepository.save(new Langue(null, "Français", "fr"));
        langueRepository.save(new Langue(null, "Anglais", "en"));
        langueRepository.save(new Langue(null, "Espagnol", "es"));
        System.out.println("✅ Langues: 3");
    }

    private void initCategories() {
        if (categorieRepository.count() > 0) return;
        categorieRepository.save(makeCategorie("Fiction"));
        categorieRepository.save(makeCategorie("Science-fiction"));
        categorieRepository.save(makeCategorie("Policier"));
        categorieRepository.save(makeCategorie("Romance"));
        System.out.println("✅ Catégories: 4");
    }

    private Categorie makeCategorie(String lib) {
        Categorie c = new Categorie();
        c.setLibelle(lib);
        return c;
    }

    private void initGenres() {
        if (genreRepository.count() > 0) return;
        var cats = categorieRepository.findAll();
        
        Categorie sciFi = cats.stream().filter(c -> "Science-fiction".equals(c.getLibelle())).findFirst().orElse(null);
        Categorie fiction = cats.stream().filter(c -> "Fiction".equals(c.getLibelle())).findFirst().orElse(null);
        Categorie police = cats.stream().filter(c -> "Policier".equals(c.getLibelle())).findFirst().orElse(null);
        Categorie romance = cats.stream().filter(c -> "Romance".equals(c.getLibelle())).findFirst().orElse(null);
        
        if (sciFi != null) genreRepository.save(makeGenre("Science-fiction", sciFi));
        if (fiction != null) genreRepository.save(makeGenre("Fantastique", fiction));
        if (police != null) genreRepository.save(makeGenre("Policier", police));
        if (romance != null) genreRepository.save(makeGenre("Romance", romance));
        
        System.out.println("✅ Genres: " + genreRepository.count());
    }

    private Genre makeGenre(String lib, Categorie cat) {
        Genre g = new Genre();
        g.setLibelle(lib);
        g.setCategorie(cat);
        return g;
    }

    private void initAuteurs() {
        if (auteurRepository.count() > 0) return;
        var fr = langueRepository.findByCodeIso("fr").orElse(null);
        
        auteurRepository.save(makeAuteur("Isaac Asimov", fr));
        auteurRepository.save(makeAuteur("Jane Austen", fr));
        auteurRepository.save(makeAuteur("Agatha Christie", fr));
        auteurRepository.save(makeAuteur("J.R.R. Tolkien", fr));
        
        System.out.println("✅ Auteurs: " + auteurRepository.count());
    }

    private Auteur makeAuteur(String nom, Langue langue) {
        Auteur a = new Auteur();
        a.setNom(nom);
        a.setLangue(langue);
        return a;
    }

    private void initLivres() {
        var fr = langueRepository.findByCodeIso("fr").orElse(null);
        var genres = genreRepository.findAll();
        var auteurs = auteurRepository.findAll();
        
        Genre sciFi = genres.stream().filter(g -> "Science-fiction".equals(g.getLibelle())).findFirst().orElse(null);
        Genre romance = genres.stream().filter(g -> "Romance".equals(g.getLibelle())).findFirst().orElse(null);
        Genre police = genres.stream().filter(g -> "Policier".equals(g.getLibelle())).findFirst().orElse(null);
        Genre fantastique = genres.stream().filter(g -> "Fantastique".equals(g.getLibelle())).findFirst().orElse(null);
        
        Auteur asimov = auteurs.stream().filter(a -> a.getNom().equals("Isaac Asimov")).findFirst().orElse(null);
        Auteur austen = auteurs.stream().filter(a -> a.getNom().equals("Jane Austen")).findFirst().orElse(null);
        Auteur christie = auteurs.stream().filter(a -> a.getNom().equals("Agatha Christie")).findFirst().orElse(null);
        Auteur tolkien = auteurs.stream().filter(a -> a.getNom().equals("J.R.R. Tolkien")).findFirst().orElse(null);
        
        int created = 0;
        
        if (sciFi != null && asimov != null && fr != null && !livreExists("978-2070612345")) {
            Livre l = makeLivre("Fondation", "978-2070612345", "Une épopée classique de science-fiction où Isaac Asimov imagine l'avenir de l'humanité.", sciFi, asimov, fr);
            livreRepository.save(l);
            created++;
            System.out.println("   ✓ Fondation");
        }
        
        if (romance != null && austen != null && fr != null && !livreExists("978-2253043157")) {
            Livre l = makeLivre("Orgueil et Préjugés", "978-2253043157", "Le roman d'amour classique de Jane Austen, histoire d'Elizabeth Bennet et Mr Darcy.", romance, austen, fr);
            livreRepository.save(l);
            created++;
            System.out.println("   ✓ Orgueil et Préjugés");
        }
        
        if (police != null && christie != null && fr != null && !livreExists("978-2253042501")) {
            Livre l = makeLivre("Assassinat sur le Nil", "978-2253042501", "Une enquête policière palpitante avec le célèbre détective Hercule Poirot.", police, christie, fr);
            livreRepository.save(l);
            created++;
            System.out.println("   ✓ Assassinat sur le Nil");
        }
        
        if (fantastique != null && tolkien != null && fr != null && !livreExists("978-2253045632")) {
            Livre l = makeLivre("Le Seigneur des Anneaux", "978-2253045632", "L'épopée fantastique monumentale de Tolkien - un classique incontournable.", fantastique, tolkien, fr);
            livreRepository.save(l);
            created++;
            System.out.println("   ✓ Le Seigneur des Anneaux");
        }
        
        if (fantastique != null && tolkien != null && fr != null && !livreExists("978-2070306473")) {
            Livre l = makeLivre("Le Hobbit", "978-2070306473", "L'aventure de Bilbo le Sacquet. Un prélude merveilleux au Seigneur des Anneaux.", fantastique, tolkien, fr);
            livreRepository.save(l);
            created++;
            System.out.println("   ✓ Le Hobbit (NOUVEAU)");
        }
        
        if (created > 0) {
            System.out.println("✅ Livres: " + created + " ajouté(s)");
        } else {
            System.out.println("✅ Livres: déjà à jour");
        }
    }

    private boolean livreExists(String isbn) {
        return livreRepository.findByIsbn(isbn).isPresent();
    }

    private void initUsers() {
        if (userRepository.count() > 0) return;
        
        var userRole = roleRepository.findByName("USER").orElse(null);
        var activeStatus = statusRepository.findByName("ACTIVE").orElse(null);
        
        if (userRole != null && activeStatus != null) {
            User user = new User();
            user.setEmail("utilisateur@bibliotheque.fr");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setNom("Martin");
            user.setPrenom("Jean");
            user.setRue("123 Rue de la Paix");
            user.setRole(userRole);
            user.setStatus(activeStatus);
            
            userRepository.save(user);
            System.out.println("✅ Utilisateurs: 1 (utilisateur@bibliotheque.fr)");
        }
    }

    private void initPossessions() {
        // TOUJOURS NETTOYER LES POSSESSIONS (chaque démarrage)
        long possessionCount = possessionRepository.count();
        if (possessionCount > 0) {
            System.out.println("   Suppression de " + possessionCount + " possession(s)...");
            possessionRepository.deleteAll();
        }
        
        // Boucle sur TOUS les utilisateurs pour créer des possessions
        List<User> allUsers = userRepository.findAll();
        List<Livre> livres = livreRepository.findAll();
        
        if (!allUsers.isEmpty() && !livres.isEmpty()) {
            int totalCreated = 0;
            for (User user : allUsers) {
                System.out.println("   Créant possessions pour: " + user.getEmail());
                for (Livre livre : livres) {
                    Possession p = new Possession();
                    p.setUser(user);
                    p.setLivre(livre);
                    p.setDateEmprunt(LocalDate.now());
                    p.setDateRetour(null);  // ✅ CRITICAL: null = EN_STOCK, DISPONIBLE
                    possessionRepository.save(p);
                    totalCreated++;
                }
            }
            System.out.println("✅ Possessions: " + totalCreated + " créée(s) - TOUS EN STOCK");
        }
    }

    private Livre makeLivre(String titre, String isbn, String resume, Genre genre, Auteur auteur, Langue langue) {
        Livre l = new Livre();
        l.setTitre(titre);
        l.setIsbn(isbn);
        l.setResume(resume);
        l.setGenre(genre);
        l.setAuteur(auteur);
        l.setLangue(langue);
        return l;
    }
}
