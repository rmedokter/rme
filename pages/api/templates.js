import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, template_name, category, message_body } = req.body;

  if (!user_id || !template_name || !category || !message_body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabaseAdmin.from('templates').insert([
      {
        user_id,
        template_name,
        category,
        message_body,
      },
    ]).select('id').single();
    if (error) throw error;

    return res.status(200).json({ success: true, templateId: data.id });
  } catch (err) {
    return res.status(500).json({ error: `Failed to create template: ${err.message}` });
  }
}