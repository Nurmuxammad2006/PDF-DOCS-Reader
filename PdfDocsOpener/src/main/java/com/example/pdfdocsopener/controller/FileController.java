package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.services.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
}