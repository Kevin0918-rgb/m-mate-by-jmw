import { ShoppingCart, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addToCart } from '../../lib/cartStore';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { toast } = useToast();

  function handleAdd() {
    addToCart(product);
    toast({ title: '¡Agregado!', description: `${product.name} se añadió al carrito.` });
  }

  return (
    <div className="group gradient-card border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)]">
      <div className="aspect-square overflow-hidden bg-mystic-800/50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gold/20 font-script text-3xl">✦</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-gold/60 font-heading mb-1">{product.category}</p>
        <h3 className="font-heading text-foreground text-base mb-1 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="font-body text-foreground/50 text-sm line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-heading text-gold text-lg">
            {product.price_label || `$${product.price?.toFixed(2)}`}
          </span>
          {product.category_group === 'Servicio' ? (
            <Link
              to="/contacto"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-mystic-900 transition-all duration-300 font-heading text-xs uppercase tracking-wider"
            >
              <Calendar className="w-3.5 h-3.5" />
              {product.name === 'Talleres Individuales' ? 'Reservar Taller' : 'Reservar'}
            </Link>
          ) : product.in_stock !== false ? (
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-mystic-900 text-gold transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-foreground/40 font-heading uppercase">Agotado</span>
          )}
        </div>
      </div>
    </div>
  );
}