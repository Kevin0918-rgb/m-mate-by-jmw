import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, MessageCircle, Star, Sparkles, LayoutDashboard, Users, Truck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/ordenes', label: 'Órdenes', icon: ShoppingCart },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/reiki', label: 'Reservaciones', icon: Sparkles },
  { to: '/admin/mensajes', label: 'Mensajes', icon: MessageCircle },
  { to: '/admin/testimonios', label: 'Testimonios', icon: Star },
  { to: '/admin/envios', label: 'Envíos', icon: Truck },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayout() {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <div className="fixed inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-20 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gold/10 bg-mystic-900/50 p-4 gap-1 fixed top-20 bottom-0 overflow-y-auto">
        {navItems.map(item => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading transition-all ${
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-foreground/60 hover:text-gold hover:bg-gold/5'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-auto pt-4 border-t border-gold/10">
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading text-foreground/40 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-mystic-900/95 backdrop-blur-md border-b border-gold/10 overflow-x-auto">
        <div className="flex gap-1 p-2">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading whitespace-nowrap transition-all ${
                  active ? 'bg-gold/15 text-gold' : 'text-foreground/60'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 p-4 sm:p-6 mt-12 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
}