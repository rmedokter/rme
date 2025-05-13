import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

// Log credentials for debugging
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
console.log('AWS_REGION:', process.env.AWS_REGION);

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names
const MESSAGES_TABLE = 'AgenticWhatsApp_Messages';
const RAG_TABLE = 'BusinessRAG';

// Save a message to DynamoDB
export async function saveMessageToDynamoDB({
  userId,
  phoneNumberId,
  message,
  messageType,
  timestamp = new Date().toISOString(),
}) {
  try {
    const messageId = require('crypto').randomUUID();
    const params = {
      TableName: MESSAGES_TABLE,
      Item: {
        user_id: userId,
        message_id: messageId,
        phone_number_id: phoneNumberId,
        timestamp,
        message,
        message_type: messageType, // 'INCOMING' or 'OUTGOING'
      },
    };

    await docClient.send(new PutCommand(params));
    console.log(`Message saved: user_id=${userId}, message_id=${messageId}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('Error saving message to DynamoDB:', error);
    return { success: false, error: error.message };
  }
}

// Fetch messages from DynamoDB for a specific contact
export async function fetchMessagesFromDynamoDB({
  userId,
  phoneNumberId,
  limit = 20,
  lastEvaluatedKey = null,
}) {
  try {
    const params = {
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: 'user_id = :userId',
      FilterExpression: 'phone_number_id = :phoneNumberId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':phoneNumberId': phoneNumberId,
      },
      ScanIndexForward: false, // Sort descending by message_id
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const { Items, LastEvaluatedKey } = await docClient.send(new QueryCommand(params));
    const messages = Items.map((item) => ({
      message_id: item.message_id,
      contact: item.user_id,
      message: item.message,
      direction: item.message_type === 'OUTGOING' ? 'out' : 'in',
      timestamp: item.timestamp,
    }));

    console.log(`Fetched ${messages.length} messages for user_id=${userId}, phone_number_id=${phoneNumberId}`);
    return { messages, lastEvaluatedKey: LastEvaluatedKey };
  } catch (error) {
    console.error('Error fetching messages from DynamoDB:', error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
}

// Fetch unique contacts for a phoneNumberId using GSI
export async function fetchUniqueContactsFromDynamoDB({ phoneNumberId }) {
  try {
    console.log('Fetching contacts for phoneNumberId:', phoneNumberId);
    const params = {
      TableName: MESSAGES_TABLE,
      IndexName: 'PhoneNumberIndex',
      KeyConditionExpression: 'phone_number_id = :phoneNumberId',
      ExpressionAttributeValues: {
        ':phoneNumberId': phoneNumberId,
      },
      ProjectionExpression: 'user_id',
    };

    console.log('Query params:', params);
    const { Items } = await docClient.send(new QueryCommand(params));
    const uniqueContacts = [...new Set(Items.map((item) => item.user_id))];
    console.log(`Fetched ${uniqueContacts.length} unique contacts:`, uniqueContacts);
    return uniqueContacts;
  } catch (error) {
    console.error('Error fetching unique contacts from DynamoDB:', error);
    throw new Error(`Failed to fetch unique contacts: ${error.message}`);
  }
}

// Fetch RAG data from DynamoDB
export async function fetchRagFromDynamoDB({ phoneNumberId }) {
  try {
    const params = {
      TableName: RAG_TABLE,
      IndexName: 'phone_number_id-index',
      KeyConditionExpression: 'phone_number_id = :phoneNumberId',
      ExpressionAttributeValues: {
        ':phoneNumberId': phoneNumberId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(params));
    if (!Items || Items.length === 0) {
      console.log(`No RAG data found for phone_number_id=${phoneNumberId}`);
      return null;
    }

    console.log(`Fetched RAG data for phone_number_id=${phoneNumberId}`);
    return Items[0];
  } catch (error) {
    console.error('Error fetching RAG from DynamoDB:', error);
    throw new Error(`Failed to fetch RAG data: ${error.message}`);
  }
}

// Save or update RAG data to DynamoDB
export async function saveRagToDynamoDB({ businessId, phoneNumberId, ragData }) {
  try {
    const params = {
      TableName: RAG_TABLE,
      Item: {
        business_id: businessId,
        phone_number_id: phoneNumberId,
        rag_data: ragData,
      },
    };

    await docClient.send(new PutCommand(params));
    console.log(`RAG data saved: business_id=${businessId}, phone_number_id=${phoneNumberId}`);
    return { success: true };
  } catch (error) {
    console.error('Error saving RAG to DynamoDB:', error);
    return { success: false, error: error.message };
  }
}

// Delete RAG data from DynamoDB
export async function deleteRagFromDynamoDB({ phoneNumberId }) {
  try {
    // Pertama, cari business_id berdasarkan phone_number_id
    const fetchParams = {
      TableName: RAG_TABLE,
      IndexName: 'phone_number_id-index',
      KeyConditionExpression: 'phone_number_id = :phoneNumberId',
      ExpressionAttributeValues: {
        ':phoneNumberId': phoneNumberId,
      },
    };

    const { Items } = await docClient.send(new QueryCommand(fetchParams));
    if (!Items || Items.length === 0) {
      console.log(`No RAG data found for phone_number_id=${phoneNumberId}`);
      return { success: false, error: 'Data not found' };
    }

    const businessId = Items[0].business_id;
    const deleteParams = {
      TableName: RAG_TABLE,
      Key: {
        business_id: businessId,
      },
    };

    await docClient.send(new DeleteCommand(deleteParams));
    console.log(`RAG data deleted: business_id=${businessId}, phone_number_id=${phoneNumberId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting RAG from DynamoDB:', error);
    return { success: false, error: error.message };
  }
}