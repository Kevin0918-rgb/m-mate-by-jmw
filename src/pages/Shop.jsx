import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import ProductCard from '../components/shop/ProductCard';

const CATEGORY_GROUPS = [
  { key: 'all', label: 'Todos', icon: '✦' },
  { key: 'Velas & Aromas', label: 'Velas & Aromas', icon: '🕯️' },
  { key: 'Cuidado Personal', label: 'Cuidado Personal', icon: '🧴' },
  { key: 'Bienestar & Terapia', label: 'Bienestar & Terapia', icon: '🪴' },
  { key: 'Mascotas', label: 'Mascotas', icon: '🐾' },
];

const SUBCATEGORIES = {
  'Velas & Aromas': ['Velas de soja artesanales', 'Velas aromáticas', 'Velas ritualizadas', 'Vela soya masaje', 'Wax Melts', 'Difusores', 'Aroma Beads', 'Room Spray'],
  'Cuidado Personal': ['Jabones terapéuticos', 'Jabones ritualizados', 'Jabón de glicerina', 'Scrub corporal', 'Productos faciales', 'Productos labiales', 'Productos para el cabello'],
  'Bienestar & Terapia': ['Productos terapéuticos', 'Concreterapia', 'Reiki a distancia'],
  'Mascotas': ['Productos para mascotas'],
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) setActiveGroup(cat);
  }, []);

  useEffect(() => {
    setActiveCategory('all');
  }, [activeGroup]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let data;
      if (activeGroup === 'all') {
        data = await base44.entities.Product.list('-created_date', 100);
      } else {
        data = await base44.entities.Product.filter({ category_group: activeGroup }, '-created_date', 100);
      }
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [activeGroup]);

  const filtered = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-script text-5xl sm:text-6xl text-gold gold-text-glow mb-4">Tienda</h1>
          <div className="w-20 h-px bg-gold/50 mx-auto mb-6" />
          <p className="font-body text-foreground/60 max-w-md mx-auto">
            Descubre nuestra colección de productos artesanales naturales
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-muted/50 border-gold/20 focus:border-gold text-foreground placeholder:text-foreground/30 font-body"
          />
        </div>

        {/* Group filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {CATEGORY_GROUPS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveGroup(cat.key)}
              className={`px-5 py-2 rounded-full font-heading text-xs uppercase tracking-widest transition-all duration-300 ${
                activeGroup === cat.key
                  ? 'bg-gold text-mystic-900'
                  : 'border border-gold/20 text-foreground/60 hover:border-gold/50 hover:text-gold'
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subcategory filters */}
        {activeGroup !== 'all' && SUBCATEGORIES[activeGroup] && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full font-body text-xs transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'border border-gold/10 text-foreground/40 hover:border-gold/30 hover:text-foreground/70'
              }`}
            >
              Todos
            </button>
            {SUBCATEGORIES[activeGroup].map(sub => (
              <button
                key={sub}
                onClick={() => setActiveCategory(sub)}
                className={`px-4 py-1.5 rounded-full font-body text-xs transition-all duration-300 ${
                  activeCategory === sub
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'border border-gold/10 text-foreground/40 hover:border-gold/30 hover:text-foreground/70'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-script text-3xl text-gold/40 mb-3">✦</p>
            <p className="font-body text-foreground/50">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}