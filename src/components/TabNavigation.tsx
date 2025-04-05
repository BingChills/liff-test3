import { Ticket, Cat, Gamepad2, Store, ArrowRightLeft, Trophy } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { useEffect } from 'react';
import { EventBus } from '../game/EventBus';

const TabNavigation = () => {
    const { activeTab, setActiveTab } = useGameState();

    // Control background music based on active tab
    useEffect(() => {
        if (activeTab === 'game') {
            EventBus.emit('playGameMusic');
        } else {
            EventBus.emit('pauseGameMusic');
        }
    }, [activeTab]);

    // Tab definitions with icons and labels
    const tabs = [
        { id: 'coupon', icon: Ticket },
        { id: 'character', icon: Cat },
        { id: 'summon', icon: Store },
        { id: 'game', icon: Gamepad2 },
        { id: 'trade', icon: ArrowRightLeft },
        { id: 'leaderboard', icon: Trophy },
    ];

    return (
        <nav className="tab-nav">
            <div className="tab-container">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            className={`tab-item ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={20} />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabNavigation;
