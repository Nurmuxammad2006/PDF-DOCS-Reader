import { useEffect } from 'react';
import type { TelegramUser, TelegramWebApp } from '../types/api';

export function useTelegram() {
    const webApp: TelegramWebApp | undefined = window.Telegram?.WebApp;
    const user: TelegramUser | undefined = webApp?.initDataUnsafe?.user;

    useEffect(() => {
        if (!webApp) return;
        try {
            webApp.expand();
        } catch (error) {
            console.warn('Could not expand the Telegram WebApp:', error);
        }
    }, [webApp]);

    return {
        webApp,
        user,
        initData: webApp?.initData ?? '',
        themeParams: webApp?.themeParams,
        colorScheme: webApp?.colorScheme ?? 'light',
    };
}
