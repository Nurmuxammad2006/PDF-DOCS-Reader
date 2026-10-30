package com.example.pdfdocsopener.exception;

import java.io.IOException;

public class InvalidFilenameException extends IOException {

    public InvalidFilenameException(String message) {
        super(message);
    }
}
