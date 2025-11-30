import { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products || []);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openProduct = async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setSelected(data.product);
    } catch (e) {
      console.error('Failed to load product', e);
    }
  };

  const [search, setSearch] = useState('');
  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Other'];
  const [cat, setCat] = useState('All');
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter(p => {
      const matchSearch = !s || p.name?.toLowerCase().includes(s);
      // No server-side categories; keep UI-only filter for now
      return matchSearch;
    });
  }, [products, search]);

  return (
    <div className="container">
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Find. Buy. Sell. All on <span className="text-blue-600">MiniMart</span></h1>
        <p className="text-gray-600 mt-2">Where smart shoppers meet great sellers.</p>
        <div className="mt-6 max-w-2xl mx-auto flex items-center gap-2 p-2 rounded-full shadow bg-white">
          <Search className="text-gray-400 ml-2" size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 outline-none px-2 py-2 rounded-full" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full transition-all ${cat===c ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{c}</button>
          ))}
        </div>
      </section>

      {/* Grid */}
      {loading ? (
        <p className="text-center py-10">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => openProduct(p.id)} />
          ))}
        </div>
      )}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
