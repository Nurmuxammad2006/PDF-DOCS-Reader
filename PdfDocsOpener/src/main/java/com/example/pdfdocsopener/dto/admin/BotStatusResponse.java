package com.example.pdfdocsopener.dto.admin;

public record BotStatusResponse(
        boolean enabled,
        boolean paused,
        String maintenanceMessage
) {
}
