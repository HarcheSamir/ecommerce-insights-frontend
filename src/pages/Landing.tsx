import React, { useState, useEffect, type FC } from 'react';
import { useAuth } from '../context/AuthContext';

// --- Reusable SVG Icon Component for the Header ---
const MenuIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {open ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16m-7 6h7"
      />
    )}
  </svg>
);


export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);


  return (
    <>
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="InfluenceContact Home">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-[#f97316]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold font-montserrat">InfluenceContact</h2>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a className="text-neutral-100 hover:text-[#f97316] transition-colors" href="/home">Accueil</a>
              <a className="text-neutral-100 hover:text-[#f97316] transition-colors" href="#features">Fonctionnalités</a>
              <a className="text-neutral-100 hover:text-[#f97316] transition-colors" href="/pricing">Tarifs</a>
              <a className="text-neutral-100 hover:text-[#f97316] transition-colors" href="#footer">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              {!isLoading && !isAuthenticated &&
                <a className="hidden sm:inline-block rounded-md bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" href="/login">Connexion</a>
              }
              {!isLoading && isAuthenticated &&
                <a className="hidden sm:inline-block rounded-md bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" href="/dashboard">Dashboard</a>
              }

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-neutral-100 z-50 p-2 -mr-2"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <MenuIcon open={isMenuOpen} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-neutral-900/95 backdrop-blur-md md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-medium">
          <a onClick={() => setIsMenuOpen(false)} className="text-neutral-100 hover:text-[#f97316] transition-colors" href="/home">Accueil</a>
          <a onClick={() => setIsMenuOpen(false)} className="text-neutral-100 hover:text-[#f97316] transition-colors" href="#features">Fonctionnalités</a>
          <a onClick={() => setIsMenuOpen(false)} className="text-neutral-100 hover:text-[#f97316] transition-colors" href="/pricing">Tarifs</a>
          <a onClick={() => setIsMenuOpen(false)} className="text-neutral-100 hover:text-[#f97316] transition-colors" href="#footer">Contact</a>
          {/* Login/Dashboard button for mobile menu */}
          <div className="mt-4">
            {!isLoading && !isAuthenticated &&
              <a className="inline-block rounded-md bg-[#f97316] px-6 py-3 text-lg font-medium text-white transition-opacity hover:opacity-90" href="/login">Connexion</a>
            }
            {!isLoading && isAuthenticated &&
              <a className="inline-block rounded-md bg-[#f97316] px-6 py-3 text-lg font-medium text-white transition-opacity hover:opacity-90" href="/dashboard">Dashboard</a>
            }
          </div>
        </nav>
      </div>
    </>
  );
};

export const Hero = () => {
  return (
    <section className="relative pt-20 md:pt-24 lg:pt-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f97316%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#f97316] rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-[#ea580c] rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-ping opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 border border-[#f97316]/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-[#f97316]">Plateforme Premium</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-2xl font-montserrat mb-6">
          Accédez aux{' '}
          <span className="bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent animate-gradient-x">
            meilleurs influenceurs
          </span>
          {' '}de votre secteur
        </h1>
        
        <p className="mt-6 max-w-4xl mx-auto text-lg sm:text-xl text-neutral-200/80 drop-shadow-lg leading-relaxed">
          Notre plateforme révolutionnaire vous donne accès à une base de données exclusive de{' '}
          <span className="font-semibold text-[#f97316]">plus d'un million d'influenceurs</span>, 
          vous permettant de trouver le partenaire parfait pour propulser votre marque vers de nouveaux sommets.
        </p>

        {/* Premium CTA Section */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl h-14 px-8 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/25" href='/pricing'>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ea580c] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
              Découvrir les influenceurs
            </span>
          </a>
          
          <a className="group inline-flex items-center justify-center rounded-2xl h-14 px-8 border-2 border-[#f97316]/30 text-[#f97316] font-semibold text-lg transition-all duration-300 hover:border-[#f97316] hover:bg-[#f97316]/10 backdrop-blur-sm" href='#features'>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Voir la démo
            </span>
          </a>
        </div>

        {/* Premium Stats */}
        <div className="mt-16 lg:mt-20 pb-16 md:pb-20">
          <div className="inline-flex items-center gap-8 bg-gradient-to-r from-neutral-800/60 to-neutral-700/60 backdrop-blur-xl rounded-3xl px-8 py-6 border border-neutral-600/30 shadow-2xl">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">1M+</span>
              </div>
              <div className="text-sm font-medium text-neutral-400">Influenceurs actifs</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-500 to-transparent"></div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">50K+</span>
              </div>
              <div className="text-sm font-medium text-neutral-400">Marques satisfaites</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-500 to-transparent"></div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">99.9%</span>
              </div>
              <div className="text-sm font-medium text-neutral-400">Temps de disponibilité</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const VisualShowcase = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-black via-neutral-900 to-neutral-900 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto">
          {/* Image Container with Premium Frame */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316] rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
            
            {/* Main Image Frame */}
            <div className="relative bg-gradient-to-br from-neutral-800/90 to-neutral-700/80 rounded-3xl p-2 sm:p-3 border border-neutral-600/40 backdrop-blur-sm shadow-2xl">
              {/* Image Placeholder with Aspect Ratio */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-800" style={{ aspectRatio: '21/9' }}>
                {/* Replace this div with your actual image */}
                <img 
                  src="/images/together_influ.png" 
                  alt="Influenceurs collaborant dans un environnement créatif moderne" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with Gradient for Better Text Visibility (optional) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Floating Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
                  <div className="bg-neutral-900/80 backdrop-blur-md border border-[#f97316]/30 rounded-2xl px-6 py-4 flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#f97316] rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-2xl font-black text-white">1M+</div>
                      <div className="text-xs text-neutral-300">Influenceurs vérifiés</div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-900/80 backdrop-blur-md border border-[#f97316]/30 rounded-2xl px-6 py-4 flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#ea580c] rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-2xl font-black text-white">98%</div>
                      <div className="text-xs text-neutral-300">Taux de satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#f97316]/20 to-[#ea580c]/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#ea580c]/20 to-[#f97316]/20 rounded-full blur-2xl animate-pulse"></div>
          </div>

          {/* Optional Caption/Description */}
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <p className="text-lg text-neutral-300/80 leading-relaxed">
              Rejoignez des milliers de créateurs et marques qui transforment leurs collaborations en{' '}
              <span className="font-semibold text-[#f97316]">succès mesurables</span> grâce à notre plateforme intuitive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export const Features = () => {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden" id='features'>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] animate-pulse"></div>      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 border border-[#f97316]/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#f97316]">Fonctionnalités Premium</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-montserrat mb-6">
            Tout ce dont vous avez besoin pour{' '}
            <span className="bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
              dominer le marketing d'influence
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-neutral-300/80 leading-relaxed">
            Notre plateforme révolutionnaire offre une suite complète d'outils de nouvelle génération 
            pour transformer votre stratégie d'influence en succès retentissant.
          </p>
        </div>

        {/* Premium Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-3xl p-8 border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f97316]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-4 rounded-2xl inline-flex shadow-lg shadow-[#f97316]/25">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7V4H20V7L12 11L4 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 11V20H20V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold text-white font-montserrat mb-3">Base de données exclusive</h3>
              <p className="text-neutral-300/80 leading-relaxed">
                Accédez à notre base de données exclusive de <span className="text-[#f97316] font-semibold">plus d'un million d'influenceurs</span> 
                vérifiés et actifs dans tous les secteurs.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-3xl p-8 border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f97316]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-4 rounded-2xl inline-flex shadow-lg shadow-[#f97316]/25">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold text-white font-montserrat mb-3">Analyses IA avancées</h3>
              <p className="text-neutral-300/80 leading-relaxed">
                Obtenez des insights profonds grâce à notre <span className="text-[#f97316] font-semibold">IA prédictive</span> 
                qui analyse les performances et prédit le succès des campagnes.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-3xl p-8 border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f97316]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-4 rounded-2xl inline-flex shadow-lg shadow-[#f97316]/25">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold text-white font-montserrat mb-3">Filtres intelligents</h3>
              <p className="text-neutral-300/80 leading-relaxed">
                Filtrez avec précision grâce à nos <span className="text-[#f97316] font-semibold">algorithmes avancés</span> 
                qui comprennent vos besoins et trouvent les influenceurs parfaits.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-3xl p-8 border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f97316]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#ea580c]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-4 rounded-2xl inline-flex shadow-lg shadow-[#f97316]/25">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V13C21 10.7909 19.2091 9 17 9H15L14 7H10L9 9H7C4.79086 9 3 10.7909 3 13V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12L14 10M12 12L10 14M12 12L14 14M12 12L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold text-white font-montserrat mb-3">Gestion automatisée</h3>
              <p className="text-neutral-300/80 leading-relaxed">
                Gérez vos campagnes de A à Z avec notre <span className="text-[#f97316] font-semibold">système automatisé</span> 
                qui optimise chaque étape pour maximiser vos résultats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CTA = () => {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-neutral-900 via-black to-neutral-900 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] animate-pulse"></div>      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-bounce opacity-40"></div>
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-[#ea580c] rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-[#f97316] rounded-full animate-ping opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-700/60 rounded-3xl p-12 md:p-16 lg:p-20 text-center border border-neutral-600/30 backdrop-blur-xl shadow-2xl">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 border border-[#f97316]/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#f97316]">Rejoignez les leaders</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto font-montserrat mb-6">
            Prêt à{' '}
            <span className="bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
              révolutionner
            </span>
            {' '}votre marketing d'influence ?
          </h2>
          
          <p className="mt-6 text-lg sm:text-xl text-neutral-300/80 max-w-3xl mx-auto leading-relaxed">
            Rejoignez plus de <span className="font-semibold text-[#f97316]">50,000 marques</span> qui font confiance à notre plateforme 
            pour transformer leurs campagnes d'influence en succès retentissants.
          </p>

          {/* Premium CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href='/dashboard' className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl h-16 px-10 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/25">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ea580c] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Commencer votre essai gratuit
              </span>
            </a>
            
            <a href='#features' className="group inline-flex items-center justify-center rounded-2xl h-16 px-10 border-2 border-[#f97316]/30 text-[#f97316] font-semibold text-lg transition-all duration-300 hover:border-[#f97316] hover:bg-[#f97316]/10 backdrop-blur-sm">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Voir une démo
              </span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Essai gratuit de 14 jours</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-neutral-600"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Aucune carte de crédit requise</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-neutral-600"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-neutral-800" id='footer'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-neutral-400">
        <p>© 2025 InfluenceContact. Tous droits réservés.</p>
      </div>
    </footer>
  );
};


function LandingPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // We remove the '#' character from the start of the hash
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
    <div className="bg-neutral-900 text-neutral-100 font-poppins">
      <Header />
      <main>
        <Hero />
        <VisualShowcase />

        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;