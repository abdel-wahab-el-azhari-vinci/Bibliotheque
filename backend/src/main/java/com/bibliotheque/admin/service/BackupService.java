package com.bibliotheque.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.*;
import java.nio.file.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BackupService {

    private final DataSource dataSource;

    @Value("${backup.directory:./backups}")
    private String backupDirectory;

    /**
     * Crée un backup de la base de données
     */
    public String createBackup() throws Exception {
        ensureBackupDirectoryExists();
        
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String fileName = "backup_" + timestamp + ".sql";
        Path backupPath = Paths.get(backupDirectory, fileName);

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             FileWriter fw = new FileWriter(backupPath.toFile())) {

            // Récupérer toutes les tables
            ResultSet rs = stmt.executeQuery(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()"
            );

            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                backupTable(conn, fw, tableName);
            }

            System.out.println("[OK] Backup created: " + fileName);
            return fileName;
        }
    }

    /**
     * Sauvegarde une table spécifique
     */
    private void backupTable(Connection conn, FileWriter fw, String tableName) throws Exception {
        fw.write("\n-- Table: " + tableName + "\n");
        fw.write("DROP TABLE IF EXISTS `" + tableName + "`;\n");

        // Récupérer la structure CREATE TABLE
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SHOW CREATE TABLE " + tableName)) {
            if (rs.next()) {
                String createTableSQL = rs.getString(2);
                fw.write(createTableSQL + ";\n\n");
            }
        }

        // Récupérer les données
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM " + tableName)) {

            int columnCount = rs.getMetaData().getColumnCount();
            StringBuilder insertSQL = new StringBuilder();

            while (rs.next()) {
                insertSQL = new StringBuilder("INSERT INTO `").append(tableName).append("` VALUES (");
                for (int i = 1; i <= columnCount; i++) {
                    Object value = rs.getObject(i);
                    if (value == null) {
                        insertSQL.append("NULL");
                    } else if (value instanceof String) {
                        insertSQL.append("'").append(((String) value).replace("'", "\\'")).append("'");
                    } else if (value instanceof java.sql.Date) {
                        insertSQL.append("'").append(value).append("'");
                    } else if (value instanceof java.sql.Timestamp) {
                        insertSQL.append("'").append(value).append("'");
                    } else {
                        insertSQL.append(value);
                    }
                    if (i < columnCount) {
                        insertSQL.append(", ");
                    }
                }
                insertSQL.append(");\n");
                fw.write(insertSQL.toString());
            }
        }
    }

    /**
     * Liste tous les backups disponibles
     */
    public List<Map<String, Object>> listBackups() throws Exception {
        ensureBackupDirectoryExists();
        List<Map<String, Object>> backups = new ArrayList<>();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(
                Paths.get(backupDirectory), "backup_*.sql")) {
            
            List<Path> paths = new ArrayList<>();
            stream.forEach(paths::add);
            
            // Trier par date décroissante (plus récent en premier)
            paths.sort((a, b) -> b.getFileName().toString()
                    .compareTo(a.getFileName().toString()));

            for (Path path : paths) {
                Map<String, Object> backup = new HashMap<>();
                String fileName = path.getFileName().toString();
                backup.put("id", fileName);
                backup.put("name", fileName.replace("backup_", "").replace(".sql", ""));
                backup.put("date", extractDateFromFileName(fileName));
                backup.put("size", Files.size(path) / 1024); // KB
                backups.add(backup);
            }
        }

        return backups;
    }

    /**
     * Restaure une base de données à partir d'un backup
     */
    public void restoreBackup(String backupId) throws Exception {
        ensureBackupDirectoryExists();
        Path backupPath = Paths.get(backupDirectory, backupId);

        if (!Files.exists(backupPath)) {
            throw new FileNotFoundException("Backup not found: " + backupId);
        }

        String sqlScript = Files.readString(backupPath);

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // Exécuter le script SQL line par line
            for (String sql : sqlScript.split(";")) {
                sql = sql.trim();
                if (!sql.isEmpty()) {
                    stmt.execute(sql);
                }
            }

            System.out.println("[OK] Backup restored: " + backupId);
        }
    }

    /**
     * S'assure que le répertoire de backup existe
     */
    private void ensureBackupDirectoryExists() throws IOException {
        Path path = Paths.get(backupDirectory);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }

    /**
     * Extrait la date du nom du fichier
     */
    private String extractDateFromFileName(String fileName) {
        // Format: backup_yyyy-MM-dd_HH-mm-ss.sql
        String dateStr = fileName.replace("backup_", "").replace(".sql", "");
        return dateStr.replace("_", " ").replace("-", ":");  // yyyy-MM-dd HH:mm:ss
    }
}
