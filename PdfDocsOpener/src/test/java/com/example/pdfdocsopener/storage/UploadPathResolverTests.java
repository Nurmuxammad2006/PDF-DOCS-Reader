package com.example.pdfdocsopener.storage;

import com.example.pdfdocsopener.config.properties.StorageProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UploadPathResolverTests {

    private UploadPathResolver resolver;

    @BeforeEach
    void setUp() {
        resolver = new UploadPathResolver(new StorageProperties());
    }

    @Test
    void resolvesFilenameInsideUploadDirectory() throws IOException {
        Path resolvedPath = resolver.resolve("document.pdf");

        assertTrue(resolvedPath.startsWith(resolver.uploadDirectory()));
        assertEquals("document.pdf", resolvedPath.getFileName().toString());
    }

    @Test
    void rejectsPathTraversalFilename() {
        assertThrows(IOException.class, () -> resolver.resolve("../outside.txt"));
        assertThrows(IOException.class, () -> resolver.resolve("..\\outside.txt"));
    }
}
