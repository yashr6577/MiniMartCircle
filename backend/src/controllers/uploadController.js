const { createClient } = require('@supabase/supabase-js');

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const bucket = process.env.SUPABASE_BUCKET;
  if (!url || !serviceKey || !bucket) {
    throw new Error('Supabase server env not configured: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET');
  }
  const client = createClient(url, serviceKey);
  return { client, bucket };
}

async function uploadImage(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { client, bucket } = getSupabaseClient();
    const original = req.file.originalname || 'image';
    const ext = original.includes('.') ? original.split('.').pop() : 'bin';
    const fileName = `${Date.now()}_${req.user.id}.${ext}`;

    const { data, error } = await client.storage.from(bucket).upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype || 'application/octet-stream',
      upsert: true,
    });
    if (error) {
      console.error('Supabase upload error', error);
      return res.status(400).json({ message: error.message || 'Upload failed' });
    }

    const { data: pub } = client.storage.from(bucket).getPublicUrl(fileName);
    const publicUrl = pub && pub.publicUrl ? pub.publicUrl : null;
    if (!publicUrl) {
      return res.status(500).json({ message: 'Failed to generate public URL' });
    }

    return res.status(201).json({ url: publicUrl, path: data?.path });
  } catch (err) {
    console.error('Upload controller error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { uploadImage };
