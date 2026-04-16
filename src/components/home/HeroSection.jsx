import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GoldenParticles from '../GoldenParticles';

const LOGO_URL = "https://media.base44.com/images/public/user_68ef14c3265740cfbb073d99/48ddf0ec3_664978453_1742222426943109_7539000457263450418_n-removebg-preview.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Banner background image */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: '#2d0040' }}>
        <img
          src="https://media.base44.com/images/public/69db1a3a97e4e8f9ae073a7f/02c6ee91d_Luxuriouswellnessandbeautyshowcase.png"
          alt="Mímate by JMW"
          className="w-full h-full object-cover object-center-top md:object-cover md:object-center"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Mystic background symbols */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ctext x='30' y='35' text-anchor='middle' fill='%23c9a84c' font-size='20'%3E✦%3C/text%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
      }} />

      <div className="relative z-20 text-center px-4 pt-16 sm:pt-40 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-script text-5xl sm:text-6xl md:text-7xl text-gold mb-4"
          style={{ textShadow: '0 0 20px rgba(200,192,176,0.6), 2px 2px 6px rgba(0,0,0,1), -1px -1px 0 rgba(0,0,0,1)' }}
        >
          Mímate by JMW
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold italic mb-10 max-w-xl mx-auto px-4 py-2 rounded-lg"
          style={{ color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)', background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
        >
          Tu ritual de bienestar comienza aquí
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/tienda"
            className="px-8 py-3 bg-gold text-mystic-900 font-heading text-sm uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all duration-500 hover:scale-105"
          >
            Ver Tienda
          </Link>
          <a
            href="#nosotros"
            className="px-8 py-3 border border-gold/50 text-gold font-heading text-sm uppercase tracking-widest rounded-full hover:bg-gold/10 transition-all duration-500"
          >
            Conoce Más
          </a>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}