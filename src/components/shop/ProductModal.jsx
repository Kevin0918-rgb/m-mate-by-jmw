import { X, ShoppingCart, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addToCart } from '../../lib/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function formatPriceLabel(label) {
  if (!label) return null;
  const parts = label.split('/').map(s => s.trim());
  if (parts.length === 2) {
    const sizeMatch = parts[0].match(/^([\d.]+\s*oz)/i);
    const priceMatch = parts[1].match(/\$[\d.]+/);
    if (sizeMatch && priceMatch) {
      return `${sizeMatch[1]} — ${priceMatch[0]}`;
    }
  }
  return label;
}

export default function ProductModal({ product, onClose }) {
  const { toast } = useToast();

  if (!product) return null;

  function handleAdd() {
    addToCart(product);
    toast({ title: '¡Agregado!', description: `${product.name} se añadió al carrito.` });
    onClose();
  }

  const isService = product.category_group === 'Servicio';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-lg gradient-card border border-gold/20 rounded-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-foreground/70 hover:text-gold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-mystic-800/50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gold/20 font-script text-5xl">✦</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[11px] uppercase tracking-widest text-gold/60 font-heading mb-1">{product.category}</p>
            <h2 className="font-heading text-foreground text-xl mb-2">{product.name}</h2>

            {product.description && (
              <p className="font-body text-foreground/60 text-sm leading-relaxed mb-4">{product.description}</p>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="font-heading text-gold text-2xl">
                {formatPriceLabel(product.price_label) || `$${product.price?.toFixed(2)}`}
              </span>

              {isService ? (
                <Link
                  to="/contacto"
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-mystic-900 transition-all duration-300 font-heading text-xs uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4" />
                  Reservar
                </Link>
              ) : product.in_stock !== false ? (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gold text-mystic-900 hover:bg-gold/90 transition-all duration-300 font-heading text-xs uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al carrito
                </button>
              ) : (
                <span className="text-sm text-foreground/40 font-heading uppercase">Agotado</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}