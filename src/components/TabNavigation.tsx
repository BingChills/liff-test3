import { Ticket, User, Gamepad2, Store, ShoppingCart, Trophy } from 'lucide-react';
import { useGameState } from '../state/gameState';

const TabNavigation = () => {
  const { activeTab, setActiveTab } = useGameState();

  // Tab definitions with icons and labels
  const tabs = [
    { id: 'coupon', label: 'Coupon', icon: Ticket },
    { id: 'character', label: 'Character', icon: User },
    { id: 'summon', label: 'Summon', icon: Store },
    { id: 'game', label: 'Game', icon: Gamepad2 },
    { id: 'trade', label: 'Trade', icon: ShoppingCart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
