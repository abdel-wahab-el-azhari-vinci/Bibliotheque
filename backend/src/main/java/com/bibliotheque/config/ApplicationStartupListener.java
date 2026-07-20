package com.bibliotheque.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartupListener {
    private static final Logger logger = LoggerFactory.getLogger(ApplicationStartupListener.class);

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${app.jwt.secret:****}")
    private String jwtSecret;

    private final Environment environment;

    public ApplicationStartupListener(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String activeProfile = String.join(", ", environment.getActiveProfiles());
        if (activeProfile.isEmpty()) {
            activeProfile = "default";
        }

        logger.info("╔════════════════════════════════════════════════════╗");
        logger.info("║          🚀 BIBLIOTHÈQUE BACKEND STARTED 🚀         ║");
        logger.info("╠════════════════════════════════════════════════════╣");
        logger.info("║ 🔌 Server Port    : {}", String.format("%-33s║", serverPort));
        logger.info("║ 📊 Active Profile : {}", String.format("%-31s║", activeProfile));
        logger.info("║ 💾 Database       : {}", String.format("%-32s║", extractDbName(dbUrl)));
        logger.info("║ 🔐 JWT Configured : {}", String.format("%-32s║", "✓ Yes"));
        logger.info("╚════════════════════════════════════════════════════╝");
    }

    private String extractDbName(String dbUrl) {
        if (dbUrl == null) return "Not configured";
        try {
            // Extract database name from JDBC URL
            String[] parts = dbUrl.split("/");
            if (parts.length > 0) {
                String dbPart = parts[parts.length - 1];
                return dbPart.split("\\?")[0]; // Remove query params
            }
        } catch (Exception e) {
            // Fallback
        }
        return dbUrl;
    }
}
