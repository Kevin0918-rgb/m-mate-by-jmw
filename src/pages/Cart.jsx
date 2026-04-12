import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '../lib/cartStore';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="w-16 h-16 text-gold/20 mx-auto mb-6" />
          <h2 className="font-heading text-2xl text-foreground mb-3">Tu carrito está vacío</h2>
          <p className="font-body text-foreground/50 mb-8">Explora nuestra tienda y encuentra algo especial</p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-mystic-900 font-heading text-sm uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Ir a la Tienda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-script text-4xl text-gold gold-text-glow mb-8 text-center">Tu Carrito</h1>
          <div className="w-20 h-px bg-gold/50 mx-auto mb-10" />
        </motion.div>

        <div className="space-y-4 mb-8">
          {cart.map((item, i) => (
            <motion.div
              key={item.product_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gradient-card border border-gold/10 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-mystic-800/50 flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold/20">✦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-foreground text-sm line-clamp-1">{item.product_name}</h3>
                <p className="font-heading text-gold text-sm">${item.price?.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-heading text-foreground text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="font-heading text-gold text-sm w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="text-foreground/30 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="gradient-card border border-gold/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-heading text-foreground text-lg">Total</span>
            <span className="font-heading text-gold text-2xl">${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest text-sm h-12">
              Proceder al Pago
            </Button>
          </Link>
          <Link
            to="/tienda"
            className="block text-center mt-4 font-body text-foreground/50 text-sm hover:text-gold transition-colors"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}