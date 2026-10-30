import { formatBytes } from '../utils/formatBytes';

interface StorageUsageBarProps {
    usedBytes: number;
    quotaBytes?: number;
}

export function StorageUsageBar({ usedBytes, quotaBytes }: StorageUsageBarProps) {
    const hasQuota = typeof quotaBytes === 'number' && quotaBytes > 0;
    const percentage = hasQuota
        ? Math.min(100, Math.round((usedBytes / quotaBytes) * 100))
        : 0;

    return (
        <div className="storage-usage">
            <div className="storage-usage__labels">
                <span>Storage used</span>
                <span>
                    {formatBytes(usedBytes)}
                    {hasQuota && ` of ${formatBytes(quotaBytes)}`}
                </span>
            </div>
            {hasQuota && (
                <div
                    className="storage-usage__track"
                    role="progressbar"
                    aria-label="Storage usage"
                    aria-valuemin={0}
                    aria-valuemax={quotaBytes}
                    aria-valuenow={Math.min(usedBytes, quotaBytes)}
                >
                    <span style={{ width: `${percentage}%` }} />
                </div>
            )}
        </div>
    );
}
