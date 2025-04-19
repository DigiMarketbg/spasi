
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Методът не е разрешен' });
    return;
  }

  const { id } = req.body;

  if (!id) {
    res.status(400).json({ error: 'ID на доброто дело не е предоставено' });
    return;
  }

  // Update good deed record to set is_approved=true
  const { error } = await supabase
    .from('good_deeds')
    .update({ is_approved: true })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ success: true });
}
