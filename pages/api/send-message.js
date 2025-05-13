export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number_id, to, text, access_token } = req.body;

  if (!phone_number_id || !to || !text || !access_token) {
    return res.status(400).json({ error: 'Missing required fields: phone_number_id, to, text, or access_token' });
  }

  try {
    const AWS_API_ENDPOINT = process.env.AWS_API_ENDPOINT;
    const AWS_API_KEY = process.env.AWS_API_KEY;

    if (!AWS_API_ENDPOINT) {
      console.error('AWS_API_ENDPOINT is not configured');
      return res.status(500).json({ error: 'Server configuration error: AWS_API_ENDPOINT is missing' });
    }

    if (!AWS_API_KEY) {
      console.error('AWS_API_KEY is not configured');
      return res.status(500).json({ error: 'Server configuration error: AWS_API_KEY is missing' });
    }

    console.log('Sending message to AWS Lambda:', { phone_number_id, to, text });

    const response = await fetch(`${AWS_API_ENDPOINT}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AWS_API_KEY,
      },
      body: JSON.stringify({
        phone_number_id,
        to,
        text,
        access_token,
      }),
    });

    const result = await response.json();
    console.log('AWS Lambda response:', result);

    if (!response.ok || !result.success) {
      const errorMsg = result.error || 'Failed to send message to AWS Lambda';
      console.error('AWS Lambda error:', errorMsg);
      return res.status(response.status || 500).json({ error: errorMsg });
    }

    return res.status(200).json({
      success: true,
      message_id: result.message_id,
    });
  } catch (error) {
    console.error('Error in send-message API:', error.message);
    return res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
}