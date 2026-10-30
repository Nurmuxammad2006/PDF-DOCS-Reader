package com.example.pdfdocsopener.storage;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Component
public class LocalFileStorage implements FileStorage {

    private final UploadPathResolver pathResolver;

    public LocalFileStorage(UploadPathResolver pathResolver) {
        this.pathResolver = pathResolver;
    }

    @Override
    public Path save(String filename, InputStream inputStream) throws IOException {
        Path destination = pathResolver.resolve(filename);
        Files.createDirectories(pathResolver.uploadDirectory());
        Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        return destination;
    }

    @Override
    public InputStream load(String filename) throws IOException {
        return Files.newInputStream(pathResolver.resolve(filename));
    }

    @Override
    public boolean delete(String filename) throws IOException {
        return Files.deleteIfExists(pathResolver.resolve(filename));
    }

    @Override
    public boolean exists(String filename) throws IOException {
        return Files.isRegularFile(pathResolver.resolve(filename));
    }

    @Override
    public void move(String sourceFilename, String destinationFilename) throws IOException {
        Files.move(
                pathResolver.resolve(sourceFilename),
                pathResolver.resolve(destinationFilename)
        );
    }
}
