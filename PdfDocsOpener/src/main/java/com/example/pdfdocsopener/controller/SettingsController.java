package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.services.TelegramUserPreferenceService;
import com.example.pdfdocsopener.dto.settings.SettingsResponse;
import com.example.pdfdocsopener.dto.settings.UpdateSettingsRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings/notifications")
public class SettingsController {

    private final TelegramUserPreferenceService preferenceService;

    public SettingsController(TelegramUserPreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public SettingsResponse getNotificationPreference(
            @RequestParam Long telegramUserId
    ) {
        return new SettingsResponse(
                preferenceService.areDocumentNotificationsEnabled(telegramUserId)
        );
    }

    @PutMapping
    public SettingsResponse updateNotificationPreference(
            @RequestParam Long telegramUserId,
            @RequestBody UpdateSettingsRequest request
    ) {
        return new SettingsResponse(
                preferenceService.setDocumentNotificationsEnabled(telegramUserId, request.enabled())
        );
    }
}
