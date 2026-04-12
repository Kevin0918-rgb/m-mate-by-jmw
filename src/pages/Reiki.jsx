import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import GoldenParticles from '../components/GoldenParticles';

export default function Reiki() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    preferred_date: '',
    notes: '',
  });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await base44.entities.ReikiBooking.create(form);
    setForm({ client_name: '', client_email: '', client_phone: '', preferred_date: '', notes: '' });
    setSending(false);
    toast({ title: '¡Reserva recibida!', description: 'Te contactaremos para confirmar tu sesión de Reiki.' });
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden gradient-mystic">
        <GoldenParticles />
        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />
            <h1 className="font-script text-5xl sm:text-6xl text-gold gold-text-glow mb-6">Reiki a Distancia</h1>
            <div className="w-20 h-px bg-gold/50 mx-auto mb-8" />
            <p className="font-body text-foreground/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              El Reiki es una técnica de sanación energética que ayuda a restaurar el equilibrio del cuerpo, la mente y el espíritu.
              Nuestras sesiones a distancia te permiten recibir esta poderosa energía desde la comodidad de tu hogar.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Heart, title: 'Sanación Emocional', desc: 'Libera bloqueos y restaura tu bienestar emocional.' },
              { icon: Sparkles, title: 'Balance Energético', desc: 'Armoniza tus chakras y flujos de energía vital.' },
              { icon: Calendar, title: 'Sesión Personalizada', desc: 'Cada sesión es adaptada a tus necesidades específicas.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="gradient-card border border-gold/10 rounded-2xl p-8 text-center hover:border-gold/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-gold text-lg mb-2">{item.title}</h3>
                <p className="font-body text-foreground/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <h2 className="font-script text-3xl text-gold gold-text-glow mb-6 text-center">Reserva tu Sesión</h2>
            <div className="w-16 h-px bg-gold/50 mx-auto mb-8" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Tu nombre" value={form.client_name} onChange={update('client_name')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input type="email" placeholder="Email" value={form.client_email} onChange={update('client_email')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
                <Input placeholder="Teléfono" value={form.client_phone} onChange={update('client_phone')} className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
              </div>
              <Input type="date" value={form.preferred_date} onChange={update('preferred_date')} required className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body" />
              <Textarea placeholder="¿Cuál es tu intención para esta sesión?" value={form.notes} onChange={update('notes')} rows={4} className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body resize-none" />
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest h-12"
              >
                {sending ? 'Enviando...' : 'Reservar Sesión'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}