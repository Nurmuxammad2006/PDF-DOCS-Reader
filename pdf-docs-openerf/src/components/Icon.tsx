import type { ReactNode } from 'react';

export type IconName =
    | 'home'
    | 'folder'
    | 'settings'
    | 'document'
    | 'upload'
    | 'help'
    | 'search'
    | 'open'
    | 'share'
    | 'edit'
    | 'trash'
    | 'bell'
    | 'shield'
    | 'storage'
    | 'info'
    | 'chevron'
    | 'download'
    | 'more'
    | 'zoomIn'
    | 'zoomOut'
    | 'close';

const iconPaths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="10" cy="18" r="2" fill="currentColor" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1.1-2 1.5-2 3" /><path d="M12 17h.01" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    open: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" /></>,
    edit: <><path d="m16 4 4 4L9 19l-5 1 1-5z" /><path d="m14 6 4 4" /></>,
    trash: <><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></>,
    storage: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    download: <><path d="M12 4v12m-5-5 5 5 5-5" /><path d="M4 18v3h16v-3" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    zoomIn: <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5m-10.5-13v5m-2.5-2.5h5" /></>,
    zoomOut: <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5m-13-10h5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
};

type IconProps = {
    name: IconName;
    size?: number;
    className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {iconPaths[name]}
        </svg>
    );
}
