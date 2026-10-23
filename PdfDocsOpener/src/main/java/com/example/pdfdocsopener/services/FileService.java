package com.example.pdfdocsopener.services;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.repository.FileMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    private final FileMetadataRepository repository;

    public FileService(FileMetadataRepository repository) {
        this.repository = repository;
    }

    public List<FileMetadata> getFilesByUser(Long telegramUserId) {
        return repository.findByTelegramUserId(telegramUserId);
    }

    public FileMetadata saveFile(MultipartFile file, Long telegramUserId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        Path destinationPath = UploadPathResolver.resolve(originalFilename);

        Files.createDirectories(UploadPathResolver.uploadDirectory());

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationPath, StandardCopyOption.REPLACE_EXISTING);
        }

        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(destinationPath.getFileName().toString());
        metadata.setFileType(file.getContentType());
        metadata.setFileSize(file.getSize());
        metadata.setTelegramUserId(telegramUserId);
        metadata.setUploadedAt(LocalDateTime.now());

        return repository.save(metadata);
    }

    public boolean deleteFile(Long id) throws IOException {
        Optional<FileMetadata> optionalFile = repository.findById(id);
        if (optionalFile.isPresent()) {
            FileMetadata fileMetadata = optionalFile.get();

            Path filePath = UploadPathResolver.resolve(fileMetadata.getFilename());
            Files.deleteIfExists(filePath);

            repository.delete(fileMetadata);
            return true;
        }
        return false;
    }
}