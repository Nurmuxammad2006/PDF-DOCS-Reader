import { useEffect, useState } from 'react';
import { fetchUserFiles, uploadFileApi } from './services/api';
import type {FileMetadata} from './types/file';
import './index.css';

// Extend window object for Telegram WebApp SDK
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

  // Extract Telegram User ID, fallback to 12345 for browser testing
  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 12345;

  const loadFiles = async () => {
    try {
      const data = await fetchUserFiles(telegramUserId);
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.Telegram?.WebApp?.expand?.();
    loadFiles();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please choose a file first!');
    setUploading(true);
    try {
      await uploadFileApi(selectedFile, telegramUserId);
      setSelectedFile(null);
      loadFiles();
      alert('File uploaded successfully!');
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '20px' }}>PDF & Doc Reader</h1>

        <div className="ios-card">
          <h3 style={{ marginTop: 0 }}>Upload Document</h3>
          <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          <button className="ios-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        <div className="ios-card">
          <h3 style={{ marginTop: 0 }}>Your Files</h3>
          {files.length === 0 ? (
              <p style={{ color: '#8e8e93', margin: 0 }}>No documents uploaded yet.</p>
          ) : (
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {files.map((file) => (
                    <li key={file.id} style={{ marginBottom: '8px' }}>
                      <strong>{file.filename}</strong> <span style={{ fontSize: '12px', color: '#8e8e93' }}>({Math.round(file.fileSize / 1024)} KB)</span>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
}