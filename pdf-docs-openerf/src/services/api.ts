import axios from 'axios';
import type { FileMetadata } from '../types/file';

const API_BASE_URL = '/api';

// Axios instance configured to bypass ngrok warning pages
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
});

/**
 * Fetch all files uploaded by a specific Telegram user
 */
export const fetchUserFiles = async (
    telegramUserId: number
): Promise<FileMetadata[]> => {
    const response = await apiClient.get<FileMetadata[]>('/files', {
        params: { telegramUserId },
    });
    return response.data;
};

/**
 * Upload a document directly to Spring Boot backend
 */
export const uploadFileApi = async (
    file: File,
    telegramUserId: number
): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('telegramUserId', telegramUserId.toString());

    const response = await apiClient.post<FileMetadata>(
        '/files/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

/**
 * Delete a file by its ID
 */
export const deleteFileApi = async (fileId: number): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
};