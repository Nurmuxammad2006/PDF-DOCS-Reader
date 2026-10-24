package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.services.FileService;
import com.example.pdfdocsopener.services.InvalidFilenameException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    public List<FileMetadata> getFilesByUser(@RequestParam Long telegramUserId) {
        return fileService.getFilesByUser(telegramUserId);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("telegramUserId") Long telegramUserId
    ) {
        try {
            FileMetadata saved = fileService.saveFile(file, telegramUserId);
            return ResponseEntity.ok(saved);
        } catch (InvalidFilenameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload file");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) throws IOException {
        boolean deleted = fileService.deleteFile(id);
        if (deleted) {
            return ResponseEntity.ok().body("File deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/rename")
    public ResponseEntity<?> renameFile(
            @PathVariable Long id,
            @RequestParam("newFilename") String newFilename
    ) {
        try {
            FileMetadata updated = fileService.renameFile(id, newFilename);
            return ResponseEntity.ok(updated);
        } catch (InvalidFilenameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (FileAlreadyExistsException e) {
            return ResponseEntity.status(409).body("A file with that name already exists.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to rename file");
        }
    }
}