import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Testimonial.filter({ approved: true }, '-created_date', 6);
      setTestimonials(data);
    }
    load();
  }, []);

  if (testimonials.length === 0) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-script text-4xl sm:text-5xl text-gold gold-text-glow mb-4">Testimonios</h2>
          <div className="w-20 h-px bg-gold/50 mx-auto mb-8" />
          <p className="font-body text-foreground/50 italic">Próximamente testimonios de nuestros clientes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-script text-4xl sm:text-5xl text-gold gold-text-glow mb-4">Testimonios</h2>
          <div className="w-20 h-px bg-gold/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="gradient-card border border-gold/10 rounded-2xl p-6 hover:border-gold/25 transition-all duration-500"
            >
              <Quote className="w-6 h-6 text-gold/30 mb-3" />
              <p className="font-body text-foreground/70 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-gold fill-gold" />
                ))}
              </div>
              <p className="font-heading text-gold text-sm">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}