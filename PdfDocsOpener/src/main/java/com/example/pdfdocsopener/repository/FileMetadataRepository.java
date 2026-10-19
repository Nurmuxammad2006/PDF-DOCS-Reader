package com.example.pdfdocsopener.repository;

import com.example.pdfdocsopener.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findByTelegramUserId(Long telegramUserId);
}
