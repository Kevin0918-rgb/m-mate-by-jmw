import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { getCartCount } from '../lib/cartStore';
import { useAuth } from '@/lib/AuthContext';

const LOGO_URL = "https://media.base44.com/images/public/user_68ef14c3265740cfbb073d99/48ddf0ec3_664978453_1742222426943109_7539000457263450418_n-removebg-preview.png";

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/reiki', label: 'Reiki' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    const updateCart = () => setCartCount(getCartCount());
    updateCart();
    window.addEventListener('cart-updated', updateCart);
    return () => window.removeEventListener('cart-updated', updateCart);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isAdmin = user?.role === 'admin';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-mystic-900/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Mímate by JMW" className="h-12 sm:h-14 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-heading text-sm tracking-wider uppercase transition-colors duration-300 hover:text-gold ${location.pathname === link.to ? 'text-gold' : 'text-foreground/80'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`font-heading text-sm tracking-wider uppercase transition-colors duration-300 hover:text-gold ${location.pathname.startsWith('/admin') ? 'text-gold' : 'text-foreground/80'}`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/carrito" className="relative group">
              <ShoppingCart className="w-5 h-5 text-foreground/80 group-hover:text-gold transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-mystic-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground/80 hover:text-gold transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-mystic-900/98 backdrop-blur-xl border-t border-border/30">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block font-heading text-sm tracking-wider uppercase py-2 transition-colors ${location.pathname === link.to ? 'text-gold' : 'text-foreground/70'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="block font-heading text-sm tracking-wider uppercase py-2 text-foreground/70">
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}