import type { TabType } from '../types/file';
import { Icon, type IconName } from './Icon';

const navItems: { label: string; tab: TabType; icon: IconName }[] = [
    { label: 'Home', tab: 'home', icon: 'home' },
    { label: 'Files', tab: 'files', icon: 'folder' },
    { label: 'Settings', tab: 'settings', icon: 'settings' },
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
                    <Icon name={icon} className="bottom-nav-icon" />
                    <span className="bottom-nav-label" aria-hidden="true">{label}</span>
                </button>
            ))}
        </nav>
    );
}

export const BottomNavBar = BottomNav;

export default BottomNav;
