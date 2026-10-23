import { useEffect, useState } from 'react';
import { fetchUserFiles, uploadFileApi } from './services/api';
import type { FileMetadata } from './types/file';
import './index.css';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
          };
        };
      };
    };
  }
}

export default function App() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extract Telegram User ID, default to testing ID if missing
  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1524926268;

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchUserFiles(telegramUserId);
      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Failed to load files:", err);
      setFiles([]); // Graceful fallback so UI doesn't crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      window.Telegram?.WebApp?.expand?.();
    } catch (e) {
      console.warn("Telegram WebApp API not detected");
    }
    loadFiles();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please choose a file first!');
    setUploading(true);
    try {
      await uploadFileApi(selectedFile, telegramUserId);
      setSelectedFile(null);
      await loadFiles();
      alert('File uploaded successfully!');
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
      <div className="ios-container">
        <div className="ios-header">Document Reader</div>

        <div className="ios-card">
          <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600 }}>Upload New File</h3>
          <input
              type="file"
              style={{ margin: '10px 0', fontSize: '14px', width: '100%' }}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          <button className="ios-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

        <div className="ios-card">
          <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600 }}>Your Files</h3>
          {loading ? (
              <p style={{ color: '#8e8e93', margin: '10px 0', fontSize: '15px' }}>Loading documents...</p>
          ) : files.length === 0 ? (
              <p style={{ color: '#8e8e93', margin: '10px 0', fontSize: '15px' }}>No documents uploaded yet.</p>
          ) : (
              <div>
                {files.map((file) => (
                    <div key={file.id} className="ios-file-item">
                      <div className="ios-file-info">
                        <span className="ios-file-name">📄 {file.filename}</span>
                        <span className="ios-file-meta">
                    {Math.round(file.fileSize / 1024)} KB
                  </span>
                      </div>
                      <button
                          style={{ background: 'none', border: 'none', color: '#007aff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                          onClick={() => alert(`Opening ${file.filename}...`)}
                      >
                        Open
                      </button>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}