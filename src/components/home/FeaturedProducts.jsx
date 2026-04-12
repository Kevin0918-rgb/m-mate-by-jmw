import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import ProductCard from '../shop/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await base44.entities.Product.filter({ featured: true }, '-created_date', 8);
      if (all.length === 0) {
        const fallback = await base44.entities.Product.list('-created_date', 8);
        setProducts(fallback);
      } else {
        setProducts(all);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-script text-4xl sm:text-5xl text-gold gold-text-glow mb-4">
            Productos Destacados
          </h2>
          <div className="w-20 h-px bg-gold/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/tienda"
            className="inline-block px-8 py-3 border border-gold/50 text-gold font-heading text-sm uppercase tracking-widest rounded-full hover:bg-gold/10 transition-all duration-500"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  );
}