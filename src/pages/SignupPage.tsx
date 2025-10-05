import { useState, type FormEvent, type JSX } from 'react';
import { useSignup } from '../hooks/useAuthMutations';
import type { AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// SVG Icon for brand consistency
const LogoIcon = () => (
    <svg className="h-10 w-10 text-[#f97316]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
    </svg>
);

const SignupPage = (): JSX.Element => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { mutate: signupUser, isPending, error } = useSignup();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupUser(
      { firstName, lastName, email, password },
      {
        onSuccess: () => {
          toast.success('Compte créé avec succès ! Redirection vers la connexion...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        },
        onError: (err: AxiosError) => {
          toast.error(  "Échec de l'inscription. Veuillez réessayer.");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#000000] px-6 py-12 lg:px-8 font-['Inter',_sans-serif]">
     <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <a href="/home">

          <LogoIcon />

          </a>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Créez votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1a1a] border border-[#374151] rounded-xl p-8 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-[#9ca3af]">
                  Prénom
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="block w-full rounded-lg border-0 bg-[#2a2a2a] py-2.5 px-4 text-white shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-[#9ca3af]">
                  Nom de famille
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="block w-full rounded-lg border-0 bg-[#2a2a2a] py-2.5 px-4 text-white shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-[#9ca3af]">
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
                  className="block w-full rounded-lg border-0 bg-[#2a2a2a] py-2.5 px-4 text-white shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#9ca3af]">
                Mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-lg border-0 bg-[#2a2a2a] py-2.5 px-4 text-white shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {"Échec de l'inscription. Veuillez réessayer."}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-md bg-[#f97316] px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Création du compte...' : 'Créer un compte'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-[#9ca3af]">
          Vous avez déjà un compte ?{' '}
          <a href="/login" className="font-semibold leading-6 text-[#f97316] hover:text-orange-400">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;