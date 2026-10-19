package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.services.FileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public FileMetadata uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("telegramUserId") Long telegramUserId) throws IOException {
        return fileService.saveFile(file, telegramUserId);
    }

    @GetMapping("/user/{telegramUserId}")
    public List<FileMetadata> getFilesByUser(@PathVariable Long telegramUserId) {
        return fileService.getFilesByUser(telegramUserId);
    }
}