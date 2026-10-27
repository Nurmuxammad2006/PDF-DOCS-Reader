import { lazy, Suspense, useEffect, useState } from 'react';
import { fetchUserFiles, uploadFileApi } from './services/api';
import type { FileMetadata, TabType } from './types/file';
import { BottomNavBar } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { FilesPage } from './pages/FilesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ActionSheet } from './components/ActionSheet';
import './index.css';

const ViewerPage = lazy(() =>
    import('./pages/ViewerPage').then(({ ViewerPage: page }) => ({ default: page })),
);

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('files');
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFile, setActiveFile] = useState<FileMetadata | null>(null);
  const [viewingFile, setViewingFile] = useState<FileMetadata | null>(null);

  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1524926268;

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchUserFiles(telegramUserId);
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      setUploading(true);
      await uploadFileApi(file, telegramUserId);
      await loadFiles();
      alert('File uploaded successfully!');
    } catch (err) {
      console.error("Upload error:", err);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileRenamed = async (updatedFile: FileMetadata) => {
    setFiles((currentFiles) =>
        currentFiles.map((file) => (file.id === updatedFile.id ? updatedFile : file)),
    );
    await loadFiles(); // Reload to keep state fresh
  };

  useEffect(() => {
    try {
      window.Telegram?.WebApp?.expand?.();
    } catch (e) {
      console.warn("Telegram WebApp API not detected");
    }
    loadFiles();
  }, []);

  // 🛑 STOP HERE IF VIEWING A FILE: This completely replaces the screen
  if (viewingFile) {
    return (
        <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
        >
          <Suspense fallback={<div className="ios-viewer-loading">Loading document viewer…</div>}>
            <ViewerPage
                file={viewingFile}
                onClose={() => setViewingFile(null)}
            />
          </Suspense>
        </div>
    );
  }

  return (
      <div className="ios-container">
        {currentTab === 'home' && (
            <HomePage onNavigate={setCurrentTab} fileCount={files.length} />
        )}

        {currentTab === 'files' && (
            <FilesPage
                files={files}
                loading={loading}
                onOpenFile={(file) => setActiveFile(file)}
                onUploadFile={handleUploadFile}
                uploading={uploading}
            />
        )}

        {currentTab === 'settings' && (
            <SettingsPage telegramUserId={telegramUserId} />
        )}

        <ActionSheet
            file={activeFile}
            onClose={() => setActiveFile(null)}
            onOpen={(file) => setViewingFile(file)}
            onDeleted={() => loadFiles()}
            onRenamed={handleFileRenamed}
        />

        <BottomNavBar currentTab={currentTab} onTabChange={setCurrentTab} stickyBottom />
      </div>
  );
}