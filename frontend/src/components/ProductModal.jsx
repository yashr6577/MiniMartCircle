import { useEffect } from 'react';
import { Phone, User } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!product) return null;

  const telHref = product.seller_phone ? `tel:${product.seller_phone}` : undefined;

  return (
    <div
  className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade flex items-center justify-center p-4"
  onClick={onClose}
>
  <div
    className="
      bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden 
      transform transition-all
    "
    onClick={(e) => e.stopPropagation()}
  >
    <div className="grid grid-cols-1 md:grid-cols-2">
      
      {/* Product Image */}
      <div className="bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-72 md:h-full object-cover rounded-l-3xl"
          />
        ) : (
          <div className="h-72 md:h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-8 flex flex-col">
        {/* Product Title */}
        <h2 className="text-2xl font-bold text-gray-900">
          {product.name}
        </h2>

        {/* Price */}
        <p className="text-indigo-600 text-2xl font-bold mt-2">
          ₹{Number(product.price).toFixed(2)}
        </p>

        {/* Divider */}
        <div className="border-b my-5"></div>

        {/* Seller Info */}
        <div className="flex items-start gap-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 shadow">
            <User size={18} />
          </span>

          <div>
            <div className="text-sm text-gray-500">Seller</div>
            <div className="font-semibold text-gray-800 text-lg">
              {product.seller_name}
            </div>
            <div className="text-gray-500 text-sm">{product.seller_phone}</div>
          </div>
        </div>

        {/* Description Placeholder (Optional for better info UI) */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            {product.description || "No additional product description available."}
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-auto pt-8 flex justify-end">
          <button
            onClick={onClose}
            className="
              px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 
              transition text-gray-700 font-medium shadow-sm
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
