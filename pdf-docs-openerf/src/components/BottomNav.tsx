import type { ReactNode } from 'react';
import type { TabType } from '../types/file';

const navItems: { label: string; tab: TabType; icon: ReactNode }[] = [
    {
        label: 'Home',
        tab: 'home',
        icon: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    },
    {
        label: 'Files',
        tab: 'files',
        icon: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
    },
    {
        label: 'Settings',
        tab: 'settings',
        icon: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="10" cy="18" r="2" fill="currentColor" /></>,
    },
];

type BottomNavProps = {
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
    className?: string;
    stickyBottom?: boolean;
};

export function BottomNav({
    currentTab,
    onTabChange,
    className,
    stickyBottom = true,
}: BottomNavProps) {
    const navClassName = [
        'bottom-nav',
        !stickyBottom && 'bottom-nav--static',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav className={navClassName} aria-label="Bottom navigation">
            {navItems.map(({ label, tab, icon }) => (
                <button
                    key={tab}
                    type="button"
                    className={`bottom-nav-item${currentTab === tab ? ' is-active' : ''}`}
                    onClick={() => onTabChange(tab)}
                    aria-current={currentTab === tab ? 'page' : undefined}
                    aria-label={label}
                >
                    <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {icon}
                    </svg>
                    <span className="bottom-nav-label" aria-hidden="true">{label}</span>
                </button>
            ))}
        </nav>
    );
}

export const BottomNavBar = BottomNav;

export default BottomNav;
