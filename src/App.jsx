import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Reiki from './pages/Reiki';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminMessages from './pages/admin/AdminMessages';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminReiki from './pages/admin/AdminReiki';
import AdminClientes from './pages/admin/AdminClientes';
import AdminEnvios from './pages/admin/AdminEnvios';
import AdminConfiguracion from './pages/admin/AdminConfiguracion';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reiki" element={<Reiki />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProducts />} />
        <Route path="/admin/ordenes" element={<AdminOrders />} />
        <Route path="/admin/mensajes" element={<AdminMessages />} />
        <Route path="/admin/testimonios" element={<AdminTestimonials />} />
        <Route path="/admin/reiki" element={<AdminReiki />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/envios" element={<AdminEnvios />} />
        <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App