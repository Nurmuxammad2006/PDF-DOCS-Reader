package com.example.pdfdocsopener.services;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.repository.FileMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FileService {

    private static final String UPLOAD_DIR = "uploads/";
    private final FileMetadataRepository repository;

    public FileService(FileMetadataRepository repository) {
        this.repository = repository;
    }

    public FileMetadata saveFile(MultipartFile file, Long telegramUserId) throws IOException {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) directory.mkdirs();

        Path filePath = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
        Files.write(filePath, file.getBytes());

        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(file.getOriginalFilename());
        metadata.setFileType(file.getContentType());
        metadata.setFileSize(file.getSize());
        metadata.setTelegramUserId(telegramUserId);

        return repository.save(metadata);
    }

    public List<FileMetadata> getFilesByUser(Long telegramUserId) {
        return repository.findByTelegramUserId(telegramUserId);
    }
}
