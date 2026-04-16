import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Instagram, MessageCircle, Mail, Facebook } from 'lucide-react';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
  </svg>
);
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await base44.entities.ContactMessage.create(form);
    setForm({ name: '', email: '', message: '' });
    setSending(false);
    toast({ title: '¡Mensaje enviado!', description: 'Te responderemos pronto.' });
  }

  return (
    <section id="contacto" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-script text-4xl sm:text-5xl text-gold gold-text-glow mb-4">Contacto</h2>
          <div className="w-20 h-px bg-gold/50 mx-auto mb-6" />
          <p className="font-body text-foreground/60">¿Preguntas? ¡Nos encantaría escucharte!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              placeholder="Tu nombre"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body"
            />
            <Input
              type="email"
              placeholder="Tu email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body"
            />
            <Textarea
              placeholder="Tu mensaje..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body resize-none"
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest"
            >
              {sending ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" /> Enviar Mensaje</>}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-6"
          >
            <a href="https://instagram.com/mimatebyjmw" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <Instagram className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-heading text-foreground text-sm">Instagram</p>
                <p className="font-body text-foreground/50 text-sm">@mimatebyjmw</p>
              </div>
            </a>
            <a href="https://wa.me/17875982136" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <MessageCircle className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-heading text-foreground text-sm">WhatsApp</p>
                <p className="font-body text-foreground/50 text-sm">Escríbenos directamente</p>
              </div>
            </a>
            <a href="mailto:info@mimatebyjmw.com" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-heading text-foreground text-sm">Email</p>
                <p className="font-body text-foreground/50 text-sm">info@mimatebyjmw.com</p>
              </div>
            </a>
            <a href="https://www.tiktok.com/@mimatebyjmw" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <TikTokIcon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-heading text-foreground text-sm">TikTok</p>
                <p className="font-body text-foreground/50 text-sm">@mimatebyjmw</p>
              </div>
            </a>
            <a href="https://www.facebook.com/share/14Xus6Ygxub/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <Facebook className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-heading text-foreground text-sm">Facebook</p>
                <p className="font-body text-foreground/50 text-sm">Mímate by JMW</p>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}