import React, { useState, useRef, useEffect, type FC } from 'react';
import { useCreatePaymentIntent, useUserProfile } from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';
import { useRegions, type Region } from '../hooks/useRegions';
import { useRecordVisit, useSearchCreators, type Creator } from '../hooks/useContentCreator';
import { CheckIcon } from './Pricing';
import { FaInstagram, FaYoutube, FaTiktok, FaTimes, FaEnvelope, FaBars, FaUsers } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// --- Type Definitions ---
type NavLink = {
  name: string;
  iconPath: string;
};

const features = [
  "Accès à tous les influenceurs",
  "Recherches illimitées",
  "Analyses avancées",
  "Outils de gestion de campagne",
  "Support par e-mail prioritaire",
];

const stripePromise = loadStripe('pk_test_51RgAboCOP3DyKdIPrLT8WRwLlhlJwhRZVApS3yeRnNTL531gkNo3FQqLxdcK0ihh5fBAXDD7EpR3gLq3t0D422cw00NqiK2ntk');

interface Influencer {
  id: string;
  name: string;
  category?: string;
  imageUrl?: string;
  instagram?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  email?: string;
  followers?: number | null;
}

// --- Prop Types ---
type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

type NavIconProps = {
  path: string;
};

interface StatCardProps {
  title: string;
  value: string | number;
}

interface InfluencerCardProps extends Influencer {
  key: string;
}

// --- SVG Icon Components ---
const LogoIcon: FC = () => (
  <svg className="h-8 w-8 text-[#f97316]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
      fill="currentColor"
    />
  </svg>
);

const NavIcon: FC<NavIconProps> = ({ path }) => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" d={path} fillRule="evenodd" />
  </svg>
);

// --- Protected Content Wrapper ---
interface ProtectedContentProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
}

const ProtectedContent: FC<ProtectedContentProps> = ({ children, setCurrentPage }) => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  useEffect(() => {
    if (!isLoading && !error && userProfile && !userProfile.hasPaid) {
      setCurrentPage('Facturation');
    }
  }, [isLoading, error, userProfile, setCurrentPage]);

  if (isLoading) {
    return <div className="text-white text-center p-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Erreur lors du chargement du profil. Veuillez réessayer.</div>;
  }

  if (!userProfile?.hasPaid) {
    return null; // Redirect happens via setCurrentPage in useEffect
  }

  return <>{children}</>;
};

// --- Reusable Component Sections ---
const Sidebar: FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onToggle }) => {
  const navLinks: NavLink[] = [
    {
      name: 'Tableau de bord',
      iconPath:
        'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    },
    {
      name: 'Base de données',
      iconPath:
        'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z',
    },
 
    {
      name: 'Facturation',
      iconPath:
        'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z',
    },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#000000] border-r border-[#374151] transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col p-6`}
      >
        <div className="flex items-center gap-3 text-[#ffffff] mb-10">
          <LogoIcon />
          <a href="/">
            <h1 className="text-xl font-bold">InfluenceContact</h1>
          </a>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                onNavigate(link.name);
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              className={`flex items-center text-left w-full gap-3 px-4 py-2.5 text-[#9ca3af] rounded-lg hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-colors duration-200 ${
                link.name === activePage ? 'bg-[#1a1a1a] text-[#ffffff] font-semibold' : ''
              }`}
            >
              <NavIcon path={link.iconPath} />
              <span>{link.name}</span>
            </button>
          ))}
        </nav>
        {/* <div className="mt-auto">
          <button className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity">
            Créer une nouvelle campagne
          </button>
        </div> */}
      </aside>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={onToggle}></div>
      )}
    </>
  );
};

const Header: FC<{ title: string; onToggleSidebar: () => void }> = ({ title, onToggleSidebar }) => {
  const { data: user } = useUserProfile();
  const { logout } = useAuth();
  const [isUserTooltipVisible, setUserTooltipVisible] = useState<boolean>(false);
  const [isNotificationTooltipVisible, setNotificationTooltipVisible] = useState<boolean>(false);
  const userTooltipRef = useRef<HTMLDivElement>(null);
  const notificationTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userTooltipRef.current && !userTooltipRef.current.contains(event.target as Node)) setUserTooltipVisible(false);
      if (notificationTooltipRef.current && !notificationTooltipRef.current.contains(event.target as Node))
        setNotificationTooltipVisible(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-[#000000]/80 backdrop-blur-sm border-b border-[#374151] px-4 md:px-8 py-4">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#ffffff] p-2" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <FaBars className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:relative md:w-64">
          <input
            className="w-full rounded-lg border-0 bg-[#1a1a1a] py-2 pl-10 pr-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            placeholder="Rechercher..."
            type="search"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="relative" ref={notificationTooltipRef}>
          <button
            onClick={() => setNotificationTooltipVisible(!isNotificationTooltipVisible)}
            className="relative rounded-full p-2 text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-[#ffffff]"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f97316] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#f97316]"></span>
            </span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          {isNotificationTooltipVisible && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-[#374151] rounded-md shadow-lg p-4">
              <p className="text-center text-sm text-[#9ca3af]">Aucune notification pour le moment.</p>
            </div>
          )}
        </div>
        <div className="relative" ref={userTooltipRef}>
          <button onClick={() => setUserTooltipVisible(!isUserTooltipVisible)} className="flex items-center gap-3">
            <img
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
              src={`https://ui-avatars.com/api/?format=svg&name=${user?.firstName?.charAt(0) ?? 'A'}&background=f97316&color=ffffff`}
            />
            <div className="hidden md:block text-left text-sm">
              <div className="font-semibold text-[#ffffff]">{user?.firstName}</div>
              <div className="text-xs uppercase text-[#9ca3af]">{user ? 'activé' : 'désactivé'}</div>
            </div>
          </button>
          {isUserTooltipVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#374151] rounded-md shadow-lg py-1">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-[#ffffff] hover:bg-[#f97316] hover:text-[#ffffff] transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const DashboardContent: FC = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  const isDataAvailable = !isLoading && !error && userProfile;

  const recommendedInfluencers: Influencer[] = isDataAvailable
    ? userProfile.visitedProfiles
        .map((profile) => ({
          id: profile.creator.id,
          name: profile.creator.nickname || profile.creator.username || 'Inconnu',
          category: `${profile.creator.region?.flag } ${profile.creator.region?.countryName || profile.creator.region?.name || ''}`.trim() || 'Monde',
          imageUrl: undefined,
          instagram: profile.creator.instagram,
          youtube: profile.creator.youtube,
          tiktok: null,
          email: undefined,
          followers: profile.creator.followers,
        }))
        .filter((influencer, index, self) => 
          index === self.findIndex((i) => i.id === influencer.id)
        )
        .slice(0, 6) // Limit to 6 unique influencers
    : [];


  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Bonjour, {isDataAvailable ? userProfile.firstName : 'Utilisateur'}!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Influenceurs sauvegardés" value={isDataAvailable ? userProfile.totalVisitsCount : 0} />
              <StatCard title="Campagnes actives" value={3} />
              <StatCard title="Recherches mensuelles" value={isDataAvailable ? userProfile.totalSearchCount : 0} />
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Récemment visités</h2>
              <a className="text-sm font-semibold text-[#f97316] hover:underline" href="#">
                Voir tout
              </a>
            </div>
            {isLoading ? (
              <p className="text-white">Chargement des influenceurs...</p>
            ) : error ? (
              <p className="text-red-500">Erreur lors du chargement des influenceurs. Veuillez réessayer.</p>
            ) : recommendedInfluencers.length === 0 ? (
              <p className="text-white">Aucun influenceur récemment visité.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {recommendedInfluencers.map((inf) => (
                  <InfluencerCard
                    key={inf.id}
                    id={inf.id}
                    name={inf.name}
                    category={inf.category}
                    imageUrl={`https://ui-avatars.com/api/?format=svg&name=${encodeURIComponent(inf.name)}&background=2a2a2a&color=ffffff`}
                    followers={inf.followers}
                    instagram={inf.instagram}
                    youtube={inf.youtube}
                    tiktok={inf.tiktok}
                    email={inf.email}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

const DatabaseContent: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [minFollowers, setMinFollowers] = useState<string>('');
  const [maxFollowers, setMaxFollowers] = useState<string>('');

  const { data: regions, isLoading: isLoadingRegions, isError: isRegionsError } = useRegions();
  const { mutate: search, data: searchData, isPending: isSearching, isError: isSearchError } = useSearchCreators();

  const platformOptions = [
    { value: '', label: 'Toutes les plateformes' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
  ];

  const followerRanges = [
    { value: '', label: 'Tous les followers' },
    { value: '1000-10000', label: '1K - 10K' },
    { value: '10000-100000', label: '10K - 100K' },
    { value: '100000-1000000', label: '100K - 1M' },
    { value: '1000000+', label: '1M+' },
  ];

  useEffect(() => {
    // Initial search to populate with default data
    search({ keyword: '', country: 'US' });
   }, []);

  const handleSearch = () => {
    const searchParams: any = {
      keyword,
      country: selectedCountry,
    };

    if (selectedPlatform) {
      searchParams.platform = selectedPlatform;
    }

    if (minFollowers) {
      searchParams.minFollowers = parseInt(minFollowers);
    }

    if (maxFollowers) {
      searchParams.maxFollowers = parseInt(maxFollowers);
    }

    search(searchParams);
  };

  const handleFollowerRangeChange = (range: string) => {
    if (range === '') {
      setMinFollowers('');
      setMaxFollowers('');
    } else if (range === '1000000+') {
      setMinFollowers('1000000');
      setMaxFollowers('');
    } else {
      const [min, max] = range.split('-').map(Number);
      setMinFollowers(min.toString());
      setMaxFollowers(max.toString());
    }
  };

  const creators = searchData?.data.data;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <section>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Trouver des créateurs de contenu</h2>
        
        {/* Main Search Row */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <input
            className="w-full rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            placeholder="Rechercher par mot-clé..."
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            disabled={isLoadingRegions}
          >
            <option value="" disabled>
              {isLoadingRegions ? 'Chargement des pays...' : 'Sélectionnez un pays'}
            </option>
            {isRegionsError && <option disabled>Erreur lors du chargement des pays</option>}
            {regions?.data.map((region: Region) => (
              <option key={region.id} value={region.name}>
                {region.flag} {region.countryName || region.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto py-3 px-8 rounded-lg text-sm font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isSearching ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>

        {/* Filters Row */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          >
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={minFollowers && maxFollowers ? `${minFollowers}-${maxFollowers}` : minFollowers ? `${minFollowers}+` : ''}
            onChange={(e) => handleFollowerRangeChange(e.target.value)}
            className="w-full rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          >
            {followerRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Custom Range Inputs */}
          <div className="flex gap-2 w-full md:w-auto">
            <input
              className="w-24 rounded-lg border-0 bg-[#1a1a1a] py-3 px-3 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              placeholder="Min"
              type="number"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
            />
            <span className="flex items-center text-[#9ca3af]">-</span>
            <input
              className="w-24 rounded-lg border-0 bg-[#1a1a1a] py-3 px-3 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              placeholder="Max"
              type="number"
              value={maxFollowers}
              onChange={(e) => setMaxFollowers(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h3 className="text-xl font-bold tracking-tight text-white">Résultats</h3>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {isSearching && <p className="text-[#9ca3af] col-span-full">Chargement des résultats...</p>}
          {isSearchError && <p className="text-red-500 col-span-full">Une erreur est survenue lors de la recherche.</p>}
          {!isSearching && !isSearchError && (
            <>
              {!creators && <p className="text-[#9ca3af] col-span-full">Commencez une nouvelle recherche pour trouver des créateurs.</p>}
              {creators && creators.length === 0 && <p className="text-[#9ca3af] col-span-full">Aucun résultat trouvé pour votre requête.</p>}
              {creators?.map((creator: Creator) => {
                const creatorName = creator.nickname || creator.username || 'N/A';
                return (
                  <InfluencerCard
                    key={creator.id}
                    id={creator.id}
                    name={creatorName}
                    category={creator.region.flag + ' ' + ( creator.region.countryName || creator.region.name )}
                    imageUrl={`https://ui-avatars.com/api/?format=svg&name=${encodeURIComponent(creatorName)}&background=2a2a2a&color=ffffff`}
                    instagram={creator.instagram}
                    youtube={creator.youtube}
                    tiktok={creator.profileLink}
                    email={creator.email ?? undefined}
                    followers={creator.followers ?? undefined}
                  />
                );
              })}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

const ComingSoonContent: FC = () => (
  <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
    <div className="text-center px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Bientôt disponible!</h2>
      <p className="text-base md:text-lg text-[#9ca3af]">Cette fonctionnalité est en cours de construction. Veuillez revenir plus tard.</p>
    </div>
  </main>
);

const PaymentForm: FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { mutate: createPaymentIntent, isPending, data, error } = useCreatePaymentIntent();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleCreateIntent = async () => {
    if (!user?.id) {
      setPaymentError('Utilisateur non authentifié');
      return;
    }
    createPaymentIntent();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !data?.data.clientSecret) {
      setPaymentError('Stripe ou l\'intention de paiement n\'est pas initialisé');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Élément de carte non trouvé');
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user?.email ?? '',
          },
        },
      });

      if (error) {
        setPaymentError(error.message || 'Échec du paiement');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentSuccess(true);
        // wait two seconds before refreshing the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setPaymentError('Une erreur est survenue lors du traitement du paiement');
      console.error(err);
    }
  };

  return (
    <div className="mt-6">
      {!data?.data.clientSecret && (
        <button
          onClick={handleCreateIntent}
          disabled={isPending || !user?.id}
          className="w-full py-3 px-6 rounded-lg text-base font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Création de l\'intention de paiement...' : 'Démarrer le paiement'}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      {data?.data.clientSecret && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="bg-[#1a1a1a] border border-[#374151] rounded-lg p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#f97316',
                  },
                },
              }}
            />
          </div>
         {!paymentSuccess &&  <button
            type="submit"
            disabled={!stripe || isPending}
            className="w-full mt-4 py-3 px-6 rounded-lg text-base font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Traitement...' : 'Payer €49.00'}
          </button> }
        </form>
      )}
      {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
      {paymentSuccess && <p className="text-green-500 text-sm mt-2">Paiement effectué avec succès !</p>}
    </div>
  );
};

const PaymentFormWrapper: FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

const PricingContent: FC = () => {
  const { data } = useUserProfile();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-lg border-2 border-[#f47b25] bg-[#1a1a1a] p-6 md:p-8">
          <div className="flex-grow">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-white">Accès à vie</h3>
              <p className="mt-2 flex items-baseline justify-center gap-2">
                <span className="text-5xl md:text-6xl font-bold tracking-tight text-white">€49.00</span>
              </p>
              <p className="text-base md:text-lg text-[#a3a3a3]">Paiement unique</p>
            </div>
            <ul className="mt-8 space-y-4 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon color="#f47b25" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          {!data?.hasPaid && !showPaymentForm && (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#f47b25] text-black text-base font-bold transition-transform hover:scale-105 w-full mt-8"
            >
              Obtenez l'accès maintenant
            </button>
          )}
          {!data?.hasPaid && showPaymentForm && <PaymentFormWrapper />}
          {data?.hasPaid && (
            <button className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-green-600 text-white text-base font-bold transition-transform hover:scale-105 w-full mt-8">
              <CheckIcon color="white" /> Déjà activé
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

const formatFollowers = (followers: number): string => {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  }
  return followers.toString();
};

const InfluencerCard: FC<InfluencerCardProps> = ({ id, name, followers, email, category, imageUrl, instagram, tiktok, youtube }) => {
  const { mutate: recordVisit } = useRecordVisit();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    recordVisit(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-6 rounded-2xl border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f97316]/10"
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-white truncate pr-2">{name}</h3>
            <div className="w-2 h-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <p className="text-sm text-neutral-400 mb-3 font-medium">{category}</p>
          
          {followers !== undefined && followers !== null && (
            <div className="flex items-center text-sm text-neutral-500 mb-4">
              <div className="bg-gradient-to-r from-[#f97316]/20 to-[#ea580c]/20 rounded-full p-1 mr-2">
                <FaUsers className="w-3 h-3 text-[#f97316]" />
              </div>
              <span className="font-semibold">{formatFollowers(followers)} followers</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#d62976] transition-all duration-300 transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-3 group-hover/social:shadow-lg group-hover/social:shadow-[#d62976]/25 transition-all duration-300">
                  <FaInstagram className="w-4 h-4" />
                </div>
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#00f2ea] transition-all duration-300 transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-3 group-hover/social:shadow-lg group-hover/social:shadow-[#00f2ea]/25 transition-all duration-300">
                  <FaTiktok className="w-4 h-4" />
                </div>
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#ff0000] transition-all duration-300 transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-3 group-hover/social:shadow-lg group-hover/social:shadow-[#ff0000]/25 transition-all duration-300">
                  <FaYoutube className="w-4 h-4" />
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-500" onClick={closeModal}>
          <div
            className="relative bg-gradient-to-br from-neutral-800/90 to-neutral-700/80 border border-neutral-600/30 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-xl transform transition-all duration-500 scale-100 animate-float"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 w-8 h-8 bg-neutral-700/50 hover:bg-neutral-600/50 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-300 backdrop-blur-sm" aria-label="Close modal">
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="p-8 text-center">
              {/* Premium Avatar */}
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] p-1">
                  <div className="w-full h-full rounded-full bg-neutral-800 overflow-hidden">
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
              </div>

              {/* Name & Category */}
              <h2 className="text-3xl font-black text-white mb-2">{name}</h2>
              <p className="text-lg font-semibold bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent mb-4">{category}</p>
              
              {/* Followers */}
              {followers != null && followers != undefined && (
                <div className="flex items-center justify-center text-neutral-400 mb-6">
                  <div className="bg-gradient-to-r from-[#f97316]/20 to-[#ea580c]/20 rounded-full p-2 mr-3">
                    <FaUsers className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <span className="text-lg font-bold">{formatFollowers(followers)} followers</span>
                </div>
              )}

              {/* Social Media */}
              <div className="flex justify-center space-x-4 mb-6">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#d62976] transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                    <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-4 group-hover/social:shadow-lg group-hover/social:shadow-[#d62976]/25 transition-all duration-300">
                      <FaInstagram className="w-6 h-6" />
                    </div>
                  </a>
                )}
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#00f2ea] transition-all duration-300 transform hover:scale-110" aria-label="TikTok">
                    <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-4 group-hover/social:shadow-lg group-hover/social:shadow-[#00f2ea]/25 transition-all duration-300">
                      <FaTiktok className="w-6 h-6" />
                    </div>
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" className="group/social text-neutral-400 hover:text-[#ff0000] transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
                    <div className="bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full p-4 group-hover/social:shadow-lg group-hover/social:shadow-[#ff0000]/25 transition-all duration-300">
                      <FaYoutube className="w-6 h-6" />
                    </div>
                  </a>
                )}
              </div>

              {/* Email Display */}
              {email && (
                <div className="mb-6 p-4 bg-gradient-to-br from-neutral-700/50 to-neutral-600/30 rounded-2xl border border-neutral-600/30 backdrop-blur-sm">
                  <h4 className="text-sm font-semibold text-neutral-400 mb-2">Email de contact</h4>
                  <div className="text-white">
                    <span className="text-sm break-all font-medium">{email}</span>
                  </div>
                </div>
              )}

              {/* Contact Button */}
              <a
                href={`mailto:${email}`}
                className="group w-full inline-flex items-center justify-center bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/25"
              >
                <FaEnvelope className="mr-3 w-5 h-5" />
                {email ? 'Envoyer un email' : 'Contact'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatCard: FC<StatCardProps> = ({ title, value }) => (
  <div className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-8 rounded-2xl border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f97316]/10">
    <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <p className="text-sm font-medium text-neutral-400 mb-3">{title}</p>
      <p className="text-4xl md:text-5xl font-black text-white">
        <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">{value}</span>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
        <span className="text-xs text-neutral-500">Temps réel</span>
      </div>
    </div>
  </div>
);

// --- Main App Component ---
const DashboardPage: FC = () => {
  const [currentPage, setCurrentPage] = useState('Tableau de bord');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Tableau de bord':
        return (
          <ProtectedContent setCurrentPage={setCurrentPage}>
            <DashboardContent />
          </ProtectedContent>
        );
      case 'Base de données':
        return (
          <ProtectedContent setCurrentPage={setCurrentPage}>
            <DatabaseContent />
          </ProtectedContent>
        );
     
      case 'Facturation':
        return <PricingContent />;
      default:
        return (
          <ProtectedContent setCurrentPage={setCurrentPage}>
            <DashboardContent />
          </ProtectedContent>
        );
    }
  };

  return (
    <div className="bg-[#000000] text-[#ffffff] font-['Inter',_sans-serif]">
      <div className="flex min-h-screen">
        <Sidebar activePage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={currentPage} onToggleSidebar={toggleSidebar} />
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;