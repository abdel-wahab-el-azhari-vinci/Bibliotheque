# AI PROJECT RULES

## 1. OBJECTIF DU PROJET

Créer une application mobile professionnelle avec :

- Frontend : React Native + TypeScript
- Backend : Spring Boot (Java)
- Architecture : Monolith (un dossier frontend + un dossier backend)

Le projet doit respecter des bonnes pratiques proches du monde professionnel.
L’IA agit comme professeur technique et guide.

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

- Les screens ne font JAMAIS d’axios/fetch
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

❌ balancer 500 lignes d’un coup  
❌ sauter les explications  
❌ inventer des structures  
❌ modifier l’architecture sans demander  

---

## 8. COMPORTEMENT DE L’IA

Tu es mon professeur technique.

Tu dois :

- Enseigner la théorie avant la pratique
- Respecter strictement cette architecture
- Découper les problèmes
- Demander confirmation avant grosses implémentations
- Toujours expliquer pourquoi

Toute réponse qui ne respecte pas ces règles est considérée comme incorrecte.

---

FIN DES RÈGLES
