import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { fetchDocumentNotifications, updateDocumentNotifications } from '../services/api';

interface SettingsPageProps {
    telegramUserId: number;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ telegramUserId }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [notificationsSaving, setNotificationsSaving] = useState(false);
    const [notificationError, setNotificationError] = useState('');

    useEffect(() => {
        let isCurrent = true;
        fetchDocumentNotifications(telegramUserId)
            .then((enabled) => {
                if (isCurrent) setNotificationsEnabled(enabled);
            })
            .catch((error: unknown) => {
                console.error('Failed to load notification preference:', error);
                if (isCurrent) {
                    setNotificationError('Could not load notification settings.');
                }
            })
            .finally(() => {
                if (isCurrent) setNotificationsLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, [telegramUserId]);

    const handleNotificationToggle = async () => {
        const nextEnabled = !notificationsEnabled;
        setNotificationsSaving(true);
        setNotificationError('');

        try {
            const savedEnabled = await updateDocumentNotifications(telegramUserId, nextEnabled);
            setNotificationsEnabled(savedEnabled);
        } catch (error: unknown) {
            console.error('Failed to update notification preference:', error);
            setNotificationError('Could not save notification settings. Please try again.');
        } finally {
            setNotificationsSaving(false);
        }
    };

    // Fetch user profile data from Telegram WebApp SDK
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    const firstName = tgUser?.first_name || '';
    const lastName = tgUser?.last_name || '';
    const username = tgUser?.username
        ? `@${tgUser.username}`
        : 'No username';
    const fullName = `${firstName} ${lastName}`.trim() || 'Telegram user';

    // Initials for the avatar (e.g. "NU")
    const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();

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
                        disabled={notificationsLoading || notificationsSaving}
                        onClick={handleNotificationToggle}
                    >
                        <span className="ios-toggle-thumb" />
                    </button>
                </div>
                <p className="ios-settings-hint">
                    Get a Telegram message when the bot saves a document.
                </p>
                {notificationError && (
                    <p className="ios-settings-error" role="alert">{notificationError}</p>
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