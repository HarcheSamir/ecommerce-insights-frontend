// src/pages/SearchPage.tsx

import React, { useState, type FC } from 'react';
import { useSearchCreators, type Creator, type SearchParams } from '../hooks/useContentCreator';
// THIS IS THE FIX: Import the necessary icons
import { FaSearch, FaFilter, FaUsers, FaMapMarkerAlt, FaInstagram, FaYoutube, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useRegions } from '../hooks/useRegions';

// --- Reusable Glass Card Component (Your Original) ---
const GlassCard: FC<{ children: React.ReactNode; className?: string; padding?: string }> = ({ children, className = '', padding = 'p-6' }) => (
    <div className={`relative overflow-hidden border border-neutral-800 rounded-3xl transition-all duration-300 hover:border-neutral-700 ${className}`} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div className={`relative ${padding}`} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%,rgba(255, 255, 255, 0.05) 100%)' }}>
            {children}
        </div>
    </div>
);

// --- Influencer Card Component (Your Original, now with real data) ---
const InfluencerCard: FC<{ creator: Creator }> = ({ creator }) => {
    const formatNumber = (num: number | null | undefined) => {
        if (num === null || num === undefined) return 'N/A';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
    };

    const formatEngagement = (num: number) => `${num.toFixed(1)}%`;

    const mockData = {
        engagement: 4.8,
        avgViews: 125000,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.nickname || creator.username || 'A')}&background=2a2a2a&color=fff&size=128`,
        category: "Beauté & Mode"
    };

    return (
        <GlassCard padding="p-5">
            <div className="flex items-center gap-4 mb-4">
                <img src={mockData.avatar} alt={creator.nickname || ''} className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <h3 className="text-lg font-bold text-white">{creator.nickname || creator.username}</h3>
                    <p className="text-sm text-neutral-400">@{creator.username || 'username'}</p>
                </div>
            </div>
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-300 mb-4">{mockData.category}</span>
            <hr className="border-neutral-800" />
            <div className="grid grid-cols-3 gap-4 text-center my-4">
                <div><p className="text-sm text-neutral-400">Abonnés</p><p className="font-bold text-white mt-1">{formatNumber(creator.followers)}</p></div>
                <div><p className="text-sm text-neutral-400">Engagement</p><p className="font-bold text-green-400 mt-1">{formatEngagement(mockData.engagement)}</p></div>
                <div><p className="text-sm text-neutral-400">Vues Moy.</p><p className="font-bold text-white mt-1">{formatNumber(mockData.avgViews)}</p></div>
            </div>
            <hr className="border-neutral-800" />
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-neutral-400 flex items-center gap-2"><FaMapMarkerAlt /> {creator.region?.countryName || creator.region?.name || 'N/A'}</p>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center invisible justify-center rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-400 hover:text-white"><FaInstagram /></div>
                    {creator.instagram && <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-400 hover:text-white"><FaInstagram /></a>}
                    {creator.youtube && <a href={creator.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-400 hover:text-white"><FaYoutube /></a>}
                </div>
            </div>
            <button className="w-full mt-5 h-11 rounded-lg bg-gray-200 text-black font-semibold transition-colors hover:bg-gray-300">
                Contacter
            </button>
        </GlassCard>
    );
};


// --- Main Influencers Page ---
export const DatabasePage: FC = () => {
    const [filters, setFilters] = useState<SearchParams>({ keyword: '', country: '', page: 1, limit: 12 });
    const [tempKeyword, setTempKeyword] = useState('');

    const { data: searchData, isLoading: isSearching, isError } = useSearchCreators(filters);
    const { data: statsData } = useDashboardStats();
    const { data: regions, isLoading: isLoadingRegions } = useRegions();

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, keyword: tempKeyword, page: 1 }));
    };

    const handleNicheClick = (niche: string) => {
        const newKeyword = filters.keyword === niche ? '' : niche;
        setTempKeyword(newKeyword);
        setFilters(prev => ({ ...prev, keyword: newKeyword, page: 1 }));
    };

    const handleCountryChange = (countryCode: string) => {
        setFilters(prev => ({ ...prev, country: countryCode, page: 1 }));
    };

    const creators = searchData?.data || [];

    const statCards = [
        { icon: <FaUsers />, value: statsData?.totalInfluencers ? `${(statsData.totalInfluencers / 1000).toFixed(0)}K+` : '...', label: "Influenceurs Totaux", color: "text-green-400", bgColor: "bg-green-900/20" },
    ];

    const preDefinedNiches = ["Beauté & Mode", "Tech", "Lifestyle", "Fitness"];

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-white">Hub Influenceurs</h1>
                <p className="text-neutral-400 mt-1">Trouvez et contactez les meilleurs influenceurs pour promouvoir vos produits</p>
            </div>

            <GlassCard padding="p-5">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full flex-grow">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Rechercher des influenceurs..."
                            className="w-full bg-[#111317] border border-neutral-700 rounded-lg h-12 pl-11 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={tempKeyword}
                            onChange={(e) => setTempKeyword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        />
                    </div>
                    {/* --- THIS IS THE UI FIX FOR THE COUNTRY FILTER --- */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial md:w-52">
                            <FaGlobe className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500 pointer-events-none z-10" />
                            <select
                                value={filters.country}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                disabled={isLoadingRegions}
                                className="w-full appearance-none bg-[#111317] border border-neutral-700 rounded-lg h-12 pl-11 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                <option value="">Tous les pays</option>
                                {Array.isArray(regions) && regions.map(region => (
                                    <option key={region.id} value={region.name}>
                                        {region.countryName || region.name}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                        </div>
                        {preDefinedNiches.map(niche => (
                            <button
                                key={niche}
                                onClick={() => handleNicheClick(niche)}
                                className={`flex-1 md:flex-initial px-4 py-2 h-12 text-sm rounded-lg border font-semibold transition-colors hover:bg-neutral-800 whitespace-nowrap ${filters.keyword === niche ? 'bg-gray-200 text-black border-gray-200' : 'bg-[#1C1E22] border-neutral-700 text-white'
                                    }`}
                            >
                                {niche}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <GlassCard key={i} padding="p-5">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-700 ${stat.bgColor} ${stat.color} mb-4`}>{stat.icon}</div>
                        <p className="text-neutral-400 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </GlassCard>
                ))}
            </div>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Tous les Influenceurs</h2>
                    <button className="px-4 py-2 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Tout voir</button>
                </div>
                {isSearching && <p className="text-center text-neutral-400">Recherche des influenceurs...</p>}
                {isError && <p className="text-center text-red-500">Erreur lors de la recherche.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creators.length > 0 ? creators.map(creator => (
                        <InfluencerCard key={creator.id} creator={creator} />
                    )) : isSearching ? (
                        Array(6).fill(null).map((_, i) => <GlassCard key={i} className="h-96 animate-pulse" />)
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p>Aucun influenceur trouvé.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};