// src/hooks/useUserSync.ts
import { useEffect, useState, useRef, useCallback } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'
import { EventBus } from '../game/EventBus'

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   const syncedRef = useRef(false) // Track if we've already synced
   const unsavedChangesRef = useRef(false) // Track if there are unsaved changes
   const userDataRef = useRef<PlayerType | null>(null) // Keep a ref to latest user data
   const debugMode = false // Set to true only when debugging is needed

   // Function to save user data to database
   const saveUserData = useCallback(async () => {
      // Only save if we have unsaved changes and user data
      if (!unsavedChangesRef.current || !userDataRef.current) {
         return;
      }
      
      try {
         if (debugMode) console.log('💾 Saving user data before unload...', userDataRef.current.userId);
         await apiClient.put(`/api/players/${userDataRef.current.userId}`, userDataRef.current);
         unsavedChangesRef.current = false;
         if (debugMode) console.log('✅ User data saved successfully');
      } catch (error) {
         console.error('❌ Error saving user data:', error);
      }
   }, [debugMode]);

   // Main synchronization effect - MongoDB - Only runs ONCE when app loads
   useEffect(() => {
      const syncUserData = async () => {
         // Skip if we've already synced or have user data
         if (syncedRef.current || user) {
            return;
         }

         if (debugMode) console.log('🔄 syncUserData called - Checking conditions')

         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            if (debugMode)
               console.log('❌ Cannot sync - userProfile or LIFF not available', {
                  hasUserProfile: !!userProfile,
                  hasLiff: !!liff
               })
            return
         }

         try {
            // Try to get user data from MongoDB
            if (debugMode) console.log('🌐 Attempting API call to fetch user:', userProfile.userId)
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               if (debugMode) console.log('🌐 API Response:', response.status)
               if (response.data) {
                  if (debugMode) console.log('✅ Found existing user data in database')
                  setUser(response.data as PlayerType)
                  syncedRef.current = true // Mark as synced
                  return
               } else {
                  if (debugMode) console.log('⚠️ API returned success but no data')
               }
            } catch (error) {
               // Player not found in database, will create a new one
               if (debugMode) console.log('⚠️ API Error:', error)
               if (debugMode) console.log('🔄 Player not found in database, creating new profile')
            }

            // Create new profile if we don't have one
            const newProfile = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || '',
               score: 0,
               stores: [],
               stamina: { current: 20, max: 20 },
               characters: [],
               coupons: []
            }

            // Save to database
            const createResponse = await apiClient.post('/api/players', newProfile)
            setUser(createResponse.data as PlayerType)
            syncedRef.current = true // Mark as synced
            if (debugMode) console.log('New user profile saved to database')
         } catch (error) {
            if (debugMode) console.error('Database sync error:', error)
         }
      }

      if (debugMode) console.log('🔄 Checking if sync is needed...')
      syncUserData()
   }, [userProfile, liff, user, debugMode])

   // Update user method - marks changes as unsaved but doesn't save to database immediately
   const updateUser = useCallback((updatedUser: PlayerType) => {
      // Update state
      setUser(updatedUser);
      
      // Keep reference to latest user data
      userDataRef.current = updatedUser;
      
      // Mark that we have unsaved changes
      unsavedChangesRef.current = true;
      
      if (debugMode) console.log('🔄 User data updated locally, will be saved on page close');
      
      // Emit event so game can react to user changes if needed
      EventBus.emit('userUpdated', updatedUser);
   }, [debugMode, setUser])

   // Effect to listen for page unload and save data
   useEffect(() => {
      // Save user data when user leaves the app
      const handleBeforeUnload = () => {
         saveUserData();
         // We don't return anything so browser doesn't show a confirmation dialog
      };
      
      // Set up event listener for page close
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Also listen for score updates from the game
      const handleScoreUpdate = (score: number) => {
         if (!userDataRef.current) return;
         
         // Only update if score has changed
         if (userDataRef.current.score !== score) {
            const updatedUser = { ...userDataRef.current, score };
            updateUser(updatedUser);
         }
      };
      
      // Subscribe to score updates
      EventBus.on('scoreUpdated', handleScoreUpdate);
      
      // Clean up
      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
         EventBus.off('scoreUpdated', handleScoreUpdate);
         
         // Final attempt to save data when component unmounts
         saveUserData();
      };
   }, [saveUserData, updateUser]);
   
   return { user, setUser: updateUser }
}

