import axios from 'axios';
import type { FileMetadata } from '../types/file';

// Use your backend ngrok URL here so your phone can reach Spring Boot
const API_BASE_URL = 'https://canola-deacon-occultist.ngrok-free.dev/api';

export const fetchUserFiles = async (
    telegramUserId: number
): Promise<FileMetadata[]> => {
    const response = await axios.get(`${API_BASE_URL}/files`, {
        params: { telegramUserId },
    });

    return response.data;
};

export const uploadFileApi = async (
    file: File,
    telegramUserId: number
): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('telegramUserId', telegramUserId.toString());

    const response = await axios.post(
        `${API_BASE_URL}/files/upload`,
        formData
    );

    return response.data;
};