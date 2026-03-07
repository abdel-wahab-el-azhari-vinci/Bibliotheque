import re

# 1. Update PossessionRepository.java
repo_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/shared/repository/PossessionRepository.java"
with open(repo_file, 'r', encoding='utf-8') as f:
    repo_content = f.read()

# Check if method already exists
if "findByLivreIdAndUserIdEnStock" not in repo_content:
    # Add the new method before the closing brace
    new_method = '''
    /**
     * Possession d'un utilisateur pour un livre spécifique EN STOCK
     */
    @Query("SELECT p FROM Possession p WHERE p.livre.id = :livreId AND p.user.id = :userId AND p.dateRetour IS NULL")
    Optional<Possession> findByLivreIdAndUserIdEnStock(@Param("livreId") Long livreId, @Param("userId") Long userId);'''
    
    repo_content = repo_content.rstrip() + '\n' + new_method + '\n}\n'
    with open(repo_file, 'w', encoding='utf-8') as f:
        f.write(repo_content)
    print("✓ PossessionRepository.java updated")
else:
    print("✓ PossessionRepository.java already has the method")

# 2. Update PossessionService.java
service_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/shared/service/PossessionService.java"
with open(service_file, 'r', encoding='utf-8') as f:
    service_content = f.read()

if "borrowBook" not in service_content:
    # Add the new method before the closing brace
    new_method = '''
    /**
     * Emprunter un livre (trouver la possession de l'utilisateur et la marquer comme sortie)
     */
    public Possession borrowBook(Long livreId, Long userId) {
        Possession possession = possessionRepository.findByLivreIdAndUserIdEnStock(livreId, userId)
            .orElseThrow(() -> new NoSuchElementException("Aucun exemplaire disponible pour cet utilisateur"));
        return markAsOut(possession.getId(), LocalDate.now());
    }'''
    
    # Insert before the closing brace
    service_content = service_content.rstrip() + '\n' + new_method + '\n}\n'
    with open(service_file, 'w', encoding='utf-8') as f:
        f.write(service_content)
    print("✓ PossessionService.java updated")
else:
    print("✓ PossessionService.java already has the method")

# 3. Update PossessionController.java - more complex
controller_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/book/controller/PossessionController.java"
with open(controller_file, 'r', encoding='utf-8') as f:
    controller_content = f.read()

# Add imports if missing
if "import org.springframework.security.core.Authentication;" not in controller_content:
    import_section = re.search(r'(import.*?\n)+', controller_content).group()
    if "import org.springframework.security.core.Authentication;" not in controller_content:
        new_imports = """import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
"""
        controller_content = controller_content.replace(import_section, import_section + new_imports)
        print("✓ Added imports to PossessionController.java")

# Add UserRepository to the class if not present
if "@RequiredArgsConstructor" in controller_content and "userRepository" not in controller_content:
    # The class already has @RequiredArgsConstructor, we need to add field
    class_content = re.search(r'(@RequiredArgsConstructor.*?\npublic class.*?\{)', controller_content, re.DOTALL).group()
    # Add the field after class opening
    field_to_add = '\n    private final UserRepository userRepository;\n'
    controller_content = controller_content.replace(class_content, class_content + field_to_add)
    print("✓ Added UserRepository field to PossessionController.java")

# Add the borrow endpoint if not present
if "PostMapping(\"/borrow\")" not in controller_content and "@PostMapping(\"/borrow\")" not in controller_content:
    new_endpoint = '''
    /**
     * POST /api/possessions/borrow
     * Emprunter un livre pour l'utilisateur connecté
     * Body: { "livreId": 1 }
     */
    @PostMapping("/borrow")
    public ResponseEntity<Possession> borrow(@RequestParam Long livreId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouvé"));
        
        Possession possession = possessionService.borrowBook(livreId, user.getId());
        return ResponseEntity.ok(possession);
    }'''
    
    # Insert before the closing brace of the class
    controller_content = controller_content.rstrip() + '\n' + new_endpoint + '\n}\n'
    with open(controller_file, 'w', encoding='utf-8') as f:
        f.write(controller_content)
    print("✓ PossessionController.java updated with /borrow endpoint")
else:
    print("✓ PossessionController.java already has the /borrow endpoint")

print("\n✓ All files updated successfully!")
