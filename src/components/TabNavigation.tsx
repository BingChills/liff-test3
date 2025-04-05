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
        { id: 'coupon', icon: Ticket, label: 'Coupons' },
        { id: 'character', icon: Cat, label: 'Characters' },
        { id: 'summon', icon: Store, label: 'Summon' },
        { id: 'game', icon: Gamepad2, label: 'Game' },
        { id: 'trade', icon: ArrowRightLeft, label: 'Trade' },
        { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    ];

    return (
        <nav className="tab-nav">
            <div className="tab-container flex justify-between w-full px-4 py-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            className={`tab-item flex flex-col items-center justify-center p-2 ${
                                isActive 
                                ? 'text-blue-600 relative' 
                                : 'text-gray-500'
                            } transition-colors duration-150 active:scale-95 hover:text-blue-400`}
                            onClick={() => setActiveTab(tab.id)}
                            aria-label={tab.label}
                            title={tab.label}
                        >
                            <Icon size={20} />
                            {isActive && (
                                <span className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600" style={{ borderRadius: '0' }}></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabNavigation;
