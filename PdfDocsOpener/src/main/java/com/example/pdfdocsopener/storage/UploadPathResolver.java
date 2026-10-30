package com.example.pdfdocsopener.storage;

import com.example.pdfdocsopener.config.properties.StorageProperties;
import com.example.pdfdocsopener.exception.InvalidFilenameException;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public final class UploadPathResolver {

    private final Path uploadDirectory;

    public UploadPathResolver(StorageProperties storageProperties) {
        this.uploadDirectory = Paths.get(storageProperties.getUploadDir()).toAbsolutePath().normalize();
    }

    public Path uploadDirectory() {
        return uploadDirectory;
    }

    public Path resolve(String filename) throws IOException {
        if (filename == null || filename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be blank");
        }

        if (filename.equals(".") || filename.equals("..")
                || filename.indexOf('/') >= 0 || filename.indexOf('\\') >= 0
                || filename.getBytes(StandardCharsets.UTF_8).length > 255
                || filename.chars().anyMatch(Character::isISOControl)) {
            throw new InvalidFilenameException("Filename contains invalid characters or is too long");
        }

        Path resolvedPath = uploadDirectory.resolve(filename).normalize();
        if (!resolvedPath.startsWith(uploadDirectory)) {
            throw new InvalidFilenameException("File path must stay inside the uploads directory");
        }
        return resolvedPath;
    }
}
