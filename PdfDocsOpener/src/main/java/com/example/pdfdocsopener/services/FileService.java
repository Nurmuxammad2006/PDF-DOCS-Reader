package com.example.pdfdocsopener.services;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.repository.FileMetadataRepository;
import com.example.pdfdocsopener.storage.FileStorage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    private final FileMetadataRepository repository;
    private final FileStorage storage;

    public FileService(FileMetadataRepository repository, FileStorage storage) {
        this.repository = repository;
        this.storage = storage;
    }

    public List<FileMetadata> getFilesByUser(Long telegramUserId) {
        return repository.findByTelegramUserId(telegramUserId);
    }

    public FileMetadata saveFile(MultipartFile file, Long telegramUserId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        try (InputStream inputStream = file.getInputStream()) {
            storage.save(originalFilename, inputStream);
        }

        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(originalFilename);
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

            storage.delete(fileMetadata.getFilename());

            repository.delete(fileMetadata);
            return true;
        }
        return false;
    }

    public FileMetadata renameFile(Long id, String newFilename) throws IOException {
        Optional<FileMetadata> optionalFile = repository.findById(id);
        if (optionalFile.isEmpty()) {
            throw new FileNotFoundException("File not found");
        }

        FileMetadata fileMetadata = optionalFile.get();
        String oldFilename = fileMetadata.getFilename();
        String requestedName = newFilename == null ? null : newFilename.trim();
        int extensionIndex = oldFilename.lastIndexOf('.');
        String extension = extensionIndex > 0 ? oldFilename.substring(extensionIndex) : "";
        if (extensionIndex > 0 && requestedName != null
                && requestedName.toLowerCase().endsWith(extension.toLowerCase())) {
            requestedName = requestedName.substring(0, requestedName.length() - extension.length());
        }
        String newFilenameWithExtension = requestedName == null ? null : requestedName + extension;

        if (oldFilename.equals(newFilenameWithExtension)) {
            return fileMetadata;
        }
        if (!storage.exists(oldFilename)) {
            throw new FileNotFoundException("File not found on disk");
        }

        storage.move(oldFilename, newFilenameWithExtension);
        fileMetadata.setFilename(newFilenameWithExtension);
        try {
            return repository.save(fileMetadata);
        } catch (RuntimeException persistenceError) {
            try {
                storage.move(newFilenameWithExtension, oldFilename);
            } catch (IOException rollbackError) {
                persistenceError.addSuppressed(rollbackError);
            }
            throw persistenceError;
        }
    }
}