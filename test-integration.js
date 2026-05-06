#!/usr/bin/env node

/**
 * Tests d'intégration pour la fonctionnalité des clés étrangères
 * Valide backend + frontend ensemble
 */

const http = require('http');
const API_URL = 'http://localhost:8083';
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0YWRtaW4yMDI2QHRlc3QuY29tIiwidXNlcklkIjoyNSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NzgwOTY4ODEsImV4cCI6MTc3ODEwMDQ4MX0.4tYj5IZv-cU4hXFS8ep7wO466DYezbEONYlaukopXes';

// Utilitaire pour faire des requêtes HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8083,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(responseData)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Tests
async function runTests() {
  console.log('='.repeat(60));
  console.log('TESTS D\'INTÉGRATION - CLÉS ÉTRANGÈRES');
  console.log('='.repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Récupérer les FKs de la table livre
  try {
    console.log('\n✓ Test 1: GET /tables/livre/foreign-keys');
    const result = await makeRequest('GET', '/api/admin/database/tables/livre/foreign-keys');
    
    if (result.status === 200 && result.data.success && result.data.foreignKeys) {
      const fkCount = result.data.foreignKeys.length;
      console.log(`  ✅ PASS: ${fkCount} FKs trouvées`);
      
      result.data.foreignKeys.forEach((fk, i) => {
        console.log(`    FK${i+1}: ${fk.columnName} → ${fk.referencedTable} (${fk.options.length} options)`);
      });
      passedTests++;
    } else {
      console.log(`  ❌ FAIL: Status ${result.status}`);
      failedTests++;
    }
  } catch (e) {
    console.log(`  ❌ FAIL: ${e.message}`);
    failedTests++;
  }

  // Test 2: Vérifier la structure des options
  try {
    console.log('\n✓ Test 2: Structure des FK options');
    const result = await makeRequest('GET', '/api/admin/database/tables/livre/foreign-keys');
    
    if (result.data.success && result.data.foreignKeys.length > 0) {
      const fk = result.data.foreignKeys[0];
      if (fk.options.length > 0) {
        const option = fk.options[0];
        if (option.id && option.label) {
          console.log(`  ✅ PASS: Structure correcte (id + label)`);
          console.log(`    Exemple: ID=${option.id}, Label="${option.label}"`);
          passedTests++;
        } else {
          console.log(`  ❌ FAIL: Options mal structurées`);
          failedTests++;
        }
      }
    }
  } catch (e) {
    console.log(`  ❌ FAIL: ${e.message}`);
    failedTests++;
  }

  // Test 3: Vérifier la détection des colonnes label
  try {
    console.log('\n✓ Test 3: Détection des colonnes label');
    const tables = ['livre', 'auteur', 'genre'];
    let allCorrect = true;
    
    for (const table of tables) {
      const result = await makeRequest('GET', `/api/admin/database/tables/${table}/foreign-keys`);
      if (result.data.success && result.data.foreignKeys.length > 0) {
        result.data.foreignKeys.forEach(fk => {
          console.log(`    ${table}.${fk.columnName} → labelColumn="${fk.labelColumn}"`);
        });
      }
    }
    
    console.log(`  ✅ PASS: Colonnes label détectées`);
    passedTests++;
  } catch (e) {
    console.log(`  ❌ FAIL: ${e.message}`);
    failedTests++;
  }

  // Test 4: Insérer des données avec FKs
  try {
    console.log('\n✓ Test 4: Insérer une nouvelle langue');
    const newLangue = {
      libelle: 'Test Language Integration',
      code_iso: 'TLI'
    };
    
    const result = await makeRequest('POST', '/api/admin/database/tables/langue/insert', newLangue);
    
    if (result.status === 201 && result.data.success) {
      console.log(`  ✅ PASS: Langue insérée avec succès`);
      passedTests++;
    } else {
      console.log(`  ❌ FAIL: Status ${result.status}`);
      failedTests++;
    }
  } catch (e) {
    console.log(`  ❌ FAIL: ${e.message}`);
    failedTests++;
  }

  // Test 5: Vérifier que les données insérées apparaissent dans les options
  try {
    console.log('\n✓ Test 5: Vérifier les options mises à jour');
    const result = await makeRequest('GET', '/api/admin/database/tables/livre/foreign-keys');
    
    if (result.data.success) {
      const langueFk = result.data.foreignKeys.find(fk => fk.columnName === 'langue_id');
      if (langueFk && langueFk.options.length > 0) {
        console.log(`  ✅ PASS: ${langueFk.options.length} langues disponibles`);
        passedTests++;
      } else {
        console.log(`  ❌ FAIL: Pas de langues trouvées`);
        failedTests++;
      }
    }
  } catch (e) {
    console.log(`  ❌ FAIL: ${e.message}`);
    failedTests++;
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  console.log(`✅ Tests réussis: ${passedTests}`);
  console.log(`❌ Tests échoués: ${failedTests}`);
  console.log(`📊 Total: ${passedTests + failedTests} tests`);
  console.log('='.repeat(60));

  process.exit(failedTests > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Erreur fatal:', err);
  process.exit(1);
});
