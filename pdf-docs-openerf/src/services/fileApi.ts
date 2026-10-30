import type { FileMetadata } from '../types/file';
import { apiClient } from './api';

export const fetchUserFiles = async (telegramUserId: number): Promise<FileMetadata[]> => {
    const response = await apiClient.get<FileMetadata[]>('/files', {
        params: { telegramUserId },
    });
    return response.data;
};

export const uploadFileApi = async (
    file: File,
    telegramUserId: number,
): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('telegramUserId', telegramUserId.toString());

    const response = await apiClient.post<FileMetadata>('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteFileApi = async (fileId: number): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
};

export const renameFileApi = async (
    fileId: number,
    newFilename: string,
): Promise<FileMetadata> => {
    const response = await apiClient.put<FileMetadata>(
        `/files/${fileId}/rename`,
        null,
        { params: { newFilename } },
    );
    return response.data;
};
