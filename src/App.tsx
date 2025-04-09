import { useRef } from 'react'
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame'
import { GameStateProvider, useGameState } from './state/gameState'
import TabNavigation from './components/TabNavigation'
import CouponPage from './components/CouponPage'
import CharactersPage from './components/CharactersPage'
import SummonPage from './components/SummonPage'
import TradePage from './components/TradePage'
import LeaderboardPage from './components/LeaderboardPage'
import PageHeader from './components/PageHeader'
import { useUrlNavigation } from './hooks/useUrlNavigation'

// Main App wrapper with GameStateProvider
function AppWrapper() {
   return (
      <GameStateProvider>
         <AppContent />
      </GameStateProvider>
   )
}

// Main App content using the game state
function AppContent() {
   // References to the PhaserGame component
   const phaserRef = useRef<IRefPhaserGame | null>(null)
   const { activeTab } = useGameState()

   // Use the URL navigation hook to handle deep linking
   useUrlNavigation()

   // Render the correct page based on the active tab
   const renderActivePage = () => {
      switch (activeTab) {
         case 'coupon':
            return (
               <div className='page-content coupon-page'>
                  <CouponPage />
               </div>
            )
         case 'character':
            return (
               <div className='page-content character-page'>
                  <CharactersPage />
               </div>
            )
         case 'summon':
            return (
               <div className='page-content summon-page'>
                  <SummonPage />
               </div>
            )
         case 'trade':
            return (
               <div className='page-content trade-page'>
                  <TradePage />
               </div>
            )
         case 'leaderboard':
            return (
               <div className='page-content leaderboard-page'>
                  <LeaderboardPage />
               </div>
            )
         default:
            return null
      }
   }

   return (
      <div className='app-container h-screen flex flex-col'>
         {/* PageHeader at the top */}
         {activeTab === 'game' && (
            <div className='z-10'>
               <PageHeader title='Game' />
            </div>
         )}

         {/* Content area */}
         <div className='flex-1 overflow-hidden relative'>
            {/* The Phaser game is always rendered but only visible on game tab */}
            <div
               className={`game-container absolute inset-0 ${activeTab === 'game' ? 'active' : 'inactive h-0 overflow-hidden'}`}
            >
               <PhaserGame ref={phaserRef} />
            </div>

            {/* Overlay pages for non-game tabs */}
            {activeTab !== 'game' && (
               <div className='page-container h-full overflow-auto pb-16'>{renderActivePage()}</div>
            )}
         </div>

         {/* Tab navigation fixed at bottom */}
         <div className='tab-navigation w-full bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50'>
            <TabNavigation />
         </div>
      </div>
   )
}

export default AppWrapper
