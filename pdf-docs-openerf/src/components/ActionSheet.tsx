import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { FileMetadata } from '../types/file';
import { deleteFileApi, renameFileApi } from '../services/fileApi';
import { Icon } from './Icon';
import { formatBytes } from '../utils/formatBytes';
import { getFileBadge } from '../utils/fileIcons';

interface ActionSheetProps {
    file: FileMetadata | null;
    onClose: () => void;
    onOpen: (file: FileMetadata) => void;
    onDeleted: () => void;
    onRenamed: (file: FileMetadata) => void;
}

const copyTextToClipboard = async (text: string) => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // Try the selection-based fallback for embedded browsers.
    }

    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();

    try {
        return document.execCommand('copy');
    } catch {
        return false;
    } finally {
        input.remove();
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
    const [shareFeedback, setShareFeedback] = useState<{
        message: string;
        url: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        setIsRenaming(false);
        setRenameError('');
        setRenamePending(false);
        setShareFeedback(null);
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
            await renameFileApi(file.id, finalName);
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

    const handleShare = async () => {
        const fileUrl = `${window.location.origin}/uploads/${encodeURIComponent(file.filename)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: file.filename,
                    text: `Check out this document: ${file.filename}`,
                    url: fileUrl,
                });
                onClose();
                return;
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                console.error('Native sharing failed; trying clipboard fallback:', err);
            }
        }

        const copied = await copyTextToClipboard(fileUrl);
        setShareFeedback({
            message: copied
                ? 'Link copied. Paste it into a chat to share this file.'
                : 'Could not copy the link. Select it below and copy it manually.',
            url: fileUrl,
            isError: !copied,
        });
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
                            style={{ backgroundColor: badge.color }}
                        >
                            {badge.label}
                        </div>
                        <div className="ios-file-details">
                            <span className="ios-file-title">{file.filename}</span>
                            <span className="ios-file-sub">
                {formatBytes(file.fileSize)}
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
                            <span className="ios-sheet-action"><Icon name="open" />Open</span>
                        </button>

                        <button className="ios-sheet-btn" onClick={handleShare}>
                            <span className="ios-sheet-action"><Icon name="share" />Share</span>
                        </button>

                        <button
                            className="ios-sheet-btn"
                            onClick={() => {
                                setNewName(currentBaseName);
                                setRenameError('');
                                setIsRenaming(true);
                            }}
                        >
                            <span className="ios-sheet-action"><Icon name="edit" />Rename</span>
                        </button>

                        <button className="ios-sheet-btn danger" onClick={handleDelete}>
                            <span className="ios-sheet-action"><Icon name="trash" />Delete</span>
                        </button>
                    </div>

                    {shareFeedback && (
                        <div
                            className={`ios-share-feedback${shareFeedback.isError ? ' is-error' : ''}`}
                            role={shareFeedback.isError ? 'alert' : 'status'}
                        >
                            <p>{shareFeedback.message}</p>
                            {shareFeedback.isError && (
                                <input
                                    className="ios-share-link"
                                    type="url"
                                    value={shareFeedback.url}
                                    readOnly
                                    onFocus={(event) => event.currentTarget.select()}
                                    aria-label="File sharing link"
                                />
                            )}
                        </div>
                    )}

                    <button className="ios-sheet-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};