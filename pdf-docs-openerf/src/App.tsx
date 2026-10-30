import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { FileMetadata, TabType } from './types/file';
import { HomePage } from './pages/HomePage';
import { FilesPage } from './pages/FilesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ActionSheet } from './components/ActionSheet';
import { MainLayout } from './layout/MainLayout';
import { BannedPage } from './pages/BannedPage';
import { useFiles } from './hooks/useFiles';
import { useTelegram } from './hooks/useTelegram';
import { Toast, type ToastMessage } from './components/ui/Toast';
import './index.css';

const ViewerPage = lazy(() =>
    import('./pages/ViewerPage').then(({ ViewerPage: page }) => ({ default: page })),
);

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('files');
  const [activeFile, setActiveFile] = useState<FileMetadata | null>(null);
  const [viewingFile, setViewingFile] = useState<FileMetadata | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const { user } = useTelegram();
  const telegramUserId = user?.id ?? 1524926268;
  const { files, loading, uploading, loadFiles, uploadFile, updateFile } = useFiles(telegramUserId);

  const handleFileRenamed = async (updatedFile: FileMetadata) => {
    updateFile(updatedFile);
    await loadFiles();
  };

  useEffect(() => {
    const handleBanned = () => setIsBanned(true);
    window.addEventListener('app:user-banned', handleBanned);
    return () => window.removeEventListener('app:user-banned', handleBanned);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleUploadFile = async (file: File) => {
    try {
      await uploadFile(file);
      setToast({ message: 'File uploaded successfully.', kind: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ message: 'Failed to upload file.', kind: 'error' });
    }
  };

  if (isBanned) return <BannedPage />;

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
      <>
        <MainLayout currentTab={currentTab} onTabChange={setCurrentTab}>
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
              <SettingsPage
                  telegramUserId={telegramUserId}
                  usedBytes={files.reduce((total, file) => total + file.fileSize, 0)}
                  telegramUser={user}
              />
          )}

          <ActionSheet
              file={activeFile}
              onClose={() => setActiveFile(null)}
              onOpen={(file) => setViewingFile(file)}
              onDeleted={() => { void loadFiles().catch(() => undefined); }}
              onRenamed={handleFileRenamed}
          />
        </MainLayout>

        {toast && <Toast {...toast} onDismiss={dismissToast} />}
      </>
  );
}