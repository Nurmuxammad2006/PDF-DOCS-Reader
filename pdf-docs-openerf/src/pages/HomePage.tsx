import React from 'react';
import type { TabType } from '../types/file';
import { Icon } from '../components/Icon';

interface HomePageProps {
    onNavigate: (tab: TabType) => void;
    fileCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, fileCount }) => {
    return (
        <div>
            <div className="ios-header-center">
                <h1 className="ios-title">PDF Bot</h1>
                <span className="ios-subtitle">mini app</span>
            </div>

            <div className="ios-hero-section">
                <div className="ios-hero-icon"><Icon name="document" size={34} /></div>
                <h2 className="ios-hero-title">PDF Bot</h2>
                <p className="ios-hero-text">
                    Send me a PDF file and I'll open it for you right here. You can also use the <span className="ios-link">/help</span> command to see what I can do.
                </p>
            </div>

            <div className="ios-menu-card">
                <div className="ios-menu-item" onClick={() => onNavigate('files')}>
                    <div className="ios-menu-icon blue-bg"><Icon name="upload" /></div>
                    <div className="ios-menu-content">
                        <span className="ios-menu-title">Open PDF</span>
                        <span className="ios-menu-desc">Send a PDF file or choose from your files.</span>
                    </div>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>

                <div className="ios-menu-item" onClick={() => onNavigate('files')}>
                    <div className="ios-menu-icon purple-bg"><Icon name="folder" /></div>
                    <div className="ios-menu-content">
                        <span className="ios-menu-title">My Files</span>
                        <span className="ios-menu-desc">View your uploaded files ({fileCount}).</span>
                    </div>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>

                <div className="ios-menu-item" onClick={() => onNavigate('settings')}>
                    <div className="ios-menu-icon green-bg"><Icon name="help" /></div>
                    <div className="ios-menu-content">
                        <span className="ios-menu-title">Help</span>
                        <span className="ios-menu-desc">Commands and information.</span>
                    </div>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>
            </div>
        </div>
    );
};