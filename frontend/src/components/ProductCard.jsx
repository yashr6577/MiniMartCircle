import { User } from 'lucide-react';

export default function ProductCard({ product, onClick }) {
  return (
    <div className="card p-3 cursor-pointer hover:shadow-md" onClick={onClick}>
      <div className="overflow-hidden rounded-xl">
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover transform hover:scale-[1.03] transition-all duration-300" />
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-gray-900 text-lg truncate">{product.name}</h3>
        <p className="text-indigo-600 font-bold mt-1">₹{Number(product.price).toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600"><User size={14} /></span>
          <span className="truncate">{product.seller_name || 'Seller'}</span>
        </div>
      </div>
    </div>
  );
}
