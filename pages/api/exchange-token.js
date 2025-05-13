import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, user_id } = req.body;

  if (!code || !user_id) {
    return res.status(400).json({ error: 'Authorization code and user_id are required' });
  }

  if (!process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
    console.error('Missing Facebook client ID or secret');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const url = `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;
    const response = await axios.get(url);

    const { access_token } = response.data;

    res.status(200).json({ access_token });
  } catch (error) {
    const errorDetails = error.response?.data?.error || { message: error.message };
    console.error('Token exchange error:', JSON.stringify(errorDetails, null, 2));
    res.status(500).json({ error: 'Failed to exchange token', details: errorDetails });
  }
}