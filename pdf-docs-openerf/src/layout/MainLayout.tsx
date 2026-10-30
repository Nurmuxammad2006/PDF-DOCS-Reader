import type { ReactNode } from 'react';
import type { TabType } from '../types/file';
import { BottomNavBar } from '../components/BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function MainLayout({ children, currentTab, onTabChange }: MainLayoutProps) {
    return (
        <div className="ios-container">
            {children}
            <BottomNavBar currentTab={currentTab} onTabChange={onTabChange} stickyBottom />
        </div>
    );
}