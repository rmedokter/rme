import { fetchMessagesFromDynamoDB } from '../../lib/aws';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, phoneNumberId, limit = 20, beforeTimestamp = null, lastEvaluatedKey = null } = req.body;

  // Validasi input
  if (!userId || !phoneNumberId) {
    return res.status(400).json({ error: 'Missing required fields: userId and phoneNumberId' });
  }

  try {
    const result = await fetchMessagesFromDynamoDB({
      userId,
      phoneNumberId,
      limit,
      beforeTimestamp,
      lastEvaluatedKey,
    });
    return res.status(200).json({
      success: true,
      messages: result.messages,
      lastEvaluatedKey: result.lastEvaluatedKey,
    });
  } catch (error) {
    console.error('Error fetching messages from DynamoDB:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}