import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { Document, Page, pdfjs } from 'react-pdf';
import type { FileMetadata } from '../types/file';
import { Icon } from '../components/Icon';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface ViewerPageProps {
    file: FileMetadata;
    onClose: () => void;
}

export const ViewerPage: React.FC<ViewerPageProps> = ({ file, onClose }) => {
    const fileUrl = `/uploads/${encodeURIComponent(file.filename)}`;
    const isPdf = file.filename.toLowerCase().endsWith('.pdf');
    const isDocx = file.filename.toLowerCase().endsWith('.docx');
    const [pageCount, setPageCount] = useState(0);
    const [pageWidth, setPageWidth] = useState(() => window.innerWidth - 32);
    const [zoomState, setZoomState] = useState({ fileId: file.id, value: 1 });
    const [documentHtml, setDocumentHtml] = useState('');
    const [documentError, setDocumentError] = useState('');
    const [documentLoading, setDocumentLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const activePointers = useRef(new Map<number, { x: number; y: number }>());
    const pinchStartDistance = useRef<number | null>(null);
    const pinchStartZoom = useRef(1);
    const zoom = zoomState.fileId === file.id ? zoomState.value : 1;

    const setZoom = (value: number) => {
        setZoomState({ fileId: file.id, value: Math.min(4, Math.max(1, value)) });
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'touch') return;

        activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (activePointers.current.size === 2) {
            const [first, second] = Array.from(activePointers.current.values());
            pinchStartDistance.current = Math.hypot(first.x - second.x, first.y - second.y);
            pinchStartZoom.current = zoom;
        }
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!activePointers.current.has(event.pointerId)) return;

        const previousPosition = activePointers.current.get(event.pointerId)!;
        activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (activePointers.current.size === 1) {
            event.preventDefault();
            if (contentRef.current) {
                contentRef.current.scrollLeft -= event.clientX - previousPosition.x;
                contentRef.current.scrollTop -= event.clientY - previousPosition.y;
            }
            return;
        }
        if (activePointers.current.size !== 2 || !pinchStartDistance.current) return;

        const [first, second] = Array.from(activePointers.current.values());
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        event.preventDefault();
        setZoom(pinchStartZoom.current * distance / pinchStartDistance.current);
    };

    const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
        activePointers.current.delete(event.pointerId);
        if (activePointers.current.size < 2) pinchStartDistance.current = null;
    };

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const observer = new ResizeObserver(([entry]) => {
            setPageWidth(Math.max(200, entry.contentRect.width - 24));
        });
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isDocx) return;

        const controller = new AbortController();
        const loadDocument = async () => {
            setDocumentLoading(true);
            setDocumentError('');
            try {
                const response = await fetch(fileUrl, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Could not load document (HTTP ${response.status}).`);
                }
                const result = await mammoth.convertToHtml({
                    arrayBuffer: await response.arrayBuffer(),
                });
                setDocumentHtml(DOMPurify.sanitize(result.value));
            } catch (error) {
                if (!controller.signal.aborted) {
                    setDocumentError(error instanceof Error ? error.message : 'Could not display this document.');
                }
            } finally {
                if (!controller.signal.aborted) setDocumentLoading(false);
            }
        };

        loadDocument();
        return () => controller.abort();
    }, [fileUrl, isDocx]);

    return (
        <div className="ios-viewer-container">
            {/* Top iOS Header */}
            <div className="ios-viewer-header">
                <button className="ios-back-btn" onClick={onClose}>Close</button>
                <div className="ios-viewer-title-box">
                    <span className="ios-viewer-title">{file.filename}</span>
                    <span className="ios-viewer-sub">
            {Math.round((file.fileSize / 1024 / 1024) * 10) / 10 || 0.1} MB
          </span>
                </div>
                <button className="ios-more-btn" type="button" aria-label="More options">
                    <Icon name="more" />
                </button>
            </div>

            {/* Embedded Document View */}
            <div
                className="ios-viewer-content"
                ref={contentRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                {isPdf ? (
                    <div className="ios-pdf-document" style={{ zoom }}>
                        <Document
                            file={fileUrl}
                            onLoadSuccess={({ numPages }) => setPageCount(numPages)}
                            loading={<p className="ios-document-status">Loading PDF…</p>}
                            error={<p className="ios-document-status">Could not load this PDF. Try downloading it.</p>}
                            noData={<p className="ios-document-status">This PDF is empty.</p>}
                        >
                            {Array.from({ length: pageCount }, (_, index) => (
                                <Page
                                    key={`page-${index + 1}`}
                                    pageNumber={index + 1}
                                    width={pageWidth}
                                />
                            ))}
                        </Document>
                    </div>
                ) : isDocx ? (
                    <div className="ios-word-document" style={{ fontSize: `${16 * zoom}px` }}>
                        {documentLoading && <p className="ios-document-status">Loading document…</p>}
                        {documentError && <p className="ios-document-status">{documentError}</p>}
                        {!documentLoading && !documentError && (
                            <div dangerouslySetInnerHTML={{ __html: documentHtml }} />
                        )}
                    </div>
                ) : (
                    <div className="ios-doc-placeholder">
                        <div className="ios-doc-placeholder-icon"><Icon name="document" size={64} /></div>
                        <h3>{file.filename}</h3>
                        <p>In-app preview supports PDF and DOCX files. Download this file to open it.</p>
                        <a
                            href={fileUrl}
                            download
                            className="ios-button"
                            style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}
                        >
                            Download Document
                        </a>
                    </div>
                )}
            </div>

            {/* Bottom Viewer Toolbar */}
            <div className="ios-viewer-toolbar">
                <button className="ios-tool-btn" onClick={() => window.open(fileUrl, '_blank')}>
                    <Icon name="download" />
                    <label>Download</label>
                </button>
                {(isPdf || isDocx) && (
                    <div className="ios-zoom-controls">
                        <button
                            className="ios-tool-btn"
                            aria-label="Zoom out"
                            disabled={zoom <= 1}
                            onClick={() => setZoom(zoom - 0.25)}
                        >
                            <Icon name="zoomOut" />
                            <label>Zoom out</label>
                        </button>
                        <span className="ios-zoom-level">{Math.round(zoom * 100)}%</span>
                        <button
                            className="ios-tool-btn"
                            aria-label="Zoom in"
                            disabled={zoom >= 4}
                            onClick={() => setZoom(zoom + 0.25)}
                        >
                            <Icon name="zoomIn" />
                            <label>Zoom in</label>
                        </button>
                    </div>
                )}
                <button className="ios-tool-btn" onClick={() => alert('Sharing options')}>
                    <Icon name="share" />
                    <label>Share</label>
                </button>
                <button className="ios-tool-btn" onClick={() => alert('Searching within document...')}>
                    <Icon name="search" />
                    <label>Search</label>
                </button>
            </div>
        </div>
    );
};