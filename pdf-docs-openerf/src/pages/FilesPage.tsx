import React, { useState } from 'react';
import type { FileMetadata } from '../types/file';
import { Icon } from '../components/Icon';

interface FilesPageProps {
    files: FileMetadata[];
    loading: boolean;
    onOpenFile: (file: FileMetadata) => void;
    onUploadFile: (file: File) => Promise<void>;
    uploading: boolean;
}

const getFileBadge = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
        case 'pdf':
            return { label: 'PDF', bg: '#FF3B30' }; // iOS Red
        case 'doc':
        case 'docx':
            return { label: 'DOC', bg: '#007AFF' }; // iOS Blue
        case 'xls':
        case 'xlsx':
            return { label: 'XLS', bg: '#34C759' }; // iOS Green
        case 'ppt':
        case 'pptx':
            return { label: 'PPT', bg: '#FF9500' }; // iOS Orange
        default:
            return { label: 'FILE', bg: '#8E8E93' }; // iOS Gray
    }
};

export const FilesPage: React.FC<FilesPageProps> = ({
                                                        files,
                                                        loading,
                                                        onOpenFile,
                                                    }) => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredFiles = files.filter((file) => {
        const matchesSearch = file.filename.toLowerCase().includes(search.toLowerCase());
        if (activeFilter === 'PDF') return matchesSearch && file.filename.toLowerCase().endsWith('.pdf');
        if (activeFilter === 'Documents') return matchesSearch && !file.filename.toLowerCase().endsWith('.pdf');
        return matchesSearch;
    });

    return (
        <div>
            <div className="ios-header-center">
                <h1 className="ios-title">Files</h1>
            </div>

            {/* Search Input */}
            <div className="ios-search-container">
                <span className="ios-search-icon"><Icon name="search" size={18} /></span>
                <input
                    type="text"
                    className="ios-search-input"
                    placeholder="Search files..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filter Category Pills */}
            <div className="ios-pills-container">
                {['All', 'PDF', 'Documents', 'Others'].map((category) => (
                    <button
                        key={category}
                        className={`ios-pill ${activeFilter === category ? 'active' : ''}`}
                        onClick={() => setActiveFilter(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Document List */}
            <div className="ios-card" style={{ padding: '0 16px' }}>
                {loading ? (
                    <p style={{ color: '#8e8e93', padding: '16px 0', margin: 0 }}>Loading files...</p>
                ) : filteredFiles.length === 0 ? (
                    <p style={{ color: '#8e8e93', padding: '16px 0', margin: 0 }}>No files found.</p>
                ) : (
                    filteredFiles.map((file) => {
                        const badge = getFileBadge(file.filename);

                        return (
                            <div
                                key={file.id}
                                className="ios-file-row"
                                onClick={() => onOpenFile(file)}
                            >
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
                                <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};