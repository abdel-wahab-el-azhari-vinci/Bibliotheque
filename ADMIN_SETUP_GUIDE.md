# Guide de Configuration Admin - Système de Gestion des Tables

## ��� Résumé Complet

J'ai créé un **système d'administration complet** qui permet aux utilisateurs avec le rôle **ADMIN** de :
1. ✅ Voir toutes les tables de la base de données
2. ✅ Cliquer sur une table pour voir son formulaire
3. ✅ Remplir un formulaire dynamique avec tous les champs de la table
4. ✅ Enregistrer les données directement dans la base de données

---

## ��� Compte Admin

### Credentials:
```
Email: admin@bibliotheque.com
Mot de passe: Admin123
```

Ces identifiants sont insérés automatiquement via les migrations Flyway.

---

## ��� Fichiers Créés

### Backend (Java/Spring Boot)

#### 1. **Migrations SQL Flyway**
- **V1__Insert_Admin_Role_And_Status.sql** - Insertion des rôles (ADMIN, USER, LIBRARIAN) et statuts (ACTIF, INACTIF, SUSPENDU)
- **V2__Insert_Admin_User.sql** - Insertion de l'utilisateur admin

Localisation: `/backend/src/main/resources/db/migration/`

#### 2. **Service Backend**
- **TableManagementService.java** - Service Java pour :
  - Récupérer la liste des tables
  - Récupérer le schéma d'une table (colonnes, types, etc.)
  - Insérer dynamiquement les données dans une table
  - Récupérer les données existantes

Localisation: `/backend/src/main/java/com/bibliotheque/admin/service/`

#### 3. **Contrôleur Backend**
- **AdminTableController.java** - REST Controller avec 4 endpoints :
  - `GET /api/admin/database/tables` - Récupère toutes les tables
  - `GET /api/admin/database/tables/{tableName}/schema` - Récupère le schéma
  - `POST /api/admin/database/tables/{tableName}/insert` - Insère les données
  - `GET /api/admin/database/tables/{tableName}/data` - Récupère les données

Localisation: `/backend/src/main/java/com/bibliotheque/admin/controller/`

**Sécurité**: L'annotation `@PreAuthorize("hasRole('ADMIN')")` garantit que SEULS les admins peuvent accéder.

### Frontend (React Native/TypeScript)

#### 1. **Service API Admin**
- **adminService.ts** - Classe pour appeler tous les endpoints backend
  - `getTables()`
  - `getTableSchema(tableName)`
  - `insertIntoTable(tableName, data)`
  - `getTableData(tableName)`

Localisation: `/frontend/src/features/admin/services/`

#### 2. **Écrans Admin** (3 composants)

**a) AdminDashboard.tsx**
- Écran principal qui gère la navigation entre la liste des tables et le formulaire
- Permet de basculer entre les deux vues

**b) TableListScreen.tsx**
- Affiche la liste de TOUTES les tables de la base de données
- Chaque table est cliquable
- Support du refresh et gestion des erreurs

**c) DynamicFormScreen.tsx**
- Formulaire générée DYNAMIQUEMENT basé sur le schéma de la table
- Gère tous les types de colonnes :
  - Champs texte
  - Champs numériques
  - Booléens (switches)
  - Texte long (textarea)
- Validation des champs obligatoires
- Support d'insertion avec feedback visuel

Localisation: `/frontend/src/features/admin/screens/`

#### 3. **IntégrationNavigation**
- **App.tsx** modifié pour inclure la route `AdminPanel`
- Ajout d'un bouton admin ⚙️ dans le header du LivresListScreen (visible UNIQUEMENT pour les admins)

---

## ��� Comment Utiliser

### Étape 1: Démarrer le Backend
```bash
cd backend
mvn spring-boot:run
```

Les migrations Flyway s'exécutent automatiquement au démarrage, créant:
- Les rôles (ADMIN, USER, LIBRARIAN)
- Les statuts (ACTIF, INACTIF, SUSPENDU)
- L'utilisateur admin

### Étape 2: Démarrer le Frontend
```bash
cd frontend
npm run dev
```

### Étape 3: Se Connecter Admin
1. Ouvrir l'app Expo Go
2. Scanner le QR code
3. Se connecter avec:
   - Email: `admin@bibliotheque.com`
   - Password: `Admin123`

### Étape 4: Accéder à l'Admin Panel
1. Une fois connecté, vous verrez dans le header un bouton ⚙️ (visible SEULEMENT si ADMIN)
2. Cliquer sur le bouton ⚙️
3. Voir la liste de TOUTES les tables
4. Cliquer sur une table
5. Remplir le formulaire avec les données
6. Cliquer "Enregistrer"

---

## ��� Exemple de Flux Complet

```
1. Login avec admin@bibliotheque.com / Admin123
   ↓
2. Voir le bouton Admin ⚙️ dans le header
   ↓
3. Cliquer → AdminDashboard affiche TableListScreen
   ↓
4. Voir les tables: users, livres, auteurs, genres, etc.
   ↓
5. Cliquer sur "livres" → DynamicFormScreen
   ↓
6. Voir les champs: titre, isbn, resume, datePublication, etc.
   ↓
7. Remplir les champs dynamiquement (validation en temps réel)
   ↓
8. Cliquer "Enregistrer" → Les données sont insérées
   ↓
9. Success! Message "Données insérées avec succès"
```

---

## ��� Sécurité

✅ **Authentification JWT** - Utilisateurs doivent être connectés  
✅ **Vérification du Rôle** - Seuls les ADMIN peuvent accéder  
✅ **Validation SQL** - Protection contre SQL injection (parameterized queries)  
✅ **Validation des Colonnes** - Les colonnes auto-générées (ID) sont ignorées  
✅ **Validation des Champs Obligatoires** - Erreurs claires pour les champs NULL  

---

## ��� Modification du LivresListScreen

Pour ajouter le bouton admin au header, modifiez le fichier:
**File**: `/frontend/src/features/livres/screens/LivresListScreen.tsx`

Vers **ligne 210-215**, remplacez:
```javascript
<View style={styles.headerRight}>
  <TouchableOpacity 
    onPress={handleViewBorrowings} 
    style={{ marginRight: spacing.md }}
    activeOpacity={0.7}
  >
    <Ionicons name="bookmark" size={24} color={colors.white} />
  </TouchableOpacity>
  <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
    <Ionicons name="log-out-outline" size={24} color={colors.white} />
  </TouchableOpacity>
</View>
```

PAR:
```javascript
<View style={styles.headerRight}>
  {user?.role === "ADMIN" && (
    <TouchableOpacity 
      onPress={() => navigation.navigate("AdminPanel")}
      style={{ marginRight: spacing.md }}
      activeOpacity={0.7}
    >
      <Ionicons name="cog" size={24} color={colors.white} />
    </TouchableOpacity>
  )}
  <TouchableOpacity 
    onPress={handleViewBorrowings} 
    style={{ marginRight: spacing.md }}
    activeOpacity={0.7}
  >
    <Ionicons name="bookmark" size={24} color={colors.white} />
  </TouchableOpacity>
  <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
    <Ionicons name="log-out-outline" size={24} color={colors.white} />
  </TouchableOpacity>
</View>
```

---

## ���️ Dépannage

### "Accès refusé pour l'admin panel"
- Vérifiez que l'utilisateur a le rôle ADMIN
- Vérifiez le JWT token (doit inclure le rôle)
- Redémarrez le backend pour appliquer les migrations

### "Aucune table ne s'affiche"
- Les tables doivent exister dans la base MySQL
- Vérifiez la base de données avec:
  ```sql
  SHOW TABLES IN bibliotheque;
  ```

### "Erreur d'insertion"
- Vérifiez les types de données (texte, nombres, dates)
- Certains champs peuvent être obligatoires (NOT NULL)
- Les IDs auto-générées ne doivent pas être remplies (ignorées automatiquement)

---

## ��� Notes Importantes

✅ Les migrations Flyway s'exécutent UNE SEULE FOIS au démarrage  
✅ Le mot de passe admin est hashé avec BCrypt  
✅ Le formulaire est complètement dynamique (adapté à chaque table)  
✅ Support complet des types MySQL : INT, VARCHAR, DATETIME, DECIMAL, BOOLEAN, TEXT, etc.  
✅ Interface entièrement en français  

---

## ��� Fonctionnalités Avancées Décrites

- ✅ Récupération dynamique du schéma MySQL
- ✅ Validation des champs obligatoires vs optionnels
- ✅ Conversion automatique des types de données
- ✅ Gestion des erreurs avec messages clairs
- ✅ Protection contre SQL injection
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ Interface responsive et intuitive

