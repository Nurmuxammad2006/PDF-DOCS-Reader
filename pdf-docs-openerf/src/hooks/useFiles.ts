import { useCallback, useEffect, useState } from 'react';
import type { FileMetadata } from '../types/file';
import { fetchUserFiles, uploadFileApi } from '../services/fileApi';

export function useFiles(telegramUserId: number) {
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUserFiles(telegramUserId);
            setFiles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load files:', error);
            setFiles([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [telegramUserId]);

    useEffect(() => {
        let isCurrent = true;
        fetchUserFiles(telegramUserId)
            .then((data) => {
                if (isCurrent) setFiles(Array.isArray(data) ? data : []);
            })
            .catch((error: unknown) => {
                console.error('Failed to load files:', error);
                if (isCurrent) setFiles([]);
            })
            .finally(() => {
                if (isCurrent) setLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, [telegramUserId]);

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        try {
            await uploadFileApi(file, telegramUserId);
            await loadFiles();
        } finally {
            setUploading(false);
        }
    }, [loadFiles, telegramUserId]);

    const updateFile = useCallback((updatedFile: FileMetadata) => {
        setFiles((currentFiles) =>
            currentFiles.map((file) => file.id === updatedFile.id ? updatedFile : file),
        );
    }, []);

    return { files, loading, uploading, loadFiles, uploadFile, updateFile };
}
