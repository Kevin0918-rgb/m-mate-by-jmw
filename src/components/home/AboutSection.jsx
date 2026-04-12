import { motion } from 'framer-motion';
import { Sparkles, Heart, Leaf } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'Artesanal', desc: 'Cada producto es elaborado a mano con dedicación y cuidado.' },
  { icon: Heart, title: 'Con Intención', desc: 'Creados con amor y energía positiva para tu bienestar.' },
  { icon: Leaf, title: 'Natural', desc: 'Ingredientes naturales que nutren tu cuerpo y espíritu.' },
];

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-script text-4xl sm:text-5xl text-gold gold-text-glow mb-6">
            Nosotros
          </h2>
          <div className="w-20 h-px bg-gold/50 mx-auto mb-8" />
          <p className="font-body text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            En Mímate by JMW creamos productos artesanales naturales con amor, intención y energía.
            Cada producto es elaborado a mano en Puerto Rico, pensado para nutrir tu cuerpo, mente y espíritu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="gradient-card border border-gold/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                <feat.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-lg text-gold mb-3">{feat.title}</h3>
              <p className="font-body text-foreground/60 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}