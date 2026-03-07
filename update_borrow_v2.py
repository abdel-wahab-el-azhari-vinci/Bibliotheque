import re

# 1. Update PossessionRepository.java
print("=== Updating PossessionRepository.java ===")
repo_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/shared/repository/PossessionRepository.java"
with open(repo_file, 'r', encoding='utf-8') as f:
    repo_content = f.read()

if "findByLivreIdAndUserIdEnStock" not in repo_content:
    # Find the last method and add after it, before closing brace
    new_method = '''    
    /**
     * Possession d'un utilisateur pour un livre spécifique EN STOCK
     */
    @Query("SELECT p FROM Possession p WHERE p.livre.id = :livreId AND p.user.id = :userId AND p.dateRetour IS NULL")
    Optional<Possession> findByLivreIdAndUserIdEnStock(@Param("livreId") Long livreId, @Param("userId") Long userId);
'''
    
    # Add before the last }
    repo_content = repo_content.rstrip() + '\n' + new_method + '}'
    with open(repo_file, 'w', encoding='utf-8') as f:
        f.write(repo_content)
    print("✓ Added findByLivreIdAndUserIdEnStock method")
else:
    print("✓ Method already exists")

# Also need to add import Optional if not present
with open(repo_file, 'r', encoding='utf-8') as f:
    repo_content = f.read()
if "import java.util.Optional;" not in repo_content:
    repo_content = repo_content.replace(
        "import java.util.List;",
        "import java.util.List;\nimport java.util.Optional;"
    )
    with open(repo_file, 'w', encoding='utf-8') as f:
        f.write(repo_content)
    print("✓ Added Optional import")

# 2. Update PossessionService.java  
print("\n=== Updating PossessionService.java ===")
service_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/shared/service/PossessionService.java"
with open(service_file, 'r', encoding='utf-8') as f:
    service_content = f.read()

if "borrowBook" not in service_content:
    new_method = '''
    /**
     * Emprunter un livre (trouver la possession de l'utilisateur et la marquer comme sortie)
     */
    public Possession borrowBook(Long livreId, Long userId) {
        Possession possession = possessionRepository.findByLivreIdAndUserIdEnStock(livreId, userId)
            .orElseThrow(() -> new NoSuchElementException("Aucun exemplaire disponible pour cet utilisateur"));
        return markAsOut(possession.getId(), LocalDate.now());
    }
'''
    # Add before the last }
    service_content = service_content.rstrip() + '\n' + new_method + '}'
    with open(service_file, 'w', encoding='utf-8') as f:
        f.write(service_content)
    print("✓ Added borrowBook method")
else:
    print("✓ borrowBook method already exists")

# 3. Update PossessionController.java
print("\n=== Updating PossessionController.java ===")
controller_file = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque/book/controller/PossessionController.java"
with open(controller_file, 'r', encoding='utf-8') as f:
    controller_content = f.read()

# Add imports if missing
imports_to_add = [
    ("import org.springframework.security.core.Authentication;", "import org.springframework.security.core.Authentication;"),
    ("import org.springframework.security.core.context.SecurityContextHolder;", "import org.springframework.security.core.context.SecurityContextHolder;"),
    ("import com.bibliotheque.user.entity.User;", "import com.bibliotheque.user.entity.User;"),
    ("import com.bibliotheque.user.repository.UserRepository;", "import com.bibliotheque.user.repository.UserRepository;"),
]

for check_import, add_import in imports_to_add:
    if check_import not in controller_content:
        # Find the last import line and add after it
        last_import_match = list(re.finditer(r'import [^;]+;', controller_content))
        if last_import_match:
            last_import_end = last_import_match[-1].end()
            controller_content = controller_content[:last_import_end] + '\n' + add_import + controller_content[last_import_end:]
            print(f"✓ Added import: {add_import}")

# Add UserRepository field if not present  
if "private final UserRepository userRepository;" not in controller_content:
    # Find the PossessionService field and add UserRepository after it
    controller_content = re.sub(
        r'(private final PossessionService possessionService;)',
        r'\1\n    private final UserRepository userRepository;',
        controller_content
    )
    print("✓ Added UserRepository field")

# Add the borrow endpoint if not present
if "PostMapping(\"/borrow\")" not in controller_content and "@PostMapping(\"/borrow\")" not in controller_content:
    new_endpoint = '''
    /**
     * POST /api/possessions/borrow
     * Emprunter un livre pour l'utilisateur connecté
     * @param livreId - ID du livre à emprunter
     * @return La possession empruntée
     */
    @PostMapping("/borrow")
    public ResponseEntity<Possession> borrow(@RequestParam Long livreId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouvé"));
        
        Possession possession = possessionService.borrowBook(livreId, user.getId());
        return ResponseEntity.ok(possession);
    }
'''
    # Add before the last }
    controller_content = controller_content.rstrip() + '\n' + new_endpoint + '}'
    with open(controller_file, 'w', encoding='utf-8') as f:
        f.write(controller_content)
    print("✓ Added /borrow endpoint")
else:
    print("✓ /borrow endpoint already exists")

# Write the controller file with imports
with open(controller_file, 'w', encoding='utf-8') as f:
    f.write(controller_content)

print("\n✅ All files updated successfully!")
