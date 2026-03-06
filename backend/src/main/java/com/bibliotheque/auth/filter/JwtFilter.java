package com.bibliotheque.auth.filter;

import com.bibliotheque.auth.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtFilter - Filtre HTTP pour valider les tokens JWT
 * 
 * Respecte AI_RULES:
 * ✅ Exécuté une fois par requête (OncePerRequestFilter)
 * ✅ Extrait le token du header Authorization
 * ✅ Valide et popule le SecurityContext
 * ✅ Transparent pour les controllers
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Extraire le token du header Authorization: Bearer <token>
            String authHeader = request.getHeader("Authorization");
            String token = null;
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);  // Enlever "Bearer "
            }
            
            // Si token existe et est valide
            if (token != null && jwtUtil.isValidToken(token)) {
                String email = jwtUtil.getEmail(token);
                String role = jwtUtil.getRole(token);
                
                // Créer l'authentification
                UsernamePasswordAuthenticationToken auth = 
                    new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                
                // Populer le SecurityContext (disponible pour @PreAuthorize)
                SecurityContextHolder.getContext().setAuthentication(auth);
                
                log.debug("Token valide pour: {}", email);
            }
            
        } catch (Exception e) {
            log.debug("Erreur validation token: {}", e.getMessage());
            // Continuer sans authentification si token invalide
        }
        
        // Continuer la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}
