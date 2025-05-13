import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, waba_id, phone_number } = req.body;

  if (!user_id || !waba_id || !phone_number) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { error } = await supabaseAdmin.from('waba').insert({
      user_id,
      waba_id,
      phone_number,
    });
    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: `Failed to save WABA: ${err.message}` });
  }
}