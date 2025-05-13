import axios from 'axios';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number, code, user_id } = req.body;

  try {
    const systemToken = process.env.WHATSAPP_SYSTEM_TOKEN;
    if (!systemToken) {
      return res.status(500).json({ error: 'System token not configured' });
    }

    // Verifikasi kode
    const response = await axios.post(
      'https://graph.facebook.com/v22.0/phone_numbers/verifications/verify',
      {
        phone_number,
        code,
      },
      {
        headers: {
          Authorization: `Bearer ${systemToken}`,
        },
      }
    );

    const phone_number_id = response.data.phone_number_id;

    // Simpan phone_number_id ke Supabase
    const { error } = await supabase
      .from('verified_phones')
      .insert([
        {
          user_id,
          phone_number_id,
          phone_number,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      return res.status(500).json({ error: `Gagal menyimpan nomor: ${error.message}` });
    }

    res.status(200).json({ phone_number_id });
  } catch (error) {
    console.error('Error verifying code:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal memverifikasi kode' });
  }
}