import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.Testimonial.list('-created_date', 200);
    setTestimonials(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleApprove(t) {
    await base44.entities.Testimonial.update(t.id, { approved: !t.approved });
    toast({ title: t.approved ? 'Testimonio oculto' : 'Testimonio aprobado' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este testimonio?')) return;
    await base44.entities.Testimonial.delete(id);
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-gold mb-6">Testimonios</h1>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : testimonials.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay testimonios.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="gradient-card border border-gold/10 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-heading text-foreground text-sm">{t.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-gold fill-gold" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApprove(t)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${t.approved ? 'bg-green-500/20 text-green-400' : 'bg-muted text-foreground/30 hover:text-gold'}`}
                    title={t.approved ? 'Ocultar' : 'Aprobar'}
                  >
                    {t.approved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-foreground/30 hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-body text-foreground/60 text-sm italic">"{t.text}"</p>
              <span className={`inline-block mt-2 text-xs font-heading px-2 py-0.5 rounded-full ${t.approved ? 'bg-green-500/20 text-green-400' : 'bg-foreground/10 text-foreground/40'}`}>
                {t.approved ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}