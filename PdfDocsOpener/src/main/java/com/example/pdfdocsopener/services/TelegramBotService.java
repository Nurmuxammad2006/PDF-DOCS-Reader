package com.example.pdfdocsopener.services;

import com.example.pdfdocsopener.entity.FileMetadata;
import com.example.pdfdocsopener.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.GetFile;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Document;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.webapp.WebAppInfo;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class TelegramBotService extends TelegramLongPollingBot {

    private final FileMetadataRepository repository;
    private final TelegramUserPreferenceService preferenceService;

    @Value("${telegram.bot.username}")
    private String botUsername;

    public TelegramBotService(
            @Value("${telegram.bot.token}") String botToken,
            FileMetadataRepository repository,
            TelegramUserPreferenceService preferenceService
    ) {
        super(botToken);
        this.repository = repository;
        this.preferenceService = preferenceService;
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasDocument()) {
            var message = update.getMessage();
            Document document = message.getDocument();
            Long userId = message.getFrom().getId();

            try {
                // Get file path from Telegram
                GetFile getFileMethod = new GetFile(document.getFileId());
                org.telegram.telegrambots.meta.api.objects.File tgFile = execute(getFileMethod);

                Path destinationPath = UploadPathResolver.resolve(document.getFileName());
                Files.createDirectories(UploadPathResolver.uploadDirectory());
                downloadFile(tgFile, destinationPath.toFile());

                // Save metadata to database
                FileMetadata metadata = new FileMetadata();
                metadata.setFilename(destinationPath.getFileName().toString());
                metadata.setFileType(document.getMimeType());
                metadata.setFileSize(document.getFileSize());
                metadata.setTelegramUserId(userId);
                repository.save(metadata);

                if (preferenceService.areDocumentNotificationsEnabled(userId)) {
                    sendSuccessMessage(message.getChatId(), document.getFileName());
                }

            } catch (Exception e) {
                e.printStackTrace();
                sendTextMessage(message.getChatId(), "Failed to save file.");
            }
        } else if (update.hasMessage() && update.getMessage().hasText()) {
            sendTextMessage(update.getMessage().getChatId(), "Forward or send any PDF or document here to save it!");
        }
    }

    private void sendSuccessMessage(Long chatId, String filename) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText("✅ File saved: *" + filename + "*");
        message.setParseMode("Markdown");

        InlineKeyboardButton button = new InlineKeyboardButton("📂 Open File Reader");
        button.setWebApp(new WebAppInfo("https://canola-deacon-occultist.ngrok-free.dev"));

        InlineKeyboardMarkup markup = new InlineKeyboardMarkup();
        markup.setKeyboard(List.of(List.of(button)));
        message.setReplyMarkup(markup);

        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private void sendTextMessage(Long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText(text);
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}