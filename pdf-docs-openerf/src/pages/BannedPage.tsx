import { Icon } from '../components/Icon';

export function BannedPage() {
    return (
        <main className="ios-banned-page">
            <Icon name="shield" size={48} />
            <h1>Account unavailable</h1>
            <p>This Telegram account is currently banned from using the service.</p>
        </main>
    );
}
