import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { FileMetadata } from '../types/file';
import { deleteFileApi, renameFileApi } from '../services/api';

interface ActionSheetProps {
    file: FileMetadata | null;
    onClose: () => void;
    onOpen: (file: FileMetadata) => void;
    onDeleted: () => void;
    onRenamed: (file: FileMetadata) => void;
}

const getFileBadge = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
        case 'pdf':
            return { label: 'PDF', bg: '#FF3B30' };
        case 'doc':
        case 'docx':
            return { label: 'DOC', bg: '#007AFF' };
        case 'xls':
        case 'xlsx':
            return { label: 'XLS', bg: '#34C759' };
        case 'ppt':
        case 'pptx':
            return { label: 'PPT', bg: '#FF9500' };
        default:
            return { label: 'FILE', bg: '#8E8E93' };
    }
};

export const ActionSheet: React.FC<ActionSheetProps> = ({
                                                            file,
                                                            onClose,
                                                            onOpen,
                                                            onDeleted,
                                                            onRenamed,
                                                        }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');
    const [renameError, setRenameError] = useState('');
    const [renamePending, setRenamePending] = useState(false);

    useEffect(() => {
        setIsRenaming(false);
        setRenameError('');
        setRenamePending(false);
    }, [file?.id]);

    if (!file) return null;

    const badge = getFileBadge(file.filename);
    const extensionIndex = file.filename.lastIndexOf('.');
    const extension = extensionIndex > 0 ? file.filename.slice(extensionIndex) : '';
    const currentBaseName = extension
        ? file.filename.slice(0, extensionIndex)
        : file.filename;

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${file.filename}?`)) return;

        try {
            await deleteFileApi(file.id);
            onDeleted();
            onClose();
            alert('File deleted successfully.');
        } catch (err) {
            console.error('Failed to delete file:', err);
            alert('Failed to delete file.');
        }
    };

    const handleRename = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = newName.trim();
        if (!trimmedName || trimmedName === currentBaseName || renamePending) return;

        // Keep the original extension
        const finalName = extension ? `${trimmedName}${extension}` : trimmedName;

        setRenamePending(true);
        setRenameError('');

        try {
            await renameFileApi(file.id, finalName); // Send full name with extension

            onRenamed({
                ...file,
                filename: finalName,
            });

            onClose();
        } catch (err) {
            console.error('Failed to rename file:', err);

            const response = axios.isAxiosError(err) ? err.response : undefined;
            const responseData = response?.data;
            const responseMessage =
                typeof responseData === 'string'
                    ? responseData
                    : responseData?.message || responseData?.error;

            setRenameError(
                typeof responseMessage === 'string' && /ngrok|<html|<!doctype/i.test(responseMessage)
                    ? 'The secure tunnel could not reach the backend. Check that the backend is running on port 8080 and the frontend tunnel is connected.'
                    : typeof responseMessage === 'string'
                        ? responseMessage
                        : response
                            ? `Rename failed (HTTP ${response.status}).`
                            : 'Could not reach the backend. Check that it is running and try again.',
            );
        } finally {
            setRenamePending(false);
        }
    };

    return (
        <div className="ios-modal-overlay" onClick={isRenaming ? undefined : onClose}>
            {isRenaming ? (
                <form
                    className="ios-rename-dialog"
                    onSubmit={handleRename}
                    onClick={(event) => event.stopPropagation()}
                >
                    <h2 className="ios-rename-title">Rename file</h2>
                    <p className="ios-rename-description">
                        Enter a new name. The {extension || 'file'} type will stay the same.
                    </p>

                    <div className="ios-rename-input-row">
                        <input
                            autoFocus
                            className="ios-rename-input"
                            value={newName}
                            onChange={(event) => setNewName(event.target.value)}
                            aria-label="File name"
                            maxLength={255}
                            disabled={renamePending}
                        />
                        {extension && <span className="ios-rename-extension">{extension}</span>}
                    </div>

                    {renameError && (
                        <p className="ios-rename-error" role="alert">
                            {renameError}
                        </p>
                    )}

                    <div className="ios-rename-actions">
                        <button
                            type="button"
                            className="ios-rename-cancel"
                            onClick={() => setIsRenaming(false)}
                            disabled={renamePending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ios-rename-save"
                            disabled={
                                renamePending ||
                                !newName.trim() ||
                                newName.trim() === currentBaseName
                            }
                        >
                            {renamePending ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="ios-action-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="ios-sheet-header">
                        <div
                            className="ios-pdf-icon-badge"
                            style={{ backgroundColor: badge.bg }}
                        >
                            {badge.label}
                        </div>
                        <div className="ios-file-details">
                            <span className="ios-file-title">{file.filename}</span>
                            <span className="ios-file-sub">
                {Math.round((file.fileSize / 1024 / 1024) * 10) / 10 || 0.1} MB
              </span>
                        </div>
                    </div>

                    <div className="ios-sheet-group">
                        <button
                            className="ios-sheet-btn"
                            onClick={() => {
                                onOpen(file);
                                onClose();
                            }}
                        >
                            <span>👁️ Open</span>
                        </button>

                        <button
                            className="ios-sheet-btn"
                            onClick={() => {
                                setNewName(currentBaseName);
                                setRenameError('');
                                setIsRenaming(true);
                            }}
                        >
                            <span>✏️ Rename</span>
                        </button>

                        <button className="ios-sheet-btn danger" onClick={handleDelete}>
                            <span>🗑️ Delete</span>
                        </button>
                    </div>

                    <button className="ios-sheet-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};