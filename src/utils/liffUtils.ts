// Utilities for interacting with LINE LIFF
import axios from 'axios';

/**
 * Revoke the LINE access token
 * @param accessToken The LINE access token to revoke
 * @returns Promise resolving to true if successful, false otherwise
 */
export const revokeLineToken = async (accessToken: string): Promise<boolean> => {
  try {
    console.log('Attempting to revoke LINE token');
    const response = await axios.post('/api/auth/revoke', { accessToken });
    console.log('Token revocation response:', response.data);
    return true;
  } catch (error) {
    console.error('Error revoking LINE token:', error);
    return false;
  }
};
