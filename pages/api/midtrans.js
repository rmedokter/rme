import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `SUB-${user_id}-${Date.now()}`,
        gross_amount: amount,
      },
      customer_details: {
        email: req.body.email || 'user@example.com',
      },
    });

    return res.status(200).json({ token: transaction.token });
  } catch (err) {
    return res.status(500).json({ error: `Failed to initiate payment: ${err.message}` });
  }
}