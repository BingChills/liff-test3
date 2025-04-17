import React, { useState } from 'react'
import { Cat, Gem, X, Info, ThumbsUp } from 'lucide-react'
import styles from '../styles/modules/cardflip.module.css'
import { useGameState, Character } from '../state/gameState'
import PageHeader from './PageHeader'

// Extended Character type with count property
type CharacterWithCount = Character & { count: number; description?: string }

const CharactersPage = () => {
   const { characters, stores, selectedStore, setSelectedStore, setCharacters } = useGameState()
   const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
   const [searchQuery, setSearchQuery] = useState('')
   const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
   const [detailCharacter, setDetailCharacter] = useState<CharacterWithCount | null>(null)

   // Empty initial state - characters will be obtained through summons

   // Handle card flip - Use both ID and store name to ensure unique flipping
   const toggleCardFlip = (id: string, storeName: string) => {
      // Create a composite key using both the ID and store name
      const cardKey = `${id}-${storeName}`
      setFlippedCards((prev) => {
         const newSet = new Set(prev)
         if (newSet.has(cardKey)) {
            newSet.delete(cardKey)
         } else {
            newSet.add(cardKey)
         }
         return newSet
      })
   }

   // Handle showing character details
   const showCharacterDetails = (character: CharacterWithCount) => {
      setDetailCharacter(character)
   }

   // Close character detail modal
   const closeCharacterDetails = () => {
      setDetailCharacter(null)
   }

   // Filter characters based on the local filter tabs, not the global selectedStore
   const filteredCharacters = selectedCompany
      ? characters.filter((char) => char.storeName === selectedCompany)
      : characters

   // Group characters by ID and store name to handle duplicates correctly
   const groupCharacters = (chars: Character[]): CharacterWithCount[] => {
      const grouped = chars.reduce(
         (acc, char) => {
            // Include the store name in the key to ensure characters from different stores are treated separately
            const key = `${char.id}-${char.storeName}-${char.isUsing ? 'using' : 'inventory'}`
            if (!acc[key]) {
               acc[key] = { ...char, count: 1 }
            } else {
               acc[key].count = (acc[key].count || 1) + 1
            }
            return acc
         },
         {} as Record<string, CharacterWithCount>
      )

      return Object.values(grouped)
   }

   // Split characters into using and inventory
   const usingCharacters = groupCharacters(filteredCharacters.filter((char) => char.isUsing))
   const inventoryCharacters = groupCharacters(filteredCharacters.filter((char) => !char.isUsing))

   const toggleCharacterUse = (id: string, storeName: string) => {
      const usingCount = characters.filter((char) => char.isUsing).length

      const newCharacters = characters.map((char) => {
         // Only toggle the character with the matching ID AND store name
         if (char.id === id && char.storeName === storeName) {
            if (!char.isUsing && usingCount >= 3) {
               return char
            }
            return { ...char, isUsing: !char.isUsing }
         }
         return char
      })

      // Update the game state
      setCharacters(newCharacters)
   }

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

   const getRarityColor = (rarity: string) => {
      switch (rarity) {
         case 'common':
            return 'bg-gray-100'
         case 'rare':
            return 'bg-blue-100'
         case 'epic':
            return 'bg-purple-100'
         case 'legendary':
            return 'bg-yellow-100'
         default:
            return 'bg-gray-100'
      }
   }

   return (
      <div className='min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24'>
         {/* Header with user profile and resources */}
         <PageHeader />

         {/* Page Title with Icon */}
         <div className='mt-2 px-4 flex items-center gap-3'>
            <div className='w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center'>
               <Cat className='w-8 h-8 text-blue-600' />
            </div>
            <div>
               <h1 className='text-3xl font-black text-gray-800 drop-shadow-sm'>Characters</h1>
               <p className='text-gray-700 text-sm mt-1'>
                  {selectedCompany ? `${selectedCompany} Collection` : 'All Characters'}
               </p>
            </div>
         </div>

         {/* Company Filter Tabs */}
         <div className='mt-4 px-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2'>
            <button
               onClick={() => setSelectedCompany(null)}
               className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCompany === null ? 'bg-white text-gray-800' : 'bg-white/40 text-gray-400'
               }`}
            >
               All Characters
            </button>
            {stores.map((store) => (
               <button
                  key={store.name}
                  onClick={() => setSelectedCompany(store.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                     selectedCompany === store.name ? 'bg-white text-gray-800' : 'bg-white/40 text-gray-400'
                  }`}
               >
                  {store.name}
               </button>
            ))}
         </div>

         {/* Using Section */}
         <div className='px-3 mt-4 mb-4'>
            <div className='w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg'>
               <span className='text-lg font-bold'>Using ({usingCharacters.length}/3)</span>
            </div>

            <div className='grid grid-cols-3 gap-3'>
               {usingCharacters.map((char) => (
                  <div
                     key={char.id}
                     className={`relative h-[160px] w-full ${styles.perspective500}`}
                     onClick={() => toggleCardFlip(char.id, char.storeName)}
                  >
                     {/* Card front */}
                     <div
                        className={`absolute inset-0 w-full h-full ${getRarityColor(char.rarity)} rounded-xl p-2 shadow-lg cartoon-border 
                        transform transition-transform duration-300 ${styles.backfaceHidden} 
                        ${flippedCards.has(`${char.id}-${char.storeName}`) ? styles.rotateY180 : styles.rotateY0}`}
                     >
                        {/* Character count badge (if more than 1) */}
                        {char.count > 1 && (
                           <div className='absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 flex items-center justify-center text-white text-xs font-medium'>
                              x{char.count}
                           </div>
                        )}
                        <div
                           className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStoreColor(
                              stores.find((s) => s.name === char.storeName)?.color || 'emerald'
                           )} flex items-center justify-center`}
                        >
                           <Gem className='w-3.5 h-3.5 text-white' />
                        </div>
                        <img
                           src={char.image}
                           alt={char.name}
                           width={100}
                           height={100}
                           className='w-full aspect-square object-cover rounded-lg'
                        />
                        <div className='text-center mt-1'>
                           <h3 className='font-bold text-xs mb-0.5'>{char.name}</h3>
                           <p className='text-[11px] font-medium'>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>[</span>
                              <span className='text-purple-600 font-semibold'>{char.couponDropRate}%</span>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>]</span>
                              <span> {char.couponType} 🏷️</span>
                           </p>
                        </div>
                     </div>

                     {/* Card back */}
                     <div
                        className={`absolute inset-0 w-full h-full ${getRarityColor(char.rarity)} rounded-xl p-3 shadow-lg cartoon-border 
                        transform transition-transform duration-300 ${styles.backfaceHidden} ${styles.rotateY180} 
                        ${flippedCards.has(`${char.id}-${char.storeName}`) ? styles.rotateY0 : styles.rotateY180} 
                        flex flex-col justify-center items-center gap-2`}
                     >
                        <h3 className='font-bold text-sm text-center mb-2'>{char.name}</h3>
                        <button
                           onClick={(e) => {
                              e.stopPropagation()
                              toggleCharacterUse(char.id, char.storeName)
                              toggleCardFlip(char.id, char.storeName)
                           }}
                           className='w-full py-2 rounded-lg bg-red-500 text-white text-xs font-medium flex items-center justify-center gap-1'
                        >
                           <ThumbsUp className='w-3.5 h-3.5' />
                           Remove
                        </button>
                        <button
                           onClick={(e) => {
                              e.stopPropagation()
                              showCharacterDetails(char)
                           }}
                           className='w-full py-2 rounded-lg bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1'
                        >
                           <Info className='w-3.5 h-3.5' />
                           Details
                        </button>
                     </div>
                  </div>
               ))}
               {usingCharacters.length === 0 && (
                  <div className='col-span-3 bg-white/50 rounded-xl p-4 text-center'>
                     <p className='text-gray-500 text-sm'>No characters selected</p>
                  </div>
               )}
            </div>
         </div>

         {/* Inventory Section */}
         <div className='px-3'>
            <div className='w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg'>
               <span className='text-lg font-bold'>
                  Backpack ({filteredCharacters.filter(char => !char.isUsing).length})
               </span>
            </div>

            <div className='grid grid-cols-3 gap-3'>
               {inventoryCharacters.map((char) => (
                  <div
                     key={char.id}
                     className={`relative h-[160px] w-full ${styles.perspective500}`}
                     onClick={() => toggleCardFlip(char.id, char.storeName)}
                  >
                     {/* Card front */}
                     <div
                        className={`absolute inset-0 w-full h-full ${getRarityColor(char.rarity)} rounded-xl p-2 shadow-lg cartoon-border 
                        transform transition-transform duration-300 ${styles.backfaceHidden} 
                        ${flippedCards.has(`${char.id}-${char.storeName}`) ? styles.rotateY180 : styles.rotateY0}`}
                     >
                        {/* Character count badge (if more than 1) */}
                        {char.count > 1 && (
                           <div className='absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 flex items-center justify-center text-white text-xs font-medium'>
                              x{char.count}
                           </div>
                        )}
                        <div
                           className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStoreColor(
                              stores.find((s) => s.name === char.storeName)?.color || 'emerald'
                           )} flex items-center justify-center`}
                        >
                           <Gem className='w-3.5 h-3.5 text-white' />
                        </div>
                        <img
                           src={char.image}
                           alt={char.name}
                           width={100}
                           height={100}
                           className='w-full aspect-square object-cover rounded-lg'
                        />
                        <div className='text-center mt-1'>
                           <h3 className='font-bold text-xs mb-0.5'>{char.name}</h3>
                           <p className='text-[11px] font-medium'>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>[</span>
                              <span className='text-purple-600 font-semibold'>{char.couponDropRate}%</span>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>]</span>
                              <span> {char.couponType} 🏷️</span>
                           </p>
                        </div>
                     </div>

                     {/* Card back */}
                     <div
                        className={`absolute inset-0 w-full h-full ${getRarityColor(char.rarity)} rounded-xl p-3 shadow-lg cartoon-border 
                        transform transition-transform duration-300 ${styles.backfaceHidden} ${styles.rotateY180} 
                        ${flippedCards.has(`${char.id}-${char.storeName}`) ? styles.rotateY0 : styles.rotateY180} 
                        flex flex-col justify-center items-center gap-2`}
                     >
                        <h3 className='font-bold text-sm text-center mb-2'>{char.name}</h3>
                        <button
                           onClick={(e) => {
                              e.stopPropagation()
                              if (usingCharacters.length < 3) {
                                 toggleCharacterUse(char.id, char.storeName)
                                 toggleCardFlip(char.id, char.storeName)
                              }
                           }}
                           disabled={usingCharacters.length >= 3}
                           className={`w-full py-2 rounded-lg ${usingCharacters.length >= 3 ? 'bg-gray-400' : 'bg-green-500'} text-white text-xs font-medium flex items-center justify-center gap-1`}
                        >
                           <ThumbsUp className='w-3.5 h-3.5' />
                           {usingCharacters.length >= 3 ? 'Full' : 'Use'}
                        </button>
                        <button
                           onClick={(e) => {
                              e.stopPropagation()
                              showCharacterDetails(char)
                           }}
                           className='w-full py-2 rounded-lg bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1'
                        >
                           <Info className='w-3.5 h-3.5' />
                           Details
                        </button>
                     </div>
                  </div>
               ))}
               {inventoryCharacters.length === 0 && (
                  <div className='col-span-3 bg-white/50 rounded-xl p-4 text-center'>
                     <p className='text-gray-500 text-sm'>No characters in backpack</p>
                  </div>
               )}
            </div>
         </div>

         {/* Character Detail Modal */}
         {detailCharacter && (
            <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
               <div
                  className={`w-full max-w-sm rounded-2xl ${getRarityColor(detailCharacter?.rarity || 'common')} p-3 shadow-xl cartoon-border transform ${styles.animateScaleUp}`}
               >
                  <div className='bg-white/90 rounded-xl p-4'>
                     {/* Header with close button */}
                     <div className='flex justify-between items-center mb-3'>
                        <h2 className='text-xl font-bold'>{detailCharacter?.name}</h2>
                        <button
                           onClick={closeCharacterDetails}
                           className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center'
                        >
                           <X className='w-4 h-4 text-gray-600' />
                        </button>
                     </div>

                     {/* Character image */}
                     <div className='mb-4'>
                        <div
                           className={`rounded-lg overflow-hidden border-4 ${detailCharacter?.rarity === 'legendary' ? 'border-yellow-300' : detailCharacter?.rarity === 'epic' ? 'border-purple-300' : detailCharacter?.rarity === 'rare' ? 'border-blue-300' : 'border-gray-300'}`}
                        >
                           <img
                              src={detailCharacter?.image || ''}
                              alt={detailCharacter?.name || 'Character'}
                              className='w-full aspect-square object-cover'
                           />
                        </div>
                     </div>

                     {/* Character details */}
                     <div className='space-y-2'>
                        <div className='flex justify-between'>
                           <span className='font-semibold'>Store:</span>
                           <span>{detailCharacter?.storeName || 'Unknown'}</span>
                        </div>
                        <div className='flex justify-between'>
                           <span className='font-semibold'>Rarity:</span>
                           <span
                              className={
                                 detailCharacter?.rarity === 'legendary'
                                    ? 'text-yellow-600'
                                    : detailCharacter?.rarity === 'epic'
                                      ? 'text-purple-600'
                                      : detailCharacter?.rarity === 'rare'
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                              }
                           >
                              {(detailCharacter?.rarity || 'common').charAt(0).toUpperCase() +
                                 (detailCharacter?.rarity || 'common').slice(1)}
                           </span>
                        </div>
                        <div className='flex justify-between'>
                           <span className='font-semibold'>Effect:</span>
                           <span>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>[</span>
                              <span className='text-purple-600 font-semibold'>
                                 {detailCharacter?.couponDropRate || 0}%
                              </span>
                              <span className='text-blue-600 font-bold bg-blue-100 px-1 rounded'>]</span>
                              <span> {detailCharacter?.couponType || '0%'} 🏷️</span>
                           </span>
                        </div>
                        {detailCharacter?.count && detailCharacter.count > 1 && (
                           <div className='flex justify-between'>
                              <span className='font-semibold'>Owned:</span>
                              <span>x{detailCharacter.count}</span>
                           </div>
                        )}
                     </div>

                     {/* Character description */}
                     <div className='mt-4 p-3 bg-gray-100 rounded-lg'>
                        <p className='text-sm text-gray-700'>
                           {/* Provided description or a placeholder */}
                           {`A ${detailCharacter?.rarity || 'common'} character from ${detailCharacter?.storeName || 'unknown store'} that provides [${detailCharacter?.couponDropRate || 0}%] ${detailCharacter?.couponType || '0%'} discount. This means it has a ${detailCharacter?.couponDropRate || 0}% chance to drop a ${detailCharacter?.couponType || '0%'} discount coupon when breaking chests.`}
                        </p>
                     </div>

                     {/* Action buttons */}
                     <div className='mt-4 flex justify-end'>
                        <button
                           onClick={closeCharacterDetails}
                           className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium'
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

export default CharactersPage

