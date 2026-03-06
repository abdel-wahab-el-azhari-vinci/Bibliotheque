package com.bibliotheque.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JwtUtil - Génération et validation des tokens JWT
 * 
 * Respecte AI_RULES:
 * ✅ Centralisé pour toute la logique JWT
 * ✅ Pas de logique métier (juste crypto)
 * ✅ Service va l'appeler
 */
@Component
public class JwtUtil {
    
    @Value("${app.jwt.secret}")
    private String secretKey;
    
    @Value("${app.jwt.expiration}")
    private long expirationTime;  // en millisecondes
    
    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpirationTime;
    
    /**
     * Générer un token JWT
     */
    public String generateToken(String email, Long userId, String role) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        
        return Jwts.builder()
            .setSubject(email)
            .claim("userId", userId)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }
    
    /**
     * Générer un refresh token
     */
    public String generateRefreshToken(String email, Long userId) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        
        return Jwts.builder()
            .setSubject(email)
            .claim("userId", userId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }
    
    /**
     * Extraire tous les claims du token
     */
    public Claims getAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
    
    /**
     * Extraire l'email (subject) du token
     */
    public String getEmail(String token) {
        return getAllClaims(token).getSubject();
    }
    
    /**
     * Extraire le userId du token
     */
    public Long getUserId(String token) {
        return getAllClaims(token).get("userId", Long.class);
    }
    
    /**
     * Extraire le role du token
     */
    public String getRole(String token) {
        return getAllClaims(token).get("role", String.class);
    }
    
    /**
     * Vérifier si le token est expiré
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getAllClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;  // Token invalide = considéré comme expiré
        }
    }
    
    /**
     * Vérifier si le token est valide
     */
    public boolean isValidToken(String token) {
        try {
            getAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Retourner le temps d'expiration en secondes
     */
    public long getExpirationInSeconds() {
        return expirationTime / 1000;
    }
}
