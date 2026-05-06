#!/bin/bash

# Enregistrer un nouvel admin
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8083/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teadadmin@test.com",
    "password":"admin123456",
    "nom":"Test",
    "prenom":"Admin",
    "telephone":"0600000000",
    "codePostal":"75000",
    "commune":"Paris"
  }')

echo "Registration Response: $REGISTER_RESPONSE"

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8083/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teadadmin@test.com",
    "password":"admin123456"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extraire le token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Tester l'endpoint des FKs
if [ ! -z "$TOKEN" ]; then
  echo ""
  echo "Testing Foreign Keys Endpoint:"
  curl -s http://localhost:8083/api/admin/database/tables/livre/foreign-keys \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool
fi
