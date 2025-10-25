// src/pages/WinningProductsPage.tsx

import React, { useState, type FC, useEffect } from 'react';
import { useWinningProducts, useProductCategories, type WinningProduct, type ProductFilters } from '../hooks/useWinningProducts';
import ProductDetailModal from '../components/ProductDetailModal';
// THIS IS THE FIX: Restore all necessary icons
import { 
    FaSearch, FaBoxOpen, FaTh, FaStar, FaDollarSign, FaSortAmountDown, FaChevronDown, FaSync
} from 'react-icons/fa';

// --- Reusable Glass Card Component (Your New Design) ---
const GlassCard: FC<{ children: React.ReactNode; className?: string; padding?: string }> = ({ children, className = '', padding = 'p-6' }) => (
    <div className={`relative overflow-hidden border border-neutral-800 rounded-3xl transition-all duration-300 hover:border-neutral-700 ${className}`} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div className={`relative flex flex-col flex-1 ${padding}`} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 100%)' }}>
            {children}
        </div>
    </div>
);

// --- Product Card Component (Your New Design) ---
const ProductCard: FC<{ product: WinningProduct; onClick: () => void }> = ({ product, onClick }) => {
    return (
        <GlassCard className="flex flex-col cursor-pointer hover:-translate-y-1 h-full" padding="p-0">
            <div onClick={onClick} className="flex flex-col h-full w-full flex-1">
                <div className="relative w-full h-48 bg-[#1C1E22] rounded-t-3xl overflow-hidden flex-shrink-0">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.title || 'Product'} className="w-full h-full object-cover"/>}
                </div>
                <div className="p-4  flex flex-col flex-1 min-h-0">
                    <h3 className="font-bold text-white truncate h-6">{product.title}</h3>
                    <span className="inline-block my-2 text-xs px-3 py-1 rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-300 self-start">{product.firstLevelCategoryName || "Catégorie"}</span>
                    
                    {product.shopName && (
                        <div className="text-sm mt-1">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-300 truncate pr-2">{product.shopName}</span>
                                {product.shopEvaluationRate && (
                                    <span className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                                        <FaStar size={12}/> {product.shopEvaluationRate}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-auto pt-4">
                        <div>
                            <p className="text-xs text-neutral-500">Prix</p>
                            <p className="text-xl font-bold text-white">{product.price?.toFixed(2) || '...'}€</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 text-right">Ventes</p>
                            <p className="text-xl font-bold text-white">{product.salesVolume?.toLocaleString('fr-FR') || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};


// --- Main Page Component ---
export const WinningProductsPage: FC = () => {
    const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12, sortBy: 'salesVolume' });
    const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);
    const [tempKeyword, setTempKeyword] = useState('');

    const { data: categories, isLoading: isLoadingCategories } = useProductCategories();
    // THIS IS THE FIX: Restore refetch and isFetching
    const { data: response, isLoading, isError, isFetching, refetch } = useWinningProducts(filters);
    
    // Debounce keyword input
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({ ...prev, keyword: tempKeyword, page: 1 }));
        }, 500);
        return () => clearTimeout(handler);
    }, [tempKeyword]);

    const handleCategoryClick = (category: string) => {
        setFilters(prev => ({ ...prev, category: prev.category === category ? '' : category, page: 1 }));
    };
    
    // THIS IS THE FIX: Generic handler for other filters
    const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const products = response?.data ?? [];
    const meta = response?.meta;

    const statCards = [
        { icon: <FaBoxOpen/>, value: meta?.total?.toLocaleString('fr-FR') || '...', label: "Produits Totaux", color: "text-red-400", bgColor: "bg-red-900/20" },
        { icon: <FaTh/>, value: categories?.length || '...', label: "Catégories", color: "text-orange-400", bgColor: "bg-orange-900/20" },
    ];
    
    return (
        <>
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
                <div>
                    <h1 className="text-4xl font-bold text-white">Recherche de Produits Tendances</h1>
                    <p className="text-neutral-400 mt-1">Découvrez les produits tendances avec les données Google Trends en temps réel</p>
                </div>

                <GlassCard padding="p-5">
                    {/* THIS IS THE FIX: A grid layout for all filter components */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative lg:col-span-2">
                            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500"/>
                            <input 
                                type="text" 
                                placeholder="Rechercher par mot-clé..." 
                                value={tempKeyword}
                                onChange={(e) => setTempKeyword(e.target.value)}
                                className="w-full bg-[#111317] border border-neutral-700 rounded-lg h-12 pl-11 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>
                        <div className="relative flex items-center gap-2">
                            <FaDollarSign className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                            <input type="number" placeholder="Min" className="w-1/2 pl-10 pr-4 h-12 rounded-lg border-0 bg-[#111317] border-neutral-700 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-400" onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
                            <input type="number" placeholder="Max" className="w-1/2 py-3 px-4 h-12 rounded-lg border-0 bg-[#111317] border-neutral-700 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-400" onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
                        </div>
                        <div className="relative">
                            <FaSortAmountDown className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                            <select className="w-full appearance-none pl-10 pr-4 h-12 rounded-lg border-0 bg-[#111317] border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-400" value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
                                <option value="salesVolume">Trier par Ventes</option>
                                <option value="newest">Trier par Nouveauté</option>
                                <option value="price_asc">Prix Croissant</option>
                                <option value="price_desc">Prix Décroissant</option>
                            </select>
                            <FaChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                        </div>
                         <button onClick={() => refetch()} className="flex items-center justify-center gap-2 h-12 rounded-lg bg-gray-200 text-sm font-semibold text-black hover:bg-gray-300 transition-opacity disabled:opacity-50 disabled:cursor-wait" disabled={isFetching}>
                            <FaSync className={isFetching ? 'animate-spin' : ''} />
                            <span>{isFetching ? 'Chargement...' : 'Rafraîchir'}</span>
                        </button>
                    </div>

                    <div className="flex gap-2 w-full flex-wrap mt-4">
                        {isLoadingCategories ? <p className="text-sm text-neutral-400">Chargement des catégories...</p> :
                         categories?.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`flex-1 md:flex-initial px-4 py-2 h-12 text-sm rounded-lg border font-semibold transition-colors whitespace-nowrap ${
                                    filters.category === cat ? 'bg-gray-200 text-black border-gray-200' : 'bg-[#1C1E22] border-neutral-700 text-white hover:bg-neutral-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                    {statCards.map((stat, i) => (
                        <GlassCard key={i} padding="p-5">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-700 ${stat.bgColor} ${stat.color} mb-4`}>{stat.icon}</div>
                            <p className="text-neutral-400 text-sm">{stat.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{isLoading ? '...' : stat.value}</p>
                        </GlassCard>
                    ))}
                </div>

                <section>
                     {isLoading && <p className="text-center text-neutral-400 py-10">Chargement des produits...</p>}
                     {isError && <p className="text-center text-red-500 py-10">Erreur lors du chargement des produits.</p>}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                         {!isLoading && products.map((product) => (
                             <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                         ))}
                     </div>
                </section>

                {meta && meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button onClick={() => setFilters(prev => ({...prev, page: prev.page! - 1}))} disabled={meta.page <= 1} className="px-4 py-2 rounded-lg bg-[#1C1E22] text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">Précédent</button>
                        <span className="text-sm text-neutral-400">Page {meta.page} sur {meta.totalPages}</span>
                        <button onClick={() => setFilters(prev => ({...prev, page: prev.page! + 1}))} disabled={meta.page >= meta.totalPages} className="px-4 py-2 rounded-lg bg-[#1C1E22] text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
                    </div>
                )}
            </main>

            {selectedProduct && (
                <ProductDetailModal product={selectedProduct} show={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </>
    );
};