export interface FileMetadata {
    id: number;
    filename: string;
    fileType: string;
    fileSize: number;
    telegramUserId: number;
    uploadedAt?: string;
}

export type TabType = 'home' | 'files' | 'settings';

export type FileListResponse = FileMetadata[];