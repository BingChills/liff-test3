// Database synchronization utilities
import apiClient from '../config/api';
import { PlayerType } from '../context/LiffContext';

/**
 * Save user data to MongoDB
 * @param userData The user data to save
 * @returns Promise that resolves when the save is complete
 */
export const saveUserToDatabase = async (userData: PlayerType): Promise<void> => {
  if (!userData || !userData.userId) {
    console.error('Cannot save user data: Invalid user data or missing userId');
    return;
  }
  
  try {
    // Save to MongoDB database
    await apiClient.put(`/api/players/${userData.userId}`, userData);
    console.log('✅ User data saved to database');
  } catch (error) {
    console.error('❌ Error saving user data to database:', error);
  }
};

/**
 * Update a specific field in user data
 * @param userId The user ID
 * @param field The field to update
 * @param value The new value
 * @returns Promise that resolves when the update is complete
 */
export const updateUserField = async (userId: string, field: string, value: any): Promise<void> => {
  if (!userId || !field) {
    console.error('Cannot update user field: Missing userId or field');
    return;
  }
  
  try {
    // Update specific field in MongoDB database
    await apiClient.patch(`/api/players/${userId}/${field}`, { value });
    console.log(`✅ User field ${field} updated in database`);
  } catch (error) {
    console.error(`❌ Error updating user field ${field} in database:`, error);
  }
};
