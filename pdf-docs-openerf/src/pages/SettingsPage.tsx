import React from 'react';
import { Icon } from '../components/Icon';

interface SettingsPageProps {
    telegramUserId: number;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ telegramUserId }) => {
    return (
        <div>
            <div className="ios-header-center">
                <h1 className="ios-title">Settings</h1>
            </div>

            {/* Profile Header */}
            <div className="ios-card ios-settings-profile">
                <div className="ios-profile-avatar">PDF</div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>PDF Bot</h3>
                    <span style={{ color: '#8e8e93', fontSize: '14px' }}>@pdf_docs_reader_bot</span>
                </div>
                <span className="ios-chevron" style={{ marginLeft: 'auto' }}><Icon name="chevron" size={18} /></span>
            </div>

            {/* Grouped Settings */}
            <div className="ios-card" style={{ padding: '0 16px' }}>
                <div className="ios-settings-row">
                    <span className="ios-settings-label"><Icon name="bell" />Notifications</span>
                    <span className="ios-settings-value">On <Icon name="chevron" size={18} /></span>
                </div>
                <div className="ios-settings-row">
                    <span className="ios-settings-label"><Icon name="shield" />Privacy & Security</span>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>
                <div className="ios-settings-row">
                    <span className="ios-settings-label"><Icon name="storage" />Data & Storage</span>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>
            </div>

            <div className="ios-card" style={{ padding: '0 16px' }}>
                <div className="ios-settings-row">
                    <span className="ios-settings-label"><Icon name="help" />Help</span>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>
                <div className="ios-settings-row">
                    <span className="ios-settings-label"><Icon name="info" />About</span>
                    <span className="ios-chevron"><Icon name="chevron" size={18} /></span>
                </div>
            </div>

            <div className="ios-card" style={{ padding: '12px 16px', textAlign: 'center' }}>
        <span style={{ color: '#ff3b30', fontWeight: 600, cursor: 'pointer' }}>
          User ID: {telegramUserId}
        </span>
            </div>
        </div>
    );
};