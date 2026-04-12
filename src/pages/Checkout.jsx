import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { getCart, getCartTotal, clearCart } from '../lib/cartStore';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const c = getCart();
    if (c.length === 0) navigate('/tienda');
    setCart(c);
  }, []);

  const total = getCartTotal();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const orderItems = cart.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    await base44.entities.Order.create({
      ...form,
      items: orderItems,
      total,
      status: 'Pendiente',
      payment_method: 'Pendiente',
    });

    clearCart();
    setSubmitting(false);
    toast({ title: '¡Orden recibida!', description: 'Te contactaremos pronto para confirmar el pago y envío.' });
    navigate('/');
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-script text-4xl text-gold gold-text-glow mb-4">Checkout</h1>
          <div className="w-20 h-px bg-gold/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-5"
          >
            <h2 className="font-heading text-gold text-lg uppercase tracking-widest mb-2">Información de Envío</h2>
            <Input placeholder="Nombre completo" value={form.customer_name} onChange={update('customer_name')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input type="email" placeholder="Email" value={form.customer_email} onChange={update('customer_email')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
              <Input placeholder="Teléfono" value={form.customer_phone} onChange={update('customer_phone')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
            </div>
            <Input placeholder="Dirección de envío" value={form.shipping_address} onChange={update('shipping_address')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Ciudad, Puerto Rico" value={form.shipping_city} onChange={update('shipping_city')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
              <Input placeholder="Código Postal" value={form.shipping_zip} onChange={update('shipping_zip')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
            </div>
            <Textarea placeholder="Notas especiales (opcional)" value={form.notes} onChange={update('notes')} rows={3} className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body resize-none" />

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-foreground/40 text-xs font-body">
                <ShieldCheck className="w-4 h-4 text-gold/50" />
                <span>Tu información está segura. Te contactaremos para coordinar el pago.</span>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest h-12"
              >
                {submitting ? 'Procesando...' : <><CreditCard className="w-4 h-4 mr-2" /> Confirmar Orden — ${total.toFixed(2)}</>}
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="gradient-card border border-gold/15 rounded-xl p-5 sticky top-24">
              <h3 className="font-heading text-gold text-sm uppercase tracking-widest mb-4">Resumen</h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-foreground/70 line-clamp-1">{item.product_name}</p>
                      <p className="font-body text-foreground/40 text-xs">x{item.quantity}</p>
                    </div>
                    <span className="font-heading text-foreground/70 ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold/10 pt-4 flex justify-between">
                <span className="font-heading text-foreground">Total</span>
                <span className="font-heading text-gold text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}