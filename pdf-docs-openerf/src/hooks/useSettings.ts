import { useEffect, useState } from 'react';
import { fetchDocumentNotifications, updateDocumentNotifications } from '../services/settingsApi';

export function useSettings(telegramUserId: number) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isCurrent = true;
        fetchDocumentNotifications(telegramUserId)
            .then((enabled) => {
                if (isCurrent) setNotificationsEnabled(enabled);
            })
            .catch((requestError: unknown) => {
                console.error('Failed to load notification preference:', requestError);
                if (isCurrent) setError('Could not load notification settings.');
            })
            .finally(() => {
                if (isCurrent) setLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, [telegramUserId]);

    const toggleNotifications = async () => {
        const nextEnabled = !notificationsEnabled;
        setSaving(true);
        setError('');
        try {
            setNotificationsEnabled(await updateDocumentNotifications(telegramUserId, nextEnabled));
        } catch (requestError: unknown) {
            console.error('Failed to update notification preference:', requestError);
            setError('Could not save notification settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return { notificationsEnabled, loading, saving, error, toggleNotifications };
}
