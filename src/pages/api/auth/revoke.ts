// API route for revoking LINE access tokens
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    const channelId = process.env.NEXT_PUBLIC_LIFF_ID || '2006705425-2we7d4d6';

    // Call LINE's token revocation endpoint
    const response = await axios.post(
      'https://api.line.me/oauth2/v2.1/revoke',
      new URLSearchParams({
        access_token: accessToken,
        client_id: channelId
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Token revocation successful');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error revoking token:', error);
    return res.status(500).json({ 
      message: 'Failed to revoke token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
