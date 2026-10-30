import { useEffect } from 'react';

export interface ToastMessage {
    message: string;
    kind: 'success' | 'error';
}

interface ToastProps extends ToastMessage {
    onDismiss: () => void;
}

export function Toast({ message, kind, onDismiss }: ToastProps) {
    useEffect(() => {
        const timeout = window.setTimeout(onDismiss, 3500);
        return () => window.clearTimeout(timeout);
    }, [message, onDismiss]);

    return (
        <div className={`ui-toast ui-toast--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
            <span>{message}</span>
            <button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button>
        </div>
    );
}
