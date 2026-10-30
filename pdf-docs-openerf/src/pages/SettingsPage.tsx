import React from 'react';
import { Icon } from '../components/Icon';
import { useSettings } from '../hooks/useSettings';
import { StorageUsageBar } from '../components/StorageUsageBar';
import type { TelegramUser } from '../types/api';

interface SettingsPageProps {
    telegramUserId: number;
    usedBytes: number;
    telegramUser?: TelegramUser;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
    telegramUserId,
    usedBytes,
    telegramUser: tgUser,
}) => {
    const { notificationsEnabled, loading, saving, error, toggleNotifications } =
        useSettings(telegramUserId);

    const firstName = tgUser?.first_name || '';
    const lastName = tgUser?.last_name || '';
    const username = tgUser?.username
        ? `@${tgUser.username}`
        : 'No username';
    const fullName = `${firstName} ${lastName}`.trim() || 'Telegram user';

    // Initials for the avatar (e.g. "NU")
    const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase() || 'U';

    return (
        <div>
            <div className="ios-header-center">
                <h1 className="ios-title">Settings</h1>
            </div>

            {/* Profile Header */}
            <div className="ios-card ios-settings-profile">
                <div className="ios-profile-avatar">{initials}</div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{fullName}</h3>
                    <span style={{ color: '#8e8e93', fontSize: '14px' }}>{username}</span>
                </div>
                <span className="ios-chevron" style={{ marginLeft: 'auto' }}>
                    <Icon name="chevron" size={18} />
                </span>
            </div>

            {/* Grouped Settings */}
            <div className="ios-card" style={{ padding: '0 16px' }}>
                <div className="ios-settings-row ios-settings-notifications">
                    <span className="ios-settings-label">
                        <Icon name="bell" />Notifications
                    </span>
                    <button
                        type="button"
                        className={`ios-toggle${notificationsEnabled ? ' is-on' : ''}`}
                        role="switch"
                        aria-checked={notificationsEnabled}
                        aria-label="Notifications for documents saved by the Telegram bot"
                        disabled={loading || saving}
                        onClick={() => void toggleNotifications()}
                    >
                        <span className="ios-toggle-thumb" />
                    </button>
                </div>
                <p className="ios-settings-hint">
                    Get a Telegram message when the bot saves a document.
                </p>
                {error && (
                    <p className="ios-settings-error" role="alert">{error}</p>
                )}
                <div className="ios-settings-row">
                    <span className="ios-settings-label">
                        <Icon name="shield" />Privacy & Security
                    </span>
                    <span className="ios-chevron">
                        <Icon name="chevron" size={18} />
                    </span>
                </div>
                <div className="ios-settings-row">
                    <span className="ios-settings-label">
                        <Icon name="storage" />Data & Storage
                    </span>
                    <span className="ios-chevron">
                        <Icon name="chevron" size={18} />
                    </span>
                </div>
            </div>

            <div className="ios-card" style={{ padding: '0 16px' }}>
                <StorageUsageBar usedBytes={usedBytes} />
                <div className="ios-settings-row">
                    <span className="ios-settings-label">
                        <Icon name="help" />Help
                    </span>
                    <span className="ios-chevron">
                        <Icon name="chevron" size={18} />
                    </span>
                </div>
                <div className="ios-settings-row">
                    <span className="ios-settings-label">
                        <Icon name="info" />About
                    </span>
                    <span className="ios-chevron">
                        <Icon name="chevron" size={18} />
                    </span>
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