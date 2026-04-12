import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';
import moment from 'moment';

const STATUSES = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];

export default function AdminReiki() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.ReikiBooking.list('-created_date', 200);
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await base44.entities.ReikiBooking.update(id, { status });
    toast({ title: `Reserva actualizada a "${status}"` });
    load();
  }

  const statusColor = (s) => {
    if (s === 'Completada') return 'bg-green-500/20 text-green-400';
    if (s === 'Confirmada') return 'bg-blue-500/20 text-blue-400';
    if (s === 'Cancelada') return 'bg-red-500/20 text-red-400';
    return 'bg-gold/20 text-gold';
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-gold" />
        <h1 className="font-heading text-2xl text-gold">Reservas de Reiki</h1>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : bookings.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay reservas.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="gradient-card border border-gold/10 rounded-xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="font-heading text-foreground">{b.client_name}</p>
                  <p className="font-body text-foreground/40 text-xs">{b.client_email} {b.client_phone && `· ${b.client_phone}`}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-gold text-sm">{b.preferred_date ? moment(b.preferred_date).format('DD MMM YYYY') : 'Sin fecha'}</p>
                  <span className={`inline-block text-xs font-heading px-2 py-0.5 rounded-full mt-1 ${statusColor(b.status)}`}>{b.status}</span>
                </div>
              </div>
              {b.notes && <p className="font-body text-foreground/50 text-sm mb-3 italic">"{b.notes}"</p>}
              <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                <SelectTrigger className="bg-muted/50 border-gold/20 font-body text-foreground w-40"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-gold/20">{STATUSES.map(s => <SelectItem key={s} value={s} className="font-body">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}