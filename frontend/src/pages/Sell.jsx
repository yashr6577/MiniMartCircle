import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import { createClient } from '@supabase/supabase-js';
import { ImageUp, Type } from 'lucide-react';

// Supabase upload helper (anon key and bucket required)
async function uploadToSupabase(file) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const bucket = import.meta.env.VITE_SUPABASE_BUCKET;
  if (!url || !key || !bucket) {
    console.error('Supabase config missing', { url, hasKey: Boolean(key), bucket });
    throw new Error('Supabase env not configured');
  }

  const supabase = createClient(url, key);
  const fileName = `${Date.now()}-${file.name}`;
  console.log('Uploading file via supabase-js', { bucket, fileName, type: file.type });

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  });
  if (error) {
    console.error('Supabase upload error', error);
    throw new Error(error.message || 'Upload failed');
  }
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(fileName);
  const publicUrl = pub?.publicUrl;
  console.log('Upload success, public URL', publicUrl);
  return publicUrl;
}

export default function Sell() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', price: '', imageFile: null, preview: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm({ ...form, imageFile: file, preview: file ? URL.createObjectURL(file) : null });
    }
    else setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let image_url = null;
      if (form.imageFile) {
        // Prefer backend upload to avoid RLS issues
        const fd = new FormData();
        fd.append('file', form.imageFile);
        const { data: up } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        image_url = up?.url || null;
        if (!image_url) throw new Error('Upload failed: no URL returned');
      }
      const PriceNum = Number(form.price);
      const { data } = await api.post('/products', { name: form.name, price: PriceNum, image_url });
      // redirect to home
      window.location.href = '/';
    } catch (err) {
      console.error('Publish product error', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-lg">
      <h1 className="text-center text-2xl md:text-3xl font-extrabold mb-4">List Your Product on <span className="text-blue-600">MiniMart</span></h1>
      <form onSubmit={onSubmit} className="card p-5 space-y-5 max-w-2xl w-full mx-auto bg-white p-8 rounded-2xl shadow-sm">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Product name</label>
          <div className="flex items-center gap-2 bg-white rounded-xl border px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <Type className="text-gray-400" size={18} />
            <input name="name" value={form.name} onChange={onChange} className="w-full outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
  <label className="block text-sm mb-1 font-medium">Image</label>

  <label
    className="
      border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center
      text-gray-500 cursor-pointer hover:bg-gray-50 transition
      relative
    "
  >
    {/* Preview */}
    {form.preview ? (
      <img
        src={form.preview}
        alt="preview"
        className="mx-auto max-h-60 rounded-xl object-cover"
      />
    ) : (
      <div className="flex flex-col items-center">
        <ImageUp className="mb-2 w-8 h-8 text-gray-400" />
        <p className="text-sm">Drag & drop or click to upload</p>
      </div>
    )}

    {/* Hidden File Input */}
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </label>

  <p className="text-xs text-gray-500 mt-2">
    Images are uploaded securely via server
  </p>
</div>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl text-white shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-105 disabled:opacity-60">
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
}
