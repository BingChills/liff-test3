import { useEffect } from 'react';
import { useGameState } from '../state/gameState';

// Hook that reads URL parameters and sets the appropriate active tab
// Enables direct deep linking to specific tabs from LINE rich menu
export const useUrlNavigation = () => {
    const { setActiveTab } = useGameState();

    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        // Get the URL parameters
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');

        // Map of valid page parameter values to tab IDs
        const validPages = {
            coupon: 'coupon',
            character: 'character',
            summon: 'summon',
            game: 'game',
            trade: 'trade',
            leaderboard: 'leaderboard',
        };

        // If a valid page parameter is found, set the active tab
        if (pageParam && validPages[pageParam as keyof typeof validPages]) {
            const tabId = validPages[pageParam as keyof typeof validPages];
            setActiveTab(tabId);
            console.log(`Navigation: Setting active tab to ${tabId} from URL parameter`);
        }
    }, [setActiveTab]); // Only run when setActiveTab changes or on initial mount
};
