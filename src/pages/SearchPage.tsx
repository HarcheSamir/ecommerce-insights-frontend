import React,{ useEffect, useRef, useState, type FC } from 'react';
// Assuming these hooks are in your project and properly typed.
// Example types might be:
// useUserProfile: () => { data?: { firstName: string; email: string; } }
// useAuth: () => { logout: () => void; }
import { useUserProfile } from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';


// --- Type Definitions ---

type NavLink = {
    name: string;
    iconPath: string;
    href?: string;
};

type Influencer = {
    name: string;
    category: string;
    imageUrl: string;
};


// --- Prop Types ---

type SidebarProps = {
    activePage: string;
};

type NavIconProps = {
    path: string;
};

type StatCardProps = {
    title: string;
    value: string;
};

type InfluencerCardProps = {
    name: string;
    category: string;
    imageUrl: string;
};


// --- SVG Icon Components ---

const LogoIcon: FC = () => (
    <svg className="h-8 w-8 text-[#f97316]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
    </svg>
);

const NavIcon: FC<NavIconProps> = ({ path }) => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clipRule="evenodd" d={path} fillRule="evenodd"></path>
    </svg>
);


// --- Reusable Component Sections ---

const Sidebar: FC<SidebarProps> = ({ activePage }) => {
    const navLinks: NavLink[] = [
        { name: 'Dashboard', iconPath: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" , href: "/dashboard" },
        { name: 'Database', iconPath: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" },
        { name: 'My Campaigns', iconPath: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" },
        { name: 'Analytics', iconPath: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" },
        { name: 'Billing', iconPath: "M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" }
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#000000] border-r border-[#374151] transition-all duration-300 p-6">
            <div className="flex items-center gap-3 text-[#ffffff] mb-10">
                <LogoIcon />
                <h1 className="text-xl font-bold">Influen-Z</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href ?? "#" } className={`flex items-center gap-3 px-4 py-2.5 text-[#9ca3af] rounded-lg hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-colors duration-200 ${link.name === activePage ? 'bg-[#1a1a1a] text-[#ffffff] font-semibold' : ''}`}>
                        <NavIcon path={link.iconPath} />
                        <span>{link.name}</span>
                    </a>
                ))}
            </nav>
            <div className="mt-auto">
                <button className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity">
                    Create New Campaign
                </button>
            </div>
        </aside>
    );
};

const Header: FC = () => {
    const { data: user } = useUserProfile();
    const { logout } = useAuth();
    const [isUserTooltipVisible, setUserTooltipVisible] = useState<boolean>(false);
    const [isNotificationTooltipVisible, setNotificationTooltipVisible] = useState<boolean>(false);
    const userTooltipRef = useRef<HTMLDivElement>(null);
    const notificationTooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userTooltipRef.current && !userTooltipRef.current.contains(event.target as Node)) {
                setUserTooltipVisible(false);
            }
            if (notificationTooltipRef.current && !notificationTooltipRef.current.contains(event.target as Node)) {
                setNotificationTooltipVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between bg-[#000000]/80 backdrop-blur-sm border-b border-[#374151] px-8 py-4">
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
            <div className="flex items-center gap-6">
                <div className="relative w-64">
                    <input className="w-full rounded-lg border-0 bg-[#1a1a1a] py-2 pl-10 pr-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]" placeholder="Search..." type="search" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </div>
                </div>
                <div className="relative" ref={notificationTooltipRef}>
                    <button onClick={() => setNotificationTooltipVisible(!isNotificationTooltipVisible)} className="relative rounded-full p-2 text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-[#ffffff]">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f97316] opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#f97316]"></span>
                        </span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </button>
                    {isNotificationTooltipVisible && (
                        <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-[#374151] rounded-md shadow-lg p-4">
                            <p className="text-center text-sm text-[#9ca3af]">No notifications for the moment.</p>
                        </div>
                    )}
                </div>
                <div className="relative" ref={userTooltipRef}>
                    <button onClick={() => setUserTooltipVisible(!isUserTooltipVisible)} className="flex items-center gap-3">
                        <img alt="User avatar" className="h-10 w-10 rounded-full object-cover" src={`https://ui-avatars.com/api/?format=svg&name=${user?.firstName?.charAt(0) ?? "A"}&background=f97316&color=ffffff`} />
                        <div className="text-left text-sm">
                            <div className="font-semibold text-[#ffffff]">{user?.firstName}</div>
                            <div className="text-xs uppercase text-[#9ca3af]">{user ? "activated" : "disabled"}</div>
                        </div>
                    </button>
                    {isUserTooltipVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#374151] rounded-md shadow-lg py-1">
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-[#ffffff] hover:bg-[#f97316] hover:text-[#ffffff] transition-colors">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const StatCard: FC<StatCardProps> = ({ title, value }) => (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#374151] flex flex-col justify-between">
        <p className="text-sm font-medium text-[#9ca3af]">{title}</p>
        <p className="text-4xl font-bold text-[#ffffff]">{value}</p>
    </div>
);

const InfluencerCard: FC<InfluencerCardProps> = ({ name, category, imageUrl }) => (
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-transparent hover:border-[#f97316] transition-all duration-300">
        <div className="w-full aspect-square bg-cover bg-center rounded-lg mb-3" style={{ backgroundImage: `url("${imageUrl}")` }}></div>
        <h3 className="font-semibold truncate">{name}</h3>
        <p className="text-sm text-[#9ca3af]">{category}</p>
    </div>
);


// --- Page Components ---

export const DashboardPage: FC = () => {
    const recommendedInfluencers: Influencer[] = [
        { name: 'Chloe Foster', category: 'Fashion', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjUsN_gfyPXyLEYlxhRyrXYFchbzD5FIXiSJ8su83p8sckuXJvWq5YcFHapuSenqsv7TwX1-yvcMcHcIv_UWiqEyIun0Lp869LdsiQNQGRltvgXZuIFGFuh3Q0-IB695ssDUCLIPXZcu7GLCQ_VvcMMJ_B-UPKpD5oTnTVBTZ1G_t2Zv6QwOY_rGt9xAYwPOfTjeJktRQIQwuaggqVOqPjVGsq8pgBgszbxaS1DZGdgxbXDcWx0FCS1BE0NkJ-6EIEoH8rr5tN5Oc' },
        { name: 'Liam Turner', category: 'Tech', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP1_FTTK27kFWBliX0y-5_O7BQSACsbcRdWseI0lgXM69vhHD3ZPKxBdmFrfgUpF1nvtxqTBjxwe0UzAVwUwq-ZeqcZuz1UR5RR7AQWhXVnTKhNQQS1-OXsfY_5HNrMv0yZfzkscy2EpZ58py-QDCjI1tYetzKtlsGMMcz7Q4VG9Er7reZe88Ql4Jm8a9KJbkdf09DP3SGjyaq0NM709hVvYJ4tOGSJGnj0eZKD9XzZ3YHc_G-CT-TF79mYH5XOXkcmKJZ4N2rWDg' },
        { name: 'Isabella Reed', category: 'Lifestyle', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArbuwNuHG7sY8c9R44U_qBna92xlGVI_sog8ZSUNsnYfZ5LyBFV0hzI811cFDj2QpriYy0HMsl2MdDZZlbS7VE5JOgKti3rfYXeCNV2oqu3dGLqQjOno9dqxkyNwzym8aTIJ6fjjJko1xBTwgBL_Yd5hBIJXcH2UJnCVEgk1mJI9cRoUsm4sCUSEtQNQ8RE73W6LLtzPoZlB810Xox6dMb8_UfEXZjFuw-IRJsPvbufnx0-m_useZwzBFJEs9n3sna75gd8xsTmKA' },
        { name: 'Jackson Cole', category: 'Travel', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4iGVAYAAnU4W9fThF-Ki8gR9xcr39tc0ybFstiFPdtHyTp37NC3jwBcATrM6MQouM_kUZFJ7e6K7u2h5zgTB6njJaRyDhFCtFpSDIBP8J4O1krs_G0UZyhjuwT5QUagJ-bMVzpyAX3-EcQo4alSBGdK2-fPoNDsZjHGVm35iHEz4FFn5eHLuCrT-KqjFBEWNYo5TSdVw7izy_Eila7LMLRDEcj6fOZmzkj-UCUdyl5pc5nGDSMjTVfB5vF1WNf-2l5kDNYU-Pjg4' },
    ];
    return (
        <div className="bg-[#000000] text-[#ffffff] font-['Inter',_sans-serif]">
            <div className="flex min-h-screen">
                <Sidebar activePage="Dashboard" />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-4">Good morning, Amelia!</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard title="Saved Influencers" value="45" />
                                        <StatCard title="Active Campaigns" value="3" />
                                        <StatCard title="Monthly Searches" value="120" />
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold tracking-tight text-white">Recommended For You</h2>
                                        <a className="text-sm font-semibold text-[#f97316] hover:underline" href="#">View All</a>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {recommendedInfluencers.map(inf => <InfluencerCard key={inf.name} {...inf} />)}
                                    </div>
                                </section>
                            </div>
                            <div className="lg:col-span-1 space-y-8">
                               <section>
                                <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Recent Activity</h2>
                               </section>
                               <section>
                                <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Recently Viewed</h2>
                               </section>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export const DatabasePage: FC = () => {
    const [keyword, setKeyword] = useState<string>('');
    const [country, setCountry] = useState<string>('');

    // Mock data for search results
    const searchResults: Influencer[] = [
        { name: 'Alina Becker', category: 'Gaming', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT-A0-dO2TcfL6d2UrOh24KVg_zX1E8GcfhP_Y-Gibp2JkFqg_g4s54YVvT7q4i5P_YQhU7-Lh2y_tX_hkiuJpBf28_O3l-bJ4sR-xM9n_kE-P3-t-O7c-H0i-Z-c-H-c-E-g-E_g' },
        { name: 'Marco Ricci', category: 'Food', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2tZtJ8bQ9k8_x8v6c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k' },
        { name: 'Sophie Dubois', category: 'Art & Design', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_tZtJ8bQ9k8_x8v6c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k' },
        { name: 'Kenji Tanaka', category: 'Photography', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_tZtJ8bQ9k8_x8v6c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k_x_v3c5_Q1r_Z9o_v9c_w7_t3n_k' }
    ];

    return (
        <div className="bg-[#000000] text-[#ffffff] font-['Inter',_sans-serif]">
            <div className="flex min-h-screen">
                <Sidebar activePage="Database" />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-8">
                        <section>
                            <h2 className="text-2xl font-bold tracking-tight text-white">Find Content Creators</h2>
                            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
                                <input
                                    className="w-full md:w-1/2 rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                                    placeholder="Search by keyword (e.g., Fashion, Tech)"
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <input
                                    className="w-full md:w-1/2 rounded-lg border-0 bg-[#1a1a1a] py-3 px-4 text-sm text-[#ffffff] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                                    placeholder="Search by country (e.g., USA, Brazil)"
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                                <button className="w-full md:w-auto py-3 px-8 rounded-lg text-sm font-semibold bg-[#f97316] text-white hover:opacity-90 transition-opacity">
                                    Search
                                </button>
                            </div>
                        </section>

                        <section className="mt-10">
                            <h3 className="text-xl font-bold tracking-tight text-white">Results</h3>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {searchResults.map(inf => <InfluencerCard key={inf.name} {...inf} />)}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};