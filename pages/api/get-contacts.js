import { fetchUniqueContactsFromDynamoDB, fetchMessagesFromDynamoDB } from '../../lib/aws';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { phoneNumberId } = req.body;

  if (!phoneNumberId) {
    return res.status(400).json({ success: false, error: 'phoneNumberId is required' });
  }

  try {
    const contacts = await fetchUniqueContactsFromDynamoDB({ phoneNumberId });
    const lastMessages = {};

    // Fetch pesan terakhir untuk setiap kontak
    for (const contact of contacts) {
      const { messages } = await fetchMessagesFromDynamoDB({
        userId: contact,
        phoneNumberId,
        limit: 1,
      });
      if (messages.length > 0) {
        const lastMsg = messages[0];
        lastMessages[contact] = {
          text: lastMsg.message.slice(0, 30) + (lastMsg.message.length > 30 ? '...' : ''),
          time: lastMsg.timestamp,
        };
      }
    }

    return res.status(200).json({ success: true, contacts, lastMessages });
  } catch (error) {
    console.error('Error in get-contacts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}