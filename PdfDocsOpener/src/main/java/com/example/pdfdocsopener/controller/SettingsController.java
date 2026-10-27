package com.example.pdfdocsopener.controller;

import com.example.pdfdocsopener.services.TelegramUserPreferenceService;
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
    public NotificationPreferenceResponse getNotificationPreference(
            @RequestParam Long telegramUserId
    ) {
        return new NotificationPreferenceResponse(
                preferenceService.areDocumentNotificationsEnabled(telegramUserId)
        );
    }

    @PutMapping
    public NotificationPreferenceResponse updateNotificationPreference(
            @RequestParam Long telegramUserId,
            @RequestBody NotificationPreferenceRequest request
    ) {
        return new NotificationPreferenceResponse(
                preferenceService.setDocumentNotificationsEnabled(telegramUserId, request.enabled())
        );
    }

    public record NotificationPreferenceRequest(boolean enabled) {
    }

    public record NotificationPreferenceResponse(boolean enabled) {
    }
}
