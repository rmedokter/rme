import { fetchRagFromDynamoDB, saveRagToDynamoDB, deleteRagFromDynamoDB } from '../../lib/aws';

export default async function handler(req, res) {
  const { phone_number_id } = req.query;
  const { method, body } = req;

  if (!phone_number_id) {
    return res.status(400).json({ error: 'phone_number_id is required' });
  }

  try {
    switch (method) {
      case 'GET':
        const ragData = await fetchRagFromDynamoDB({ phoneNumberId: phone_number_id });
        if (!ragData) {
          return res.status(404).json({ error: 'Data not found' });
        }
        return res.status(200).json(ragData);

      case 'PUT':
        const { business_id, rag_data } = body;
        if (!business_id || !rag_data) {
          return res.status(400).json({ error: 'business_id and rag_data are required' });
        }
        const saveResult = await saveRagToDynamoDB({
          businessId: business_id,
          phoneNumberId: phone_number_id,
          ragData: rag_data
        });
        if (!saveResult.success) {
          return res.status(500).json({ error: saveResult.error });
        }
        return res.status(200).json({ message: 'Data saved' });

      case 'DELETE':
        const deleteResult = await deleteRagFromDynamoDB({ phoneNumberId: phone_number_id });
        if (!deleteResult.success) {
          return res.status(500).json({ error: deleteResult.error });
        }
        return res.status(200).json({ message: 'Data deleted' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(`Error handling ${method} request:`, error);
    return res.status(500).json({ error: error.message });
  }
}