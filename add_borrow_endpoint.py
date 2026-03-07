#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

base_path = r"c:/_VINCI/Stage/Bibliotheque/backend/src/main/java/com/bibliotheque"

# ============================================================================
# 1. UPDATE PossessionRepository.java
# ============================================================================
repo_path = os.path.join(base_path, "shared/repository/PossessionRepository.java")
print(f"Ì≥ù Updating {repo_path}")

with open(repo_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Only add if method doesn't exist
if "findByLivreIdAndUserIdEnStock" not in content:
    # Add Optional import if missing
    if "import java.util.Optional;" not in content:
        content = content.replace(
            "import java.util.List;",
            "import java.util.List;\nimport java.util.Optional;"
        )
    
    # Add the method before the last }
    method_code = '''    
    /**
     * Possession d'un utilisateur pour un livre sp√©cifique EN STOCK
     */
    @Query("SELECT p FROM Possession p WHERE p.livre.id = :livreId AND p.user.id = :userId AND p.dateRetour IS NULL")
    Optional<Possession> findByLivreIdAndUserIdEnStock(@Param("livreId") Long livreId, @Param("userId") Long userId);
'''
    content = content.rstrip() + "\n" + method_code + "}\n"
    
    with open(repo_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  ‚úì Added findByLivreIdAndUserIdEnStock method")
else:
    print("  ‚úì Method already exists")

# ============================================================================
# 2. UPDATE PossessionService.java
# ============================================================================
service_path = os.path.join(base_path, "shared/service/PossessionService.java")
print(f"\nÌ≥ù Updating {service_path}")

with open(service_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "borrowBook" not in content:
    method_code = '''
    /**
     * Emprunter un livre (trouver la possession de l'utilisateur et la marquer comme sortie)
     */
    public Possession borrowBook(Long livreId, Long userId) {
        Possession possession = possessionRepository.findByLivreIdAndUserIdEnStock(livreId, userId)
            .orElseThrow(() -> new NoSuchElementException("Aucun exemplaire disponible pour cet utilisateur"));
        return markAsOut(possession.getId(), LocalDate.now());
    }
'''
    content = content.rstrip() + "\n" + method_code + "}\n"
    
    with open(service_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  ‚úì Added borrowBook method")
else:
    print("  ‚úì borrowBook method already exists")

# ============================================================================
# 3. UPDATE PossessionController.java
# ============================================================================
controller_path = os.path.join(base_path, "book/controller/PossessionController.java")
print(f"\nÌ≥ù Updating {controller_path}")

with open(controller_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports_needed = [
    "import org.springframework.security.core.Authentication;",
    "import org.springframework.security.core.context.SecurityContextHolder;",
    "import com.bibliotheque.user.entity.User;",
    "import com.bibliotheque.user.repository.UserRepository;",
]

for imp in imports_needed:
    if imp not in content:
        # Find the last import and add after it
        last_import_match = list(re.finditer(r'(import [^\n]+;)', content))
        if last_import_match:
            insert_pos = last_import_match[-1].end()
            content = content[:insert_pos] + "\n" + imp + content[insert_pos:]
            print(f"  ‚úì Added import: {imp.split()[-1]}")

# Add UserRepository field
if "private final UserRepository userRepository;" not in content:
    # Find the PossessionService line and add after it
    old_line = "private final PossessionService possessionService;"
    new_lines = old_line + "\n    private final UserRepository userRepository;"
    content = content.replace(old_line, new_lines)
    print("  ‚úì Added UserRepository field")

# Add the borrow endpoint
if "@PostMapping(\"/borrow\")" not in content:
    endpoint_code = '''
    /**
     * POST /api/possessions/borrow
     * Emprunter un livre pour l'utilisateur connect√©
     * @param livreId - ID du livre √† emprunter
     * @return La possession emprunt√©e
     */
    @PostMapping("/borrow")
    public ResponseEntity<Possession> borrow(@RequestParam Long livreId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("Utilisateur non trouv√©"));
        
        Possession possession = possessionService.borrowBook(livreId, user.getId());
        return ResponseEntity.ok(possession);
    }
'''
    content = content.rstrip() + "\n" + endpoint_code + "}\n"
    print("  ‚úì Added /borrow endpoint")
else:
    print("  ‚úì /borrow endpoint already exists")

with open(controller_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n‚úÖ All files updated successfully!")
