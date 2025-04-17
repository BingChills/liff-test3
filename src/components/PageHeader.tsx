import React, { useState, useEffect } from 'react'
import { User, Coins, Timer, Gem, ChevronDown, X, MessageCircle, Calendar, Award } from 'lucide-react'
import { useLiff } from '../context/LiffContext'
import { StoreCurrency, useGameState } from '../state/gameState'
import { useUserSync } from '../hooks/useUserSync'

interface PageHeaderProps {
   title?: string
   subtitle?: string
   icon?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
   const { userProfile } = useLiff()
   const { stores, selectedStore, setSelectedStore, stamina, totalScore, pictureUrl, displayName, statusMessage } =
      useGameState()
   const [showStoreSelector, setShowStoreSelector] = useState(false)
   const [profilePicture, setProfilePicture] = useState<string | null>(null)
   const [showProfileModal, setShowProfileModal] = useState(false)

   // Use profile picture from user data or LINE
   useEffect(() => {
      if (userProfile?.pictureUrl) {
         // Priority 1: Use picture from LIFF context
         setProfilePicture(userProfile.pictureUrl)
      } else if (pictureUrl) {
         // Priority 2: Use picture from MongoDB user data
         setProfilePicture(pictureUrl)
      } else {
         setProfilePicture(null) // Will use default image in UI rendering
      }
   }, [pictureUrl, userProfile?.pictureUrl]) // Run when any of these dependencies change

   const getStoreColor = (color: string) => {
      switch (color) {
         case 'emerald':
            return 'bg-emerald-400'
         case 'red':
            return 'bg-red-500'
         case 'blue':
            return 'bg-blue-500'
         case 'orange':
            return 'bg-orange-500'
         default:
            return 'bg-blue-400'
      }
   }

   // Initialize selectedStore when user data is loaded
   useEffect(() => {
      if (stores.length > 0 && !selectedStore) {
         setSelectedStore(stores[0])
      }
   }, [stores, selectedStore, setSelectedStore])

   const handleStoreSelect = (store: StoreCurrency) => {
      setSelectedStore(store)
      setShowStoreSelector(false)
   }

   return (
      <>
         <div className='px-4 py-3'>
            {/* Resources bar - only the profile and resources */}
            <div className='flex items-center justify-between'>
               {/* User profile icon */}
               <button
                  onClick={() => setShowProfileModal(true)}
                  className='w-12 h-12 rounded-2xl shadow-md flex items-center justify-center overflow-hidden transition-transform active:scale-95'
               >
                  {profilePicture ? (
                     <img src={profilePicture} alt='Profile' className='w-full h-full object-cover rounded-2xl' />
                  ) : (
                     <div className='w-full h-full bg-blue-100 flex items-center justify-center'>
                        <User className='w-6 h-6 text-blue-600' />
                     </div>
                  )}
               </button>

               {/* Right side: Resources */}
               <div className='flex items-center gap-2'>
                  {/* point/Points */}
                  <div className='relative'>
                     <button
                        onClick={() => setShowStoreSelector(!showStoreSelector)}
                        className='flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full'
                     >
                        <div
                           className={`w-4 h-4 rounded-full ${getStoreColor(
                              selectedStore?.color || 'blue'
                           )} flex items-center justify-center`}
                        >
                           <Gem className='w-2.5 h-2.5 text-white' />
                        </div>
                        <span className='text-sm font-bold text-white'>{selectedStore?.point || 0}</span>
                        <ChevronDown className='w-3 h-3 text-white/80' />
                     </button>

                     {showStoreSelector && (
                        <div className='absolute top-12 right-0 bg-white rounded-2xl shadow-lg p-2 w-48 z-50'>
                           <div className='text-center font-semibold text-sm text-gray-700 mb-2 py-1 border-b border-gray-100'>
                              Points
                           </div>
                           {stores.map((store) => (
                              <button
                                 key={store.name}
                                 onClick={() => handleStoreSelect(store)}
                                 className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors ${
                                    selectedStore?.name === store.name ? 'bg-gray-100' : 'hover:bg-gray-50'
                                 }`}
                              >
                                 <div className='flex items-center gap-2'>
                                    <div
                                       className={`w-6 h-6 rounded-full ${getStoreColor(
                                          store.color
                                       )} flex items-center justify-center`}
                                    >
                                       <Gem className='w-2.5 h-2.5 text-white' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700'>{store.name}</span>
                                 </div>
                                 <span className='text-sm font-bold text-gray-900'>{store.point}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Score */}
                  <div className='flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full'>
                     <div className='w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center'>
                        <Coins className='w-2.5 h-2.5 text-white' />
                     </div>
                     <span className='text-sm font-bold text-white'>{totalScore || 0}</span>
                  </div>

                  {/* Energy/Stamina */}
                  <div className='flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full'>
                     <div className='w-4 h-4 rounded-full bg-red-400 flex items-center justify-center'>
                        <Timer className='w-2.5 h-2.5 text-white' />
                     </div>
                     <span className='text-sm font-bold text-white'>
                        {stamina.current || 0}/{stamina.max || 0}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Player Information Modal */}
         {showProfileModal && (
            <div
               className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50'
               onClick={() => setShowProfileModal(false)}
            >
               <div
                  className='bg-white w-[85%] max-w-sm rounded-3xl p-6 transform transition-all'
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Close button */}
                  <button
                     className='absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors'
                     onClick={() => setShowProfileModal(false)}
                  >
                     <X size={20} className='text-gray-500' />
                  </button>

                  {/* Profile header */}
                  <div className='text-center mb-6'>
                     <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-100'>
                        {profilePicture ? (
                           <img
                              src={profilePicture}
                              alt={userProfile?.displayName || 'Profile'}
                              className='w-full h-full object-cover'
                           />
                        ) : (
                           <div className='w-full h-full bg-blue-100 flex items-center justify-center'>
                              <User className='w-10 h-10 text-blue-600' />
                           </div>
                        )}
                     </div>
                     <h2 className='text-xl font-bold text-gray-800'>{displayName}</h2>
                     {statusMessage && (
                        <div className='flex items-center justify-center mt-1 text-gray-500'>
                           <MessageCircle size={14} className='mr-1' />
                           <p className='text-sm italic'>{statusMessage}</p>
                        </div>
                     )}
                  </div>

                  {/* Stats section */}
                  <div className='bg-gray-50 rounded-2xl p-4 mb-4'>
                     <h3 className='text-sm font-semibold text-gray-500 mb-3'>PLAYER STATS</h3>

                     <div className='space-y-3'>
                        {/* Score */}
                        <div className='flex items-center justify-between'>
                           <div className='flex items-center'>
                              <div className='w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3'>
                                 <Award className='w-4 h-4 text-yellow-600' />
                              </div>
                              <span className='text-gray-700'>Total Score</span>
                           </div>
                           <span className='font-bold text-gray-900'>{totalScore || 0}</span>
                        </div>

                        {/* Stamina */}
                        <div className='flex items-center justify-between'>
                           <div className='flex items-center'>
                              <div className='w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                                 <Timer className='w-4 h-4 text-red-600' />
                              </div>
                              <span className='text-gray-700'>Energy</span>
                           </div>
                           <span className='font-bold text-gray-900'>
                              {stamina.current || 0}/{stamina.max || 0}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Currencies section */}
                  <div className='bg-gray-50 rounded-2xl p-4'>
                     <h3 className='text-sm font-semibold text-gray-500 mb-3'>STORE POINTS</h3>

                     <div className='space-y-3'>
                        {stores?.map((store) => (
                           <div key={store.name} className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                 <div
                                    className={`w-8 h-8 rounded-full ${getStoreColor(store.color)} flex items-center justify-center mr-3`}
                                 >
                                    <Gem className='w-4 h-4 text-white' />
                                 </div>
                                 <span className='text-gray-700'>{store.name}</span>
                              </div>
                              <span className='font-bold text-gray-900'>{store.point}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   )
}

export default PageHeader
