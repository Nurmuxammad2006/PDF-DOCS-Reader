package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.repository.FileMetadataRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileMetadataRepository repository;

    public FileController(FileMetadataRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<FileMetadata> getFilesByUser(@RequestParam Long telegramUserId) {
        return repository.findByTelegramUserId(telegramUserId);
    }
}