import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Heart } from 'lucide-react';

const LOGO_URL = "https://media.base44.com/images/public/user_68ef14c3265740cfbb073d99/48ddf0ec3_664978453_1742222426943109_7539000457263450418_n-removebg-preview.png";

const categories = [
  { label: 'Velas & Aromas', to: '/tienda?cat=Velas+%26+Aromas' },
  { label: 'Cuidado Personal', to: '/tienda?cat=Cuidado+Personal' },
  { label: 'Bienestar & Terapia', to: '/tienda?cat=Bienestar+%26+Terapia' },
  { label: 'Mascotas', to: '/tienda?cat=Mascotas' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/20">
      <div className="gradient-mystic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center md:items-start">
              <img src={LOGO_URL} alt="Mímate by JMW" className="h-20 w-auto mb-4" />
              <p className="font-body text-foreground/60 text-center md:text-left text-sm leading-relaxed">
                Productos artesanales naturales elaborados con amor, intención y energía en Puerto Rico.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-heading text-gold text-sm uppercase tracking-widest mb-4">Categorías</h4>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.label}>
                    <Link to={cat.to} className="font-body text-foreground/60 hover:text-gold transition-colors text-sm">
                      {cat.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/reiki" className="font-body text-foreground/60 hover:text-gold transition-colors text-sm">
                    Reiki a Distancia
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-heading text-gold text-sm uppercase tracking-widest mb-4">Conecta</h4>
              <div className="flex justify-center md:justify-start gap-4 mb-4">
                <a href="https://instagram.com/mimatebyjmw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors">
                  <Instagram className="w-4 h-4 text-gold" />
                </a>
                <a href="https://wa.me/17875551234" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors">
                  <MessageCircle className="w-4 h-4 text-gold" />
                </a>
                <a href="mailto:info@mimatebyjmw.com" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors">
                  <Mail className="w-4 h-4 text-gold" />
                </a>
              </div>
              <Link to="/contacto" className="font-body text-foreground/60 hover:text-gold transition-colors text-sm">
                Contáctanos
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gold/10 text-center">
            <p className="font-body text-foreground/40 text-sm flex items-center justify-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-mystic-500 fill-mystic-500" /> en Puerto Rico 🇵🇷
            </p>
            <p className="font-body text-foreground/30 text-xs mt-2">
              © {new Date().getFullYear()} Mímate by JMW. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}