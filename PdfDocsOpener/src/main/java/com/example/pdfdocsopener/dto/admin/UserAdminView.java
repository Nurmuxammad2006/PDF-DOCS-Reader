package com.example.pdfdocsopener.dto.admin;

import java.time.LocalDateTime;

public record UserAdminView(
        Long telegramId,
        String username,
        boolean banned,
        long quotaBytes,
        LocalDateTime firstSeen,
        LocalDateTime lastSeen
) {
}
