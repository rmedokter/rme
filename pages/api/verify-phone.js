import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number } = req.body;

  try {
    const systemToken = process.env.WHATSAPP_SYSTEM_TOKEN;
    if (!systemToken) {
      return res.status(500).json({ error: 'System token not configured' });
    }

    // Kirim permintaan untuk memulai verifikasi nomor
    const response = await axios.post(
      'https://graph.facebook.com/v22.0/phone_numbers/verifications',
      {
        phone_number,
        verification_method: 'SMS',
      },
      {
        headers: {
          Authorization: `Bearer ${systemToken}`,
        },
      }
    );

    res.status(200).json({ message: 'Verifikasi dimulai', verification_id: response.data.id });
  } catch (error) {
    console.error('Error verifying phone:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal memverifikasi nomor' });
  }
}