// API services for user management
import axios from 'axios';

/**
 * Create or fetch a user by their LINE user ID
 * @param u_id The LINE user ID
 * @param profileInfo Optional profile information (picture URL, display name)
 * @returns Promise resolving to the user data or null if error
 */
export const createOrFetchUser = async (u_id: string, profileInfo?: { pictureUrl?: string; displayName?: string }) => {
  try {
    console.log('Attempting to fetch user with ID:', u_id);
    
    try {
      // First try to fetch existing user
      const response = await axios.get(`/api/players/${u_id}`);
      console.log('Found existing user:', response.data);
      return response.data;
    } catch (error: any) {
      // If 404, create new user
      if (error?.response?.status === 404) {
        console.log('User not found, creating new user with ID:', u_id);
        // Include profile information if available
        const userData = { 
          userId: u_id,
          profile_picture: profileInfo?.pictureUrl || null,
          display_name: profileInfo?.displayName || null
        };
        console.log('Creating user with data:', userData);
        
        const createResponse = await axios.post('/api/players', userData);
        console.log('Created new user:', createResponse.data);
        return createResponse.data;
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('Error in createOrFetchUser:', error);
    return null;
  }
};

/**
 * Save user data to the database
 * @param u_id The LINE user ID
 * @param data The user data to save
 * @returns Promise resolving to the updated user data or null if error
 */
export const saveUserData = async (u_id: string, data: any) => {
  try {
    const response = await axios.put(`/api/players/${u_id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving user data:', error);
    return null;
  }
};
