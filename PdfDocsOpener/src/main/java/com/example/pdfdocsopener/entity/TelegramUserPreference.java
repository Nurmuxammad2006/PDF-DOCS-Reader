package com.example.pdfdocsopener.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "telegram_user_preferences")
public class TelegramUserPreference {

    @Id
    @Column(name = "telegram_user_id")
    private Long telegramUserId;

    @Column(name = "document_notifications_enabled", nullable = false)
    private boolean documentNotificationsEnabled = true;
}
