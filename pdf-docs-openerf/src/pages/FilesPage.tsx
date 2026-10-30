import React, { useRef, useState } from 'react';
import type { FileMetadata } from '../types/file';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { formatBytes } from '../utils/formatBytes';
import { getFileBadge } from '../utils/fileIcons';

interface FilesPageProps {
    files: FileMetadata[];
    loading: boolean;
    onOpenFile: (file: FileMetadata) => void;
    onUploadFile: (file: File) => Promise<void>;
    uploading: boolean;
}

export const FilesPage: React.FC<FilesPageProps> = ({
                                                        files,
                                                        loading,
                                                        onOpenFile,
                                                        onUploadFile,
                                                        uploading,
                                                    }) => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const uploadInputRef = useRef<HTMLInputElement>(null);

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

            <input
                ref={uploadInputRef}
                className="visually-hidden"
                type="file"
                aria-label="Choose a file to upload"
                onChange={(event) => {
                    const selectedFile = event.currentTarget.files?.[0];
                    if (selectedFile) void onUploadFile(selectedFile);
                    event.currentTarget.value = '';
                }}
            />
            <Button
                type="button"
                className="files-upload-button"
                disabled={uploading}
                onClick={() => uploadInputRef.current?.click()}
            >
                {uploading ? <Spinner label="Uploading…" /> : <><Icon name="upload" />Upload file</>}
            </Button>

            {/* Document List */}
            <div className="ios-card" style={{ padding: '0 16px' }}>
                {loading ? (
                    <Spinner label="Loading files…" />
                ) : filteredFiles.length === 0 ? (
                    <EmptyState
                        title={files.length ? 'No matching files' : 'No files yet'}
                        description={files.length ? 'Try another search or filter.' : 'Upload a document to get started.'}
                    />
                ) : (
                    filteredFiles.map((file) => {
                        const badge = getFileBadge(file.filename);

                        return (
                            <div
                                key={file.id}
                                className="ios-file-row"
                                onClick={() => onOpenFile(file)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        onOpenFile(file);
                                    }
                                }}
                            >
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
                                <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};