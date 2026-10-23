import React from 'react';
import type { FileMetadata } from '../types/file';
import { deleteFileApi } from '../services/api';

interface ActionSheetProps {
    file: FileMetadata | null;
    onClose: () => void;
    onOpen: (file: FileMetadata) => void;
    onDeleted: () => void; // Callback to refresh file list
}

export const ActionSheet: React.FC<ActionSheetProps> = ({ file, onClose, onOpen, onDeleted }) => {
    if (!file) return null;

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

    return (
        <div className="ios-modal-overlay" onClick={onClose}>
            <div className="ios-action-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="ios-sheet-header">
                    <div className="ios-pdf-icon-badge">PDF</div>
                    <div className="ios-file-details">
                        <span className="ios-file-title">{file.filename}</span>
                        <span className="ios-file-sub">
              {Math.round((file.fileSize / 1024 / 1024) * 10) / 10 || 0.1} MB
            </span>
                    </div>
                </div>

                <div className="ios-sheet-group">
                    <button className="ios-sheet-btn" onClick={() => { onOpen(file); onClose(); }}>
                        <span>👁️ Open</span>
                    </button>
                    <button className="ios-sheet-btn danger" onClick={handleDelete}>
                        <span>🗑️ Delete</span>
                    </button>
                </div>

                <button className="ios-sheet-cancel" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};