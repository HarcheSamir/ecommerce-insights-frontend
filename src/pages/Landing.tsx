// src/pages/Landing.tsx

import React, { useState, useEffect, useRef, type FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaCheck, FaChartLine, FaPlayCircle, FaUsers, FaRocket, FaChevronRight } from 'react-icons/fa';

// --- Custom Hook for Scroll Animations ---
const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isInView];
};

// --- Reusable Animated Section Wrapper ---
const AnimatedSection: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`${className} transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            {children}
        </div>
    );
};

// --- Header Component ---
const MenuIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    )}
  </svg>
);

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();
  
    useEffect(() => {
      if (isMenuOpen) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
      return () => { document.body.style.overflow = 'auto'; };
    }, [isMenuOpen]);
  
    return (
      <>
        <header className="sticky top-0 z-50 px-6 pt-6 animate-[fadeIn-up_1s_ease-out]">
            <div className="container mx-auto bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between h-16 px-6">
                    <a href="/" className="flex items-center gap-3" aria-label="Home">
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg>
                        <h2 className="text-lg font-bold text-white">LOGO & TITRE</h2>
                    </a>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a className="text-neutral-400 hover:text-white transition-colors" href="#features">Fonctionnalités</a>
                        <a className="text-neutral-400 hover:text-white transition-colors" href="/pricing">Tarifs</a>
                        <a className="text-neutral-400 hover:text-white transition-colors" href="#footer">À propos</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        {!isLoading && !isAuthenticated && (
                        <>
                            <a className="hidden sm:inline-block text-sm font-medium text-neutral-400 hover:text-white transition-colors" href="/login">Connexion</a>
                            <a className="hidden sm:inline-block rounded-lg bg-gray-200 text-black px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-300" href="/signup">Commencer gratuitement</a>
                        </>
                        )}
                        {!isLoading && isAuthenticated && ( <a className="hidden sm:inline-block rounded-lg bg-gray-200 text-black px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-300" href="/dashboard">Tableau de bord</a> )}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-neutral-100 z-50 p-2 -mr-2" aria-controls="mobile-menu" aria-expanded={isMenuOpen}><MenuIcon open={isMenuOpen} /></button>
                    </div>
                </div>
            </div>
        </header>
        <div id="mobile-menu" className={`fixed inset-0 z-40 bg-[#0d0f12]/95 backdrop-blur-md md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl font-medium">
            <a onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-white" href="#features">Fonctionnalités</a>
            <a onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-white" href="/pricing">Tarifs</a>
            <a onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-white" href="#footer">À propos</a>
            <div className="mt-8 flex flex-col items-center gap-6 w-full px-8">
                {!isLoading && !isAuthenticated && (
                    <>
                        <a className="w-full text-center text-lg font-medium text-neutral-300 hover:text-white" href="/login">Connexion</a>
                        <a className="w-full text-center rounded-lg bg-gray-200 text-black px-5 py-3 text-lg font-semibold" href="/signup">Commencer gratuitement</a>
                    </>
                )}
                {!isLoading && isAuthenticated && ( <a className="w-full text-center rounded-lg bg-gray-200 text-black px-5 py-3 text-lg font-semibold" href="/dashboard">Tableau de bord</a> )}
            </div>
          </nav>
        </div>
      </>
    );
};

const Hero: FC = () => {
    return (
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 text-center">
            <div className="container mx-auto px-6 relative z-10">
                <div className="inline-flex items-center gap-3 bg-[#1C1E22] border border-neutral-800 rounded-full px-4 py-2 mb-8 animate-[fadeIn-up_1s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
                    <FaStar className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-300">Plateforme tout-en-un pour e-commerçants</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight animate-[fadeIn-up_1s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
                    L'outil qui révèle les<br />secrets de l'e-commerce !
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-400 leading-relaxed animate-[fadeIn-up_1s_ease-out_0.6s] opacity-0 [animation-fill-mode:forwards]">
                    Accédez aux tendances produits en temps réel avec Google Trends, formez-vous
                    sur Shopify et connectez-vous avec les meilleurs influenceurs.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeIn-up_1s_ease-out_0.8s] opacity-0 [animation-fill-mode:forwards]">
                    <a className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-gray-200 text-black font-semibold text-base transition-transform hover:scale-105 w-full sm:w-auto animate-[pulse-glow_2.5s_infinite]" href='/signup'>
                        Commencer gratuitement
                    </a>
                    <a className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-[#1C1E22] border border-neutral-700 text-white font-semibold text-base transition-colors hover:bg-neutral-800 w-full sm:w-auto" href='#features'>
                        Voir la démo
                    </a>
                </div>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 text-sm text-neutral-500 animate-[fadeIn-up_1s_ease-out_1s] opacity-0 [animation-fill-mode:forwards]">
                    <div className="flex items-center gap-2"> <FaCheck /> <span>Essai gratuit 14 jours</span> </div>
                    <div className="flex items-center gap-2"> <FaCheck /> <span>Sans carte bancaire</span> </div>
                    <div className="flex items-center gap-2"> <FaCheck /> <span>Annulation à tout moment</span> </div>
                </div>
            </div>
        </section>
    );
};

const Features: FC = () => {
    const featureList = [
        { icon: <FaChartLine className="h-6 w-6 text-neutral-400" />, title: "Recherche de Produits", description: "Découvrez les produits tendances avec Google Trends, trouvez des fournisseurs fiables et analysez les marchés par pays.", points: [ "Données Google Trends en temps réel", "Base de fournisseurs vérifiés", "Analyse par pays et région" ], buttonText: "Explorer les tendances", link: "/dashboard" },
        { icon: <FaPlayCircle className="h-6 w-6 text-neutral-400" />, title: "Formation Vidéo", description: "Apprenez à créer et gérer votre boutique Shopify avec des formations complètes par des experts.", points: [ "Cours complets sur Shopify", "Tutoriels étape par étape", "Ressources téléchargeables" ], buttonText: "Commencer la formation", link: "/dashboard" },
        { icon: <FaUsers className="h-6 w-6 text-neutral-400" />, title: "Hub Influenceurs", description: "Trouvez et contactez les meilleurs influenceurs pour promouvoir vos produits et booster vos ventes.", points: [ "Base de données d'influenceurs", "Statistiques détaillées", "Contact direct et suivi" ], buttonText: "Trouver des influenceurs", link: "/dashboard" }
    ];

    return (
        <section id="features" className="py-20 sm:py-24">
            <AnimatedSection className="container mx-auto px-6 text-center">
                <div className="inline-block bg-[#1C1E22] border border-neutral-800 rounded-full px-5 py-2 mb-6">
                    <span className="font-semibold text-neutral-300">Fonctionnalités</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Tout ce dont vous avez besoin</h2>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Une plateforme complète pour réussir dans le e-commerce</p>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {featureList.map((feature, index) => (
                        <div key={index} className="group relative overflow-hidden border border-neutral-800 rounded-3xl transition-all duration-300 hover:border-neutral-700 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:w-48 group-hover:h-48"></div>
                            <div className="relative p-8 flex flex-col h-full" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 100%)' }}>
                                <div className="relative z-10 flex flex-col flex-grow">
                                    <div className="flex-shrink-0 bg-[#1C1E22] border border-neutral-700 w-12 h-12 flex items-center justify-center rounded-xl mb-6"> {feature.icon} </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-neutral-400 mb-6 leading-relaxed">{feature.description}</p>
                                        <ul className="space-y-3">
                                            {feature.points.map((point, pIndex) => (
                                                <li key={pIndex} className="flex items-center gap-3 text-neutral-400"> <FaCheck className="text-neutral-500" /> <span>{point}</span> </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-8">
                                        <a href={feature.link} className="w-full inline-block text-center rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold py-3 transition-colors hover:bg-neutral-800">{feature.buttonText}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </section>
    );
};

const AnimatedNumber = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const duration = 1500;
                const end = value;
                const stepTime = Math.max(1, Math.floor(duration / end));

                const timer = setInterval(() => {
                    start += 1;
                    setDisplayValue(start);
                    if (start >= end) {
                        setDisplayValue(end);
                        clearInterval(timer);
                    }
                }, stepTime);
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });

        observer.observe(element);
        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref}>{displayValue}</span>;
}

const Stats: FC = () => {
    const statsList = [ { value: 15, label: "k+", text: "Produits tendances" }, { value: 120, label: "+", text: "Heures de formation" }, { value: 1, label: "M+", text: "Influenceurs actifs" }, { value: 180, label: "+", text: "Pays couverts" }];

    return (
        <section className="py-20 sm:py-24">
             <AnimatedSection className="container mx-auto px-6">
                <div className="relative overflow-hidden border border-neutral-800 rounded-3xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="relative px-8 py-12" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 100%)' }}>
                        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {statsList.map((stat, index) => (
                                <div key={index}>
                                    <p className="text-5xl font-bold text-white"><AnimatedNumber value={stat.value} />{stat.label}</p>
                                    <p className="mt-2 text-neutral-400">{stat.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
};

const CTA: FC = () => {
    return (
      <section className="py-20 sm:py-24">
        <AnimatedSection className="container mx-auto px-6">
          <div className="relative overflow-hidden border border-neutral-800 rounded-3xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="relative p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 100%)' }}>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full"> <FaRocket className="w-8 h-8 text-black" /> </div>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Prêt à développer votre business ?</h2>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">Rejoignez des milliers d'entrepreneurs qui utilisent InfluenceContact pour trouver des produits gagnants et développer leur boutique en ligne.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="/signup" className="group flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-gray-200 text-black font-semibold text-base transition-colors hover:bg-gray-300 w-full sm:w-auto">
                    <span>Démarrer gratuitement</span> <FaChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#features" className="group flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-[#1C1E22] border border-neutral-700 text-white font-semibold text-base transition-colors hover:bg-neutral-800 w-full sm:w-auto">
                    <span>Voir la démo</span> <FaChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    );
};

const Footer: FC = () => {
    return (
        <footer className="py-16" id="footer">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4"><svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" /></svg><h3 className="text-lg font-bold text-white">LOGO & TITRE</h3></div>
                        <p className="text-neutral-400">La plateforme tout-en-un pour réussir dans le e-commerce.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Produit</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Recherche de produits</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Formation vidéo</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Hub influenceurs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Entreprise</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">À propos</a></li>
                            <li><a href="/pricing" className="text-neutral-400 hover:text-white transition-colors">Tarifs</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contacts</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Légal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Confidentialité</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Conditions d'utilisations</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
                    <p>© 2025. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

function LandingPage() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
          const id = hash.substring(1);
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const backgroundStyle = { background: 'linear-gradient(135deg, #000000 0%, #030712 50%, #000000 100%)' };

    return (
        <div style={backgroundStyle} className="relative text-white font-sans overflow-hidden">
            <div className="absolute top-[-20rem] left-[-25rem] w-[50rem] h-[50rem] rounded-full animate-[float-A_15s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(40, 58, 114, 0.2), transparent 60%)', filter: 'blur(128px)' }} />
            <div className="absolute top-[30rem] right-[-30rem] w-[60rem] h-[60rem] rounded-full animate-[float-B_20s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(40, 58, 114, 0.15), transparent 70%)', filter: 'blur(128px)' }} />
            <div className="relative ">
                <Header />
                <main>
                    <Hero />
                    <Features />
                    <Stats />
                    <CTA />
                </main>
                <Footer />
            </div>
        </div>
    );
}
  
export default LandingPage;