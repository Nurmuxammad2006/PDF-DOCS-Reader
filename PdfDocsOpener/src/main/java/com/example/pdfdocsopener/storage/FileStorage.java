package com.example.pdfdocsopener.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

public interface FileStorage {

    Path save(String filename, InputStream inputStream) throws IOException;

    InputStream load(String filename) throws IOException;

    boolean delete(String filename) throws IOException;

    boolean exists(String filename) throws IOException;

    void move(String sourceFilename, String destinationFilename) throws IOException;
}
