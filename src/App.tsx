import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { GameStateProvider, useGameState } from "./state/gameState";
import TabNavigation from "./components/TabNavigation";
import CouponPage from "./components/CouponPage";
import CharactersPage from "./components/CharactersPage";
import SummonPage from "./components/SummonPage";
import TradePage from "./components/TradePage";
import LeaderboardPage from "./components/LeaderboardPage";

// Main App wrapper with GameStateProvider
function AppWrapper() {
    return (
        <GameStateProvider>
            <AppContent />
        </GameStateProvider>
    );
}

// Main App content using the game state
function AppContent() {
    // References to the PhaserGame component
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const { activeTab } = useGameState();

    // Render the correct page based on the active tab
    const renderActivePage = () => {
        switch (activeTab) {
            case 'coupon':
                return <div className="page-content coupon-page"><CouponPage /></div>;
            case 'character':
                return <div className="page-content character-page"><CharactersPage /></div>;
            case 'summon':
                return <div className="page-content summon-page"><SummonPage /></div>;
            case 'trade':
                return <div className="page-content trade-page"><TradePage /></div>;
            case 'leaderboard':
                return <div className="page-content leaderboard-page"><LeaderboardPage /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <div className="game-wrapper">
                {/* The Phaser game is always rendered but only visible on game tab */}
                <div className={`game-container ${activeTab === 'game' ? 'active' : 'inactive'}`}>
                    <PhaserGame ref={phaserRef} />
                </div>

                {/* Overlay pages for non-game tabs */}
                {activeTab !== 'game' && (
                    <div className="page-container">
                        {renderActivePage()}
                    </div>
                )}
                
                {/* Tab navigation at bottom */}
                <div className="tab-navigation">
                    <TabNavigation />
                </div>
            </div>
        </div>
    );
}

export default AppWrapper;
