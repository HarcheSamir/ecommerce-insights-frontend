// src/pages/ProfilePage.tsx

import React, { useState, useEffect, useRef, type FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUser';
import { useWinningProducts, type WinningProduct } from '../hooks/useWinningProducts';
import { TrainingPage } from './TrainingPage';
import { WinningProductsPage } from './WinningProductsPage';
import { DatabasePage as InfluencersPage } from './SearchPage';
import ProductDetailModal from '../components/ProductDetailModal';

import { useDashboardStats } from '../hooks/useDashboardStats';
import { useNotifications } from '../hooks/useNotifications';

import {
  FaTachometerAlt, FaChartLine, FaVideo, FaUsers, FaCog, FaShieldAlt, FaSignOutAlt, FaGlobe, FaChevronRight, FaStar, FaSearch, FaBars, FaBell
} from 'react-icons/fa';

// --- Type Definitions ---
type NavLink = { name: string; icon: React.ReactNode; pageKey: string };

// --- HELPER: Time Ago Function ---
const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Il y a ${Math.floor(interval)} ans`;
    interval = seconds / 2592000;
    if (interval > 1) return `Il y a ${Math.floor(interval)} mois`;
    interval = seconds / 86400;
    if (interval > 1) return `Il y a ${Math.floor(interval)} jours`;
    interval = seconds / 3600;
    if (interval > 1) return `Il y a ${Math.floor(interval)} heures`;
    interval = seconds / 60;
    if (interval > 1) return `Il y a ${Math.floor(interval)} minutes`;
    return `Il y a quelques secondes`;
};


// --- Animation Hooks & Components ---
const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [options]);
    return [ref, isInView];
};

const AnimatedSection: FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({ children, className, delay = '0s' }) => {
    const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`${className} transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{transitionDelay: delay}}>
            {children}
        </div>
    );
};

const AnimatedNumber: FC<{ value: number }> = ({ value }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [displayValue, setDisplayValue] = useState(0);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsInView(true);
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            if (start === end) return;
            
            // +++ THIS IS THE FIX +++
            const duration = 1500; // Animation duration in milliseconds
            const frameDuration = 1000 / 60; // 60 frames per second
            const totalFrames = Math.round(duration / frameDuration);
            const increment = Math.max(1, Math.ceil(end / totalFrames)); // Calculate step size

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayValue(end); // Ensure it ends on the exact value
                    clearInterval(timer);
                } else {
                    setDisplayValue(start);
                }
            }, frameDuration);
            // +++ END OF FIX +++

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{displayValue.toLocaleString('fr-FR')}</span>;
};

// --- Reusable Glass Card Component ---
const GlassCard: FC<{ children: React.ReactNode; className?: string; padding?: string }> = ({ children, className = '', padding = 'p-6' }) => (
    <div className={`relative overflow-hidden border border-neutral-800 rounded-3xl transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 ${className}`} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div className={`relative ${padding}`} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%,rgba(255, 255, 255, 0.05) 100%)' }}>
            {children}
        </div>
    </div>
);


// --- Main Dashboard View ---
const DashboardContent: FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { data: userProfile } = useUserProfile();
    const { data: productsResponse, isLoading: productsLoading } = useWinningProducts({ page: 1, limit: 4 });
    const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);

    const { data: statsData, isLoading: statsLoading } = useDashboardStats();
    const { data: notifications, isLoading: notificationsLoading } = useNotifications();

    // +++ THIS IS THE FIX +++
    const statCards = [
        { icon: <FaChartLine />, value: statsData?.totalWinningProducts, label: "Produits tendances" },
        { icon: <FaVideo />, value: statsData?.totalCourses, label: "Cours disponibles" },
        { icon: <FaUsers />, value: statsData?.totalInfluencers, label: "Influenceurs actifs" },
        { icon: <FaGlobe />, value: statsData?.countriesCovered, label: "Pays couverts" },
    ];
    // +++ END OF FIX +++

    return (
        <>
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
                <AnimatedSection>
                    <h1 className="text-4xl font-bold text-white">Bienvenue, {userProfile?.firstName || 'Jean'} !</h1>
                    <p className="text-neutral-400 mt-1">Voici un aperçu de votre activité aujourd'hui</p>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <AnimatedSection key={i} delay={`${i * 100}ms`}>
                            <GlassCard padding="p-5">
                                <div className="flex justify-between items-start">
                                    <div className="bg-[#1C1E22] border border-neutral-700 w-10 h-10 flex items-center justify-center rounded-xl text-neutral-400">{stat.icon}</div>
                                </div>
                                <p className="text-4xl font-bold text-white mt-4">
                                    { (statsLoading || typeof stat.value === 'undefined') ? '...' : <AnimatedNumber value={stat.value} /> }
                                </p>
                                <p className="text-neutral-400 text-sm mt-1">{stat.label}</p>
                            </GlassCard>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Produits du Jour</h2><button onClick={() => onNavigate('Produits tendances')} className="px-4 py-2 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Voir tout les produits</button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(productsLoading ? Array(4).fill({}) : productsResponse?.data || []).map((product: Partial<WinningProduct>, i) => (
                             <GlassCard key={product.id || i} padding="p-0" className={product.id ? "cursor-pointer" : "cursor-default"}>
                                <div onClick={() => product.id && setSelectedProduct(product as WinningProduct)}>
                                    <div className="w-full h-40 bg-[#1C1E22] rounded-t-3xl overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.title || 'Product'} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-800 animate-pulse"></div>}</div>
                                    <div className="p-4 space-y-3">
                                        <h3 className="font-bold text-white truncate h-5">{product.title || "Chargement..."}</h3>
                                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#1C1E22] border border-neutral-700 text-neutral-300">{product.categoryName || "Catégorie"}</span>
                                        <p className="text-sm text-neutral-400 flex items-center gap-2"><FaChartLine/> {product.salesVolume?.toLocaleString('fr-FR') || 0} ventes/mois</p>
                                        <hr className="border-neutral-800" />

                                        {product.shopName && (
                                            <div className="text-sm">
                                                <p className="text-neutral-500 mb-1">Vendu par</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-300 truncate pr-2">{product.shopName}</span>
                                                    {product.shopEvaluationRate && (
                                                        <span className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                                                            <FaStar/> {product.shopEvaluationRate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <hr className="border-neutral-800" />
                                        <div className="flex justify-between items-center">
                                            <div><p className="text-xs text-neutral-500">À partir de</p><p className="text-xl font-bold text-white">{product.price?.toFixed(2) || '...'}€</p></div>
                                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-colors"><FaSearch/></button>
                                        </div>
                                    </div>
                                </div>
                             </GlassCard>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard><div className="bg-[#1C1E22] border border-neutral-700 w-10 h-10 flex items-center justify-center rounded-xl text-neutral-400 mb-4"><FaChartLine /></div><h3 className="font-bold text-white text-lg">Découvrir les Tendances</h3><p className="text-neutral-400text-sm my-2">Explorez les derniers produits tendances avec les données Google Trends en temps réel.</p><button onClick={() => onNavigate('Produits tendances')} className="group mt-4 flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-white">Voir les tendances <FaChevronRight className="transition-transform group-hover:translate-x-1"/> </button></GlassCard>
                    <GlassCard><div className="bg-[#1C1E22] border border-neutral-700 w-10 h-10 flex items-center justify-center rounded-xl text-neutral-400 mb-4"><FaVideo /></div><h3 className="font-bold text-white text-lg">Commencer la Formation</h3><p className="text-neutral-400 text-sm my-2">Accédez aux cours vidéo d'experts pour maîtriser la création de boutique Shopify.</p><button onClick={() => onNavigate('Formations vidéo')} className="group mt-4 flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-white">Voir les cours <FaChevronRight className="transition-transform group-hover:translate-x-1"/> </button></GlassCard>
                    <GlassCard><div className="bg-[#1C1E22] border border-neutral-700 w-10 h-10 flex items-center justify-center rounded-xl text-neutral-400 mb-4"><FaUsers /></div><h3 className="font-bold text-white text-lg">Trouver des Influenceurs</h3><p className="text-neutral-400 text-sm my-2">Connectez-vous avec des influenceurs pour amplifier vos campagnes marketing.</p><button onClick={() => onNavigate('Influenceurs')} className="group mt-4 flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-white">Parcourir les influenceurs <FaChevronRight className="transition-transform group-hover:translate-x-1"/> </button></GlassCard>
                </AnimatedSection>
                
                <AnimatedSection>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Activité Récente</h2><button className="px-4 py-2 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Tout voir</button></div>
                    <GlassCard padding="p-0">
                        {notificationsLoading ? (
                             <p className="p-5 text-center text-neutral-400">Chargement de l'activité...</p>
                        ) : !notifications || notifications.length === 0 ? (
                            <p className="p-5 text-center text-neutral-500">Aucune activité récente à afficher.</p>
                        ) : (
                            <ul className="divide-y divide-neutral-800">
                                {notifications.map((activity) => (
                                    <li key={activity.id} className="flex items-center gap-4 p-5">
                                        <div className="bg-[#1C1E22] border border-neutral-700 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-neutral-400">
                                            <FaBell />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-white">{activity.message}</p>
                                        </div>
                                        <p className="text-sm text-neutral-500 flex-shrink-0">{timeAgo(activity.createdAt)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </GlassCard>
                </AnimatedSection>

            </main>
            {selectedProduct && (
                <ProductDetailModal product={selectedProduct} show={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </>
    );
}

// --- Sidebar Component ---
const Sidebar: FC<{ activePage: string; onNavigate: (page: string) => void; isOpen: boolean; }> = ({ activePage, onNavigate, isOpen }) => {
    const { data: user } = useUserProfile();
    const { logout } = useAuth();

    const navLinks: NavLink[] = [
        { name: 'Tableau de bord', icon: <FaTachometerAlt />, pageKey: 'Tableau de bord' },
        { name: 'Produits tendances', icon: <FaChartLine />, pageKey: 'Produits tendances' },
        { name: 'Formations vidéo', icon: <FaVideo />, pageKey: 'Formations vidéo' },
        { name: 'Influenceurs', icon: <FaUsers />, pageKey: 'Influenceurs' },
        { name: 'Paramètres', icon: <FaCog />, pageKey: 'Paramètres' },
        { name: 'Admin', icon: <FaShieldAlt />, pageKey: 'Admin' },
    ];

    const sidebarClasses = `
        bg-[#111317] p-6 flex flex-col h-screen transition-transform duration-300 ease-in-out
        w-72 flex-shrink-0 fixed top-0 left-0 z-40
        md:sticky md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <aside className={sidebarClasses}>
            <div className="flex items-center gap-3 mb-10"><svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg><h1 className="text-xl font-bold text-white">LOGO & TITRE</h1></div>
            <nav className="flex flex-col gap-2">{navLinks.map((link) => (<button key={link.name} onClick={() => onNavigate(link.pageKey)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-left ${link.pageKey === activePage ? 'bg-gray-200 text-black font-semibold' : 'text-neutral-400 hover:bg-[#1C1E22] hover:text-white'}`}>{link.icon} <span>{link.name}</span></button>))}</nav>
            <div className="mt-auto"><div className="flex items-center gap-3 p-3 rounded-lg bg-[#1C1E22]"><div className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</div><div><p className="font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p><p className="text-sm text-neutral-400 truncate">{user?.email}</p></div></div><button onClick={logout} className="mt-4 flex items-center gap-3 text-neutral-400 hover:text-white w-full text-left p-3"><FaSignOutAlt /><span>Déconnexion</span></button></div>
        </aside>
    );
};

// --- A generic page for features not yet built ---
const ComingSoonPage: FC<{pageTitle: string}> = ({ pageTitle }) => (
    <main className="flex-1 flex flex-col p-6 md:p-8">
         <div className="mb-8"><h1 className="text-4xl font-bold text-white">{pageTitle}</h1><p className="text-neutral-400 mt-1">Cette sectionest en cours de construction.</p></div>
        <div className="flex-1 flex items-center justify-center"><GlassCard className="text-center"><h2 className="text-2xl font-bold text-white">Bientôt disponible</h2><p className="text-neutral-400 mt-2">Nous travaillons dur pour vous apporter cette fonctionnalité !</p></GlassCard></div>
    </main>
);

// --- Main Page Component / Controller ---
const DashboardPage: FC = () => {
    const [currentPage, setCurrentPage] = useState('Tableau de bord');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleNavigate = (pageKey: string) => {
        setCurrentPage(pageKey);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const pages: { [key: string]: React.ReactNode } = {
        'Tableau de bord': <DashboardContent onNavigate={handleNavigate} />,
        'Produits tendances': <WinningProductsPage />,
        'Formations vidéo': <TrainingPage />,
        'Influenceurs': <InfluencersPage />,
        'Paramètres': <ComingSoonPage pageTitle="Paramètres"/>,
        'Admin': <ComingSoonPage pageTitle="Admin"/>,
    };

    return (
        <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #000000 0%, #030712 50%, #000000 100%)' }}>
            <div className="flex">
                {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
                <Sidebar activePage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
                <div className="flex-1 flex flex-col min-w-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden absolute top-5 left-5 z-20 p-2 bg-[#1C1E22] rounded-md text-white">
                        <FaBars />
                    </button>
                    {pages[currentPage] || <DashboardContent onNavigate={handleNavigate} />}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;