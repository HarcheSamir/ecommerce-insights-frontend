import React, { useState, useEffect, type FC } from 'react';

// --- SVG Icon Components (Improved for reusability and reliability) ---

const LogoIcon: FC = () => (
  <svg className="h-8 w-8 text-[#f47b25]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
  </svg>
);

// CORRECTED: Using the 'style' attribute for dynamic colors is more robust than constructing class names.
export const CheckIcon: FC<{ color: string }> = ({ color }) => (
  <svg className="h-6 w-6 flex-shrink-0" style={{ color: color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
);

const ChevronDownIcon: FC = () => (
  <svg className="h-6 w-6 text-[#f47b25] transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
);

const MenuToggleIcon: FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
    )}
  </svg>
);


// --- Page Section Components ---

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect to lock body scroll when mobile menu is open for better UX
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on component unmount
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#000000]/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 py-4">
          <a href="/home" className="flex items-center gap-3" aria-label="InfluencerBase Home">
            <LogoIcon />
            <h2 className="text-xl font-bold tracking-tight text-white">InfluencerBase</h2>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a className="text-base font-medium text-[#a3a3a3] transition-colors hover:text-[#f47b25]" href="/home">Accueil</a>
            <a className="text-base font-medium text-[#a3a3a3] transition-colors hover:text-[#f47b25]" href="/home#features">Fonctionnalités</a>
            <a className="text-base font-semibold text-[#f47b25]" href="#">Tarifs</a>
            <a className="text-base font-medium text-[#a3a3a3] transition-colors hover:text-[#f47b25]" href="/home#footer">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a className="hidden text-base font-medium text-[#a3a3a3] transition-colors hover:text-[#f47b25] sm:block" href="#">Connexion</a>
            <a href="#" className="hidden sm:flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#f47b25] text-black text-base font-bold transition-transform hover:scale-105">
              <span className="truncate">Commencer</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <MenuToggleIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl">
          <a onClick={() => setIsMenuOpen(false)} href="/home" className="font-medium text-[#a3a3a3] hover:text-[#f47b25]">Accueil</a>
          <a onClick={() => setIsMenuOpen(false)} href="/home#features" className="font-medium text-[#a3a3a3] hover:text-[#f47b25]">Fonctionnalités</a>
          <a onClick={() => setIsMenuOpen(false)} href="#" className="font-semibold text-[#f47b25]">Tarifs</a>
          <a onClick={() => setIsMenuOpen(false)} href="/home#footer" className="font-medium text-[#a3a3a3] hover:text-[#f47b25]">Contact</a>
          <div className="mt-8 flex flex-col items-center gap-6">
            <a onClick={() => setIsMenuOpen(false)} className="sm:hidden text-base font-medium text-[#a3a3a3] transition-colors hover:text-[#f47b25]" href="/dashboard">Connexion</a>
            <button className="sm:hidden flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#f47b25] text-black text-base font-bold">
                Commencer
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

const PricingSection: FC = () => {
  const features = [
    "Accès à tous les influenceurs",
    "Recherches illimitées",
    "Analyses avancées",
    "Outils de gestion de campagne",
    "Support par e-mail prioritaire",
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center">
      {/* Hero Text */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">Plan de Paiement Unique</h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#a3a3a3]">
          Débloquez un accès complet à toute notre base de données d'influenceurs avec un paiement unique et simple. Pas de frais récurrents, pas de coûts cachés.
        </p>
      </div>
      
      {/* Pricing Card */}
      <div className="mt-12 flex w-full max-w-md flex-col gap-6 rounded-lg border-2 border-[#f47b25] bg-[#1a1a1a] p-6 sm:p-8">
        <div className="flex-grow">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">Accès à Vie</h3>
            <p className="mt-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl sm:text-6xl font-bold tracking-tight text-white">€49.90</span>
            </p>
            <p className="text-base sm:text-lg text-[#a3a3a3]">Paiement unique</p>
          </div>
          <ul className="mt-8 space-y-4 text-left">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon color='#f47b25' />
                <span className="text-white">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <a href='/dashboard' className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#f47b25] text-black text-base font-bold transition-transform hover:scale-105 w-full mt-4 sm:mt-8">
          Obtenir l'Accès Maintenant
        </a>
      </div>
    </section>
  );
};

const FaqItem: FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="group rounded-lg border border-[#333333] bg-[#1a1a1a] p-5 sm:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between text-base sm:text-lg font-semibold text-white">
            {question}
            <ChevronDownIcon />
        </summary>
        <p className="mt-4 text-sm sm:text-base text-[#a3a3a3]">{children}</p>
    </details>
);

const FaqSection: FC = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">Questions Fréquemment Posées</h2>
      <div className="mx-auto mt-10 sm:mt-12 max-w-3xl space-y-4">
        <FaqItem question="Est-ce vraiment un paiement unique ?">
          Oui, absolument. Vous payez une seule fois et obtenez un accès à vie à toutes les fonctionnalités incluses dans ce plan. Il n'y a pas de frais d'abonnement mensuels ou annuels.
        </FaqItem>
        <FaqItem question="Quels moyens de paiement acceptez-vous ?">
          Nous acceptons toutes les principales cartes de crédit (Visa, Mastercard, American Express) et PayPal pour votre commodité. Toutes les transactions sont traitées de manière sécurisée.
        </FaqItem>
        <FaqItem question="Que se passe-t-il après mon achat ?">
          Vous recevrez un e-mail avec vos identifiants de connexion immédiatement après la confirmation de votre paiement. Vous pourrez alors vous connecter et commencer à utiliser la plateforme sans attendre.
        </FaqItem>
        <FaqItem question="Recevrai-je les futures mises à jour ?">
          Oui, votre paiement unique inclut toutes les futures mises à jour de la plateforme et les fonctionnalités comprises dans ce plan. Nous travaillons constamment à l'amélioration de notre service.
        </FaqItem>
      </div>
    </section>
  );
};

const CtaSection: FC = () => {
  return (
    <section className="bg-[#111111]">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Vous avez d'autres questions ?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#a3a3a3]">
          Notre équipe est là pour vous aider. Contactez-nous pour toute demande supplémentaire concernant notre plan de paiement unique.
        </p>
        <div className="mt-8 flex justify-center">
          <a href='/home#footer' className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#f47b25] text-black text-base font-bold transition-transform hover:scale-105">
            Nous Contacter
          </a>
        </div>
      </div>
    </section>
  );
};


// --- Main Page Component ---

function PricingPage() {
  return (
    <div className="bg-[#000000] text-white font-['Inter',_sans-serif]">
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <PricingSection />
          <FaqSection />
          <CtaSection />
        </main>
      </div>
    </div>
  );
}

export default PricingPage;