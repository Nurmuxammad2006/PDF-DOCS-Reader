package com.example.pdfdocsopener.services;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UploadPathResolverTests {

    @Test
    void resolvesFilenameInsideUploadDirectory() throws IOException {
        Path resolvedPath = UploadPathResolver.resolve("document.pdf");

        assertTrue(resolvedPath.startsWith(UploadPathResolver.uploadDirectory()));
        assertEquals("document.pdf", resolvedPath.getFileName().toString());
    }

    @Test
    void rejectsPathTraversalFilename() {
        assertThrows(IOException.class, () -> UploadPathResolver.resolve("../outside.txt"));
        assertThrows(IOException.class, () -> UploadPathResolver.resolve("..\\outside.txt"));
    }
}
