import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, MessageCircle, Star, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/ordenes', label: 'Órdenes', icon: ShoppingCart },
  { to: '/admin/reiki', label: 'Reiki', icon: Sparkles },
  { to: '/admin/mensajes', label: 'Mensajes', icon: MessageCircle },
  { to: '/admin/testimonios', label: 'Testimonios', icon: Star },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-20 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gold/10 bg-mystic-900/50 p-4 gap-1 fixed top-20 bottom-0">
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
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
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