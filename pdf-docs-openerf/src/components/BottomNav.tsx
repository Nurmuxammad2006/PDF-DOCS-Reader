import React from 'react';
import type { TabType } from '../types/file';

interface BottomNavProps {
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    return (
        <div className="ios-bottom-nav">
            <button
                className={`ios-nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => onTabChange('home')}
            >
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
            </button>
            <button
                className={`ios-nav-item ${currentTab === 'files' ? 'active' : ''}`}
                onClick={() => onTabChange('files')}
            >
                <span className="nav-icon">📁</span>
                <span className="nav-label">Files</span>
            </button>
            <button
                className={`ios-nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
            >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">Settings</span>
            </button>
        </div>
    );
};