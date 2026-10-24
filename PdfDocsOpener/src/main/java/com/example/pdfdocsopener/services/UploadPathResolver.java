package com.example.pdfdocsopener.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

final class UploadPathResolver {

    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().normalize();

    private UploadPathResolver() {
    }

    static Path uploadDirectory() {
        return UPLOAD_DIR;
    }

    static Path resolve(String filename) throws IOException {
        if (filename == null || filename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be blank");
        }

        if (filename.equals(".") || filename.equals("..")
                || filename.indexOf('/') >= 0 || filename.indexOf('\\') >= 0
                || filename.getBytes(StandardCharsets.UTF_8).length > 255
                || filename.chars().anyMatch(Character::isISOControl)) {
            throw new InvalidFilenameException("Filename contains invalid characters or is too long");
        }

        Path resolvedPath = UPLOAD_DIR.resolve(filename).normalize();
        if (!resolvedPath.startsWith(UPLOAD_DIR)) {
            throw new InvalidFilenameException("File path must stay inside the uploads directory");
        }
        return resolvedPath;
    }
}
