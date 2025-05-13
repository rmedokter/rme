import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { waba_id, access_token } = req.body;

  if (!waba_id || !access_token) {
    return res.status(400).json({ error: 'WABA ID and access token are required' });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${waba_id}/subscribed_apps`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.data.success) {
      res.status(200).json({ success: true });
    } else {
      console.error('Webhook subscription failed:', response.data);
      res.status(500).json({ error: 'Failed to subscribe to webhooks', details: response.data });
    }
  } catch (error) {
    const errorDetails = error.response?.data?.error || { message: error.message };
    console.error('Webhook subscription error:', JSON.stringify(errorDetails, null, 2));
    res.status(500).json({ error: 'Failed to subscribe to webhooks', details: errorDetails });
  }
}