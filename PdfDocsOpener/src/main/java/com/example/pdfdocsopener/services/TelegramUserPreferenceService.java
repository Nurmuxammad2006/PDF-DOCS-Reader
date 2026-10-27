package com.example.pdfdocsopener.services;

import com.example.pdfdocsopener.entity.TelegramUserPreference;
import com.example.pdfdocsopener.repository.TelegramUserPreferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class TelegramUserPreferenceService {

    private final TelegramUserPreferenceRepository repository;

    public TelegramUserPreferenceService(TelegramUserPreferenceRepository repository) {
        this.repository = repository;
    }

    public boolean areDocumentNotificationsEnabled(Long telegramUserId) {
        return repository.findById(telegramUserId)
                .map(TelegramUserPreference::isDocumentNotificationsEnabled)
                .orElse(true);
    }

    public boolean setDocumentNotificationsEnabled(Long telegramUserId, boolean enabled) {
        TelegramUserPreference preference = repository.findById(telegramUserId)
                .orElseGet(() -> {
                    TelegramUserPreference newPreference = new TelegramUserPreference();
                    newPreference.setTelegramUserId(telegramUserId);
                    return newPreference;
                });
        preference.setDocumentNotificationsEnabled(enabled);
        return repository.save(preference).isDocumentNotificationsEnabled();
    }
}
