import { useState, type FormEvent, type JSX } from 'react';
// Assuming useLogin is in this path, adjust if necessary
import { useLogin } from '../hooks/useAuthMutations';

// SVG Icon for brand consistency
const LogoIcon = () => (
    <svg className="h-10 w-10 text-[#f97316]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
    </svg>
);

const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { mutate: loginUser, isPending, error } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-6 py-12 lg:px-8 font-['Inter',_sans-serif] overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f97316%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#f97316] rounded-full animate-bounce opacity-40"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse opacity-30"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <a href="/home" className="block">
              <LogoIcon />
            </a>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 border border-[#f97316]/20 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#f97316]">Plateforme Premium</span>
          </div>
          
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
            Bienvenue sur{' '}
            <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent">
              InfluenceContact
            </span>
          </h2>
          <p className="mt-2 text-neutral-400">Connectez-vous pour accéder à votre tableau de bord</p>
        </div>

        <div className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-700/60 border border-neutral-600/30 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-[#9ca3af]"
              >
                Adresse e-mail
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-xl border-0 bg-gradient-to-r from-neutral-700/50 to-neutral-600/30 py-3.5 px-4 text-white shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] focus:bg-gradient-to-r focus:from-neutral-600/50 focus:to-neutral-500/30 transition-all duration-300 sm:text-sm sm:leading-6 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-[#9ca3af]"
              >
                Mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border-0 bg-gradient-to-r from-neutral-700/50 to-neutral-600/30 py-3.5 px-4 text-white shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] focus:bg-gradient-to-r focus:from-neutral-600/50 focus:to-neutral-500/30 transition-all duration-300 sm:text-sm sm:leading-6 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Display API Error Message safely */}
            {error && (
              <p className="text-sm text-red-500">
                {error instanceof Error ? error.message : "Identifiants invalides. Veuillez réessayer."}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-6 py-4 text-base font-bold leading-6 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ea580c] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isPending ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                      Se connecter
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-[#9ca3af]">
          Pas encore membre ?{' '}
          <a href="/signup" className="font-semibold leading-6 text-[#f97316] hover:text-orange-400">
            Inscrivez-vous maintenant
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;