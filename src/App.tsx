import { useRef, useState } from 'react'
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame'
import { GameStateProvider, useGameState } from './state/gameState'
import TabNavigation from './components/TabNavigation'
import CouponPage from './components/CouponPage'
import CharactersPage from './components/CharactersPage'
import SummonPage from './components/GachaPage'
import TradePage from './components/TradePage'
import LeaderboardPage from './components/LeaderboardPage'
import PageHeader from './components/PageHeader'
import { useUrlNavigation } from './hooks/useUrlNavigation'
import { Info, X } from 'lucide-react'

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
   const [showGameInfo, setShowGameInfo] = useState(false)

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

               {/* Game info button - only visible on game tab */}
               {activeTab === 'game' && (
                  <button
                     className='absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center z-50'
                     onClick={() => setShowGameInfo(true)}
                  >
                     <Info className='w-6 h-6 text-white drop-shadow-md' />
                  </button>
               )}
            </div>

            {/* Overlay pages for non-game tabs */}
            {activeTab !== 'game' && (
               <div className='page-container h-full overflow-auto pb-16'>{renderActivePage()}</div>
            )}
         </div>

         {/* Game Info Modal */}
         {showGameInfo && (
            <div
               className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50'
               onClick={() => setShowGameInfo(false)}
            >
               <div
                  className='bg-white w-[90%] max-w-md rounded-3xl shadow-2xl overflow-hidden'
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className='relative'>
                     <button
                        onClick={() => setShowGameInfo(false)}
                        className='absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10'
                     >
                        <X className='w-5 h-5 text-blue-600' />
                     </button>

                     <div className='p-6'>
                        <h2 className='text-xl font-bold text-center mb-6'>How to Play</h2>

                        <div className='space-y-4'>
                           <div className='bg-blue-50 p-3 rounded-xl'>
                              <h3 className='font-bold text-blue-700 mb-1'>Game Objective</h3>
                              <p className='text-sm text-gray-700'>
                                 Tap and break chests to earn points and collect coupons.
                              </p>
                           </div>

                           <div className='bg-green-50 p-3 rounded-xl'>
                              <h3 className='font-bold text-green-700 mb-1'>Score</h3>
                              <p className='text-sm text-gray-700'>Higher score help you rank on the leaderboard.</p>
                           </div>

                           <div className='bg-orange-50 p-3 rounded-xl'>
                              <h3 className='font-bold text-orange-700 mb-1'>Stamina</h3>
                              <p className='text-sm text-gray-700'>Used for auto play. Manage it wisely!</p>
                           </div>
                        </div>

                        <button
                           onClick={() => setShowGameInfo(false)}
                           className='w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold'
                        >
                           Let's Play!
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Tab navigation fixed at bottom */}
         <div className='tab-navigation w-full bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50'>
            <TabNavigation />
         </div>
      </div>
   )
}

export default AppWrapper

