import axios from 'axios';
import type { ApiErrorResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
});

apiClient.interceptors.request.use((config) => {
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) config.headers.set('X-Telegram-Init-Data', initData);
    return config;
});

function isBannedResponse(status: number | undefined, data: unknown): boolean {
    if (typeof data === 'string') {
        return data.trim().toLowerCase() === 'banned'
            || (status === 403 && data.toLowerCase().includes('banned'));
    }
    if (status !== 403 && (!data || typeof data !== 'object')) return false;
    if (!data || typeof data !== 'object') return false;

    const response = data as ApiErrorResponse;
    const explicitBanStatus = [response.code, response.status]
        .some((value) => typeof value === 'string' && value.toLowerCase() === 'banned');
    return explicitBanStatus || (
        status === 403
        && [response.error, response.message]
            .some((value) => typeof value === 'string' && value.toLowerCase().includes('banned'))
    );
}

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && isBannedResponse(error.response?.status, error.response?.data)) {
            window.dispatchEvent(new CustomEvent('app:user-banned'));
        }
        return Promise.reject(error);
    },
);