// src/components/ProductDetailModal.tsx

import type { FC } from 'react';
import { FaTimes, FaExternalLinkAlt, FaChartLine, FaTag } from 'react-icons/fa';
import type { WinningProduct } from '../hooks/useWinningProducts';
import { useProductTrends } from '../hooks/useWinningProducts';
import ProductTrendChart from './ProductTrendChart';

interface ProductDetailModalProps {
  product: WinningProduct;
  show: boolean;
  onClose: () => void;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({ product, show, onClose }) => {
  const { data: trendData, isLoading, isError } = useProductTrends(product.id);

  if (!show) {
    return null;
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: product.currency ?? 'USD' }).format(price);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-neutral-800 to-neutral-700 border border-neutral-600/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ animationName: 'scale-in, fade-in', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 bg-neutral-700/80 hover:bg-neutral-600 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300">
          <FaTimes />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-neutral-700">
              <img src={product.imageUrl ?? ''} alt={product.title ?? 'Product Image'} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white font-montserrat">{product.title}</h2>
              <p className="text-sm text-neutral-400 mt-1">{product.categoryName}</p>
              
              <div className="flex items-baseline gap-4 my-4">
                <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
                <span className="text-sm font-semibold bg-[#f97316]/20 text-[#f97316] px-2 py-1 rounded-full">
                  {product.salesVolume} ventes
                </span>
              </div>
              
              <a 
                href={product.productUrl ?? '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-auto py-3 px-6 rounded-lg text-base font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity"
              >
                <FaExternalLinkAlt />
                Voir sur AliExpress
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-700/50 pt-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <FaChartLine className="text-[#f97316]" />
              Tendance Google
            </h3>
            
            {/* --- DISPLAY THE KEYWORD HERE --- */}
            {product.googleTrendKeyword && (
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                <FaTag size={12} />
                <span className="italic">Terme de recherche : "{product.googleTrendKeyword}"</span>
              </div>
            )}
            
            <ProductTrendChart data={trendData} isLoading={isLoading} isError={isError} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;