import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// We will create the AuthProvider in the next step
import { AuthProvider } from './context/AuthContext'; 

// Components we will create
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/ProfilePage';
 import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/Landing';
import PricingPage from './pages/Pricing';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<LandingPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pricing" element={<PricingPage /> } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            {/* <Route path="/search" element={<PrivateRoute><DatabasePage /></PrivateRoute>} /> */}


            {/* Add a default route */}
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;