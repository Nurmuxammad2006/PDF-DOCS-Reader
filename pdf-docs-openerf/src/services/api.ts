import type {FileMetadata} from '../types/file';

const API_BASE_URL = 'http://localhost:8080/api/files';

export const fetchUserFiles = async (telegramUserId: number): Promise<FileMetadata[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${telegramUserId}`);
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
};

export const uploadFileApi = async (file: File, telegramUserId: number): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('telegramUserId', telegramUserId.toString());

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
};