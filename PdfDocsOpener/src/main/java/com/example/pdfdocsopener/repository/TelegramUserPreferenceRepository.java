package com.example.pdfdocsopener.repository;

import com.example.pdfdocsopener.entity.TelegramUserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TelegramUserPreferenceRepository extends JpaRepository<TelegramUserPreference, Long> {
}
