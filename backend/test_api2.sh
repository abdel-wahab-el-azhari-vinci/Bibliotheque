#!/bin/bash

# Enregistrer un nouvel admin avec confirmation
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8083/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testadmin2026@test.com",
    "password":"admin123456",
    "passwordConfirm":"admin123456",
    "nom":"Test",
    "prenom":"Admin",
    "telephone":"0600000000",
    "codePostal":"75000",
    "commune":"Paris"
  }')

echo "Registration Response:"
echo $REGISTER_RESPONSE | python -m json.tool 2>/dev/null || echo $REGISTER_RESPONSE

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8083/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testadmin2026@test.com",
    "password":"admin123456"
  }')

echo ""
echo "Login Response:"
echo $LOGIN_RESPONSE | python -m json.tool 2>/dev/null || echo $LOGIN_RESPONSE

# Extraire le token
TOKEN=$(echo $LOGIN_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)
echo ""
echo "Token: $TOKEN"

# Tester l'endpoint des FKs
if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "None" ]; then
  echo ""
  echo "========== TESTING FOREIGN KEYS ENDPOINT =========="
  curl -s http://localhost:8083/api/admin/database/tables/livre/foreign-keys \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool 2>/dev/null
fi
