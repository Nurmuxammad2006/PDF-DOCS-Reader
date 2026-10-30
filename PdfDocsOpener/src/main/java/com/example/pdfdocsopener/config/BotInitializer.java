package com.example.pdfdocsopener.config;

import com.example.pdfdocsopener.bot.BotUpdateHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
public class BotInitializer {

    private static final Logger logger = LoggerFactory.getLogger(BotInitializer.class);

    @Bean
    public TelegramBotsApi telegramBotsApi(BotUpdateHandler botUpdateHandler) throws TelegramApiException {
        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        botsApi.registerBot(botUpdateHandler);
        logger.info("Telegram bot successfully registered and started listening");
        return botsApi;
    }
}