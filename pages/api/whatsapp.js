import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { phone_number_id, contact, limit = 20, before } = req.query;
      const params = {
        TableName: 'AgenticWhatsApp_Messages',
        IndexName: 'PhoneNumberIndex',
        KeyConditionExpression: 'phone_number_id = :pid',
        FilterExpression: 'contact = :contact',
        ExpressionAttributeValues: {
          ':pid': phone_number_id,
          ':contact': contact,
        },
        ScanIndexForward: false,
        Limit: parseInt(limit),
      };

      if (before) {
        params.KeyConditionExpression += ' AND #ts < :before';
        params.ExpressionAttributeNames = { '#ts': 'timestamp' };
        params.ExpressionAttributeValues[':before'] = before;
      }

      const response = await docClient.send(new QueryCommand(params));
      res.status(200).json(response.Items);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { phone_number_id, to, text } = req.body;
      const access_token = req.headers.authorization?.split(' ')[1];
      const { data: waba } = await supabase
        .from('waba_data')
        .select('user_id')
        .eq('phone_number_id', phone_number_id)
        .single();

      const response = await axios.post(
        `https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      const message_id = response.data.messages[0].id;

      await docClient.send(
        new PutCommand({
          TableName: 'AgenticWhatsApp_Messages',
          Item: {
            user_id: waba.user_id,
            message_id,
            phone_number_id,
            contact: to,
            message: text,
            direction: 'out',
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString(),
            ttl: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60,
          },
        })
      );
      res.status(200).json({ success: true, message_id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}