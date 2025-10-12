// src/pages/WinningProductsPage.tsx

import React, { useState, type FC } from 'react';
import { useWinningProducts, useProductCategories, type WinningProduct, type ProductFilters } from '../hooks/useWinningProducts';
import { FaSearch, FaChevronDown, FaTag, FaDollarSign, FaSortAmountDown, FaFire, FaSync } from 'react-icons/fa';

// --- Reusable Loader Component ---
const Loader: FC<{ text?: string }> = ({ text = "Chargement des produits..." }) => (
    <div className="flex flex-col justify-center items-center p-8 text-center col-span-full">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#f97316]"></div>
        <p className="mt-4 text-neutral-400">{text}</p>
    </div>
);

// --- Product Card Component ---
const ProductCard: FC<{ product: WinningProduct; onClick: () => void }> = ({ product, onClick }) => {
    const formatPrice = (price: number | null) => {
        if (price === null) return 'N/A';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(price);
    };

    return (
        <div
            onClick={onClick}
            className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-4 rounded-2xl border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col"
        >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-700">
                <img src={product.imageUrl ?? ''} alt={product.title ?? 'Product Image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="font-bold text-white font-montserrat line-clamp-2 text-sm flex-grow">{product.title}</h3>
            <div className="mt-2 flex justify-between items-center">
                <p className="text-lg font-black text-white">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-[#f97316]/20 text-[#f97316] px-2 py-1 rounded-full">
                    <FaFire />
                    <span>{product.salesVolume} ventes</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export const WinningProductsPage: FC = () => {
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 20,
        sortBy: 'salesVolume',
    });
    
    // We don't implement the modal for now to keep the code clean and focused
    // const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);

    const { data: categories, isLoading: isLoadingCategories } = useProductCategories();
    const { data: response, isLoading, isError, isFetching } = useWinningProducts(filters);

    const handleFilterChange = (key: keyof ProductFilters, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const products = response?.data ?? [];
    const meta = response?.meta;

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Produits Gagnants</h1>
            <p className="mt-2 text-neutral-400 max-w-2xl">
                Découvrez les produits les plus vendus et les plus tendances pour votre prochaine campagne.
            </p>

            {/* Filter Bar */}
            <div className="sticky top-16 z-10 bg-[#000000]/80 backdrop-blur-sm py-4 my-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-[#1a1a1a] text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                            onChange={(e) => handleFilterChange('keyword', e.target.value)}
                        />
                    </div>
                    {/* Category Select */}
                    <div className="relative">
                        <FaTag className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
                        <select
                            className="w-full appearance-none pl-10 pr-4 py-3 rounded-lg border-0 bg-[#1a1a1a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            disabled={isLoadingCategories}
                        >
                            <option value="">Toutes les catégories</option>
                            {categories?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <FaChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                    {/* Price Inputs */}
                     <div className="relative flex items-center gap-2">
                        <FaDollarSign className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 pl-10 pr-4 py-3 rounded-lg border-0 bg-[#1a1a1a] text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 py-3 px-4 rounded-lg border-0 bg-[#1a1a1a] text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>
                     {/* Sort Select */}
                    <div className="relative">
                        <FaSortAmountDown className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
                        <select
                            className="w-full appearance-none pl-10 pr-4 py-3 rounded-lg border-0 bg-[#1a1a1a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="salesVolume">Trier par Ventes</option>
                            <option value="newest">Trier par Nouveauté</option>
                            <option value="price_asc">Prix Croissant</option>
                            <option value="price_desc">Prix Décroissant</option>
                        </select>
                         <FaChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                     {/* Refresh/Status Button */}
                    <button
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#f97316] text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
                        disabled={isFetching}
                    >
                        <FaSync className={isFetching ? 'animate-spin' : ''} />
                        <span>{isFetching ? 'Chargement...' : 'Rafraîchir'}</span>
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                {isLoading && <Loader />}
                {isError && <p className="text-red-500 col-span-full text-center">Erreur lors du chargement des produits.</p>}
                {!isLoading && !isError && products.map(product => (
                    <ProductCard key={product.id} product={product} onClick={() => alert(`Product ${product.title} clicked.`)} />
                ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => handleFilterChange('page', meta.page - 1)}
                        disabled={meta.page <= 1}
                        className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-sm font-semibold text-white hover:bg-[#f97316] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Précédent
                    </button>
                    <span className="text-sm text-neutral-400">
                        Page {meta.page} sur {meta.totalPages}
                    </span>
                    <button
                        onClick={() => handleFilterChange('page', meta.page + 1)}
                        disabled={meta.page >= meta.totalPages}
                        className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-sm font-semibold text-white hover:bg-[#f97316] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </main>
    );
};