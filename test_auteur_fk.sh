#!/bin/bash

# Utiliser le token du test précédent
TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0YWRtaW4yMDI2QHRlc3QuY29tIiwidXNlcklkIjoyNSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NzgwOTY4ODEsImV4cCI6MTc3ODEwMDQ4MX0.4tYj5IZv-cU4hXFS8ep7wO466DYezbEONYlaukopXes"

echo "========== TABLE: auteur (Auteurs) =========="
curl -s http://localhost:8083/api/admin/database/tables/auteur/foreign-keys \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool

echo ""
echo "========== TABLE: genre (Genres) =========="
curl -s http://localhost:8083/api/admin/database/tables/genre/foreign-keys \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
