import type { SettingsResponse, UpdateSettingsRequest } from '../types/settings';
import { apiClient } from './api';

export const fetchDocumentNotifications = async (telegramUserId: number): Promise<boolean> => {
    const response = await apiClient.get<SettingsResponse>('/settings/notifications', {
        params: { telegramUserId },
    });
    return response.data.enabled;
};

export const updateDocumentNotifications = async (
    telegramUserId: number,
    enabled: boolean,
): Promise<boolean> => {
    const request: UpdateSettingsRequest = { enabled };
    const response = await apiClient.put<SettingsResponse>(
        '/settings/notifications',
        request,
        { params: { telegramUserId } },
    );
    return response.data.enabled;
};
