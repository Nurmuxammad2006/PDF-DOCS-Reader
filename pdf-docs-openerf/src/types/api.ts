export interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
}

export interface TelegramWebApp {
    initData: string;
    initDataUnsafe?: {
        user?: TelegramUser;
    };
    themeParams?: Record<string, string>;
    colorScheme?: 'light' | 'dark';
    expand: () => void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: TelegramWebApp;
        };
    }
}

export interface ApiErrorResponse {
    code?: string;
    error?: string;
    message?: string;
    status?: string;
}
