interface SpinnerProps {
    label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
    return (
        <span className="ui-spinner-wrap" role="status">
            <span className="ui-spinner" aria-hidden="true" />
            <span>{label}</span>
        </span>
    );
}
