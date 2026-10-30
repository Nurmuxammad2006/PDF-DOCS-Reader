package com.example.pdfdocsopener.dto.file;

import com.example.pdfdocsopener.entity.FileMetadata;

import java.time.LocalDateTime;

public record FileResponse(
        Long id,
        String filename,
        String fileType,
        Long fileSize,
        Long telegramUserId,
        LocalDateTime uploadedAt
) {
    public static FileResponse from(FileMetadata metadata) {
        return new FileResponse(
                metadata.getId(),
                metadata.getFilename(),
                metadata.getFileType(),
                metadata.getFileSize(),
                metadata.getTelegramUserId(),
                metadata.getUploadedAt()
        );
    }
}
