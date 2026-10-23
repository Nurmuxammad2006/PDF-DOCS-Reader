import React, { useState } from 'react';
import type { FileMetadata } from '../types/file';

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
                                                        uploading
                                                    }) => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return alert('Please select a file first!');
        await onUploadFile(selectedFile);
        setSelectedFile(null);
    };

    const filteredFiles = files.filter(file => {
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

            {/* Direct File Upload Card */}
            <div className="ios-card" style={{ marginBottom: '16px' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>
                    Upload Document
                </h3>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ width: '100%', marginBottom: '10px', fontSize: '14px' }}
                />
                <button
                    className="ios-button"
                    onClick={handleUploadClick}
                    disabled={uploading || !selectedFile}
                    style={{ marginTop: 0 }}
                >
                    {uploading ? 'Uploading...' : 'Upload Selected File'}
                </button>
            </div>

            {/* Search Input */}
            <div className="ios-search-container">
                <span className="ios-search-icon">🔍</span>
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
                    filteredFiles.map((file) => (
                        <div key={file.id} className="ios-file-row" onClick={() => onOpenFile(file)}>
                            <div className="ios-pdf-icon-badge">PDF</div>
                            <div className="ios-file-details">
                                <span className="ios-file-title">{file.filename}</span>
                                <span className="ios-file-sub">
                  {Math.round((file.fileSize / 1024 / 1024) * 10) / 10 || 0.1} MB
                </span>
                            </div>
                            <span className="ios-chevron">›</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};