import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Search, Download } from 'lucide-react';
import moment from 'moment';

const STATUSES = ['Todos', 'Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

const statusColor = (s) => {
  if (s === 'Entregado') return 'bg-green-500/20 text-green-400';
  if (s === 'Enviado') return 'bg-blue-500/20 text-blue-400';
  if (s === 'Cancelado') return 'bg-red-500/20 text-red-400';
  if (s === 'Procesando') return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-gold/20 text-gold';
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.Order.list('-created_date', 500);
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(orderId, status) {
    await base44.entities.Order.update(orderId, { status });
    toast({ title: `Orden actualizada a "${status}"` });
    load();
  }

  function exportCSV() {
    const rows = [['Orden', 'Cliente', 'Email', 'Teléfono', 'Productos', 'Total', 'Estado', 'Fecha']];
    filtered.forEach(o => {
      rows.push([
        o.id?.slice(-6).toUpperCase(),
        o.customer_name,
        o.customer_email,
        o.customer_phone || '',
        o.items?.map(i => `${i.product_name} x${i.quantity}`).join(' | ') || '',
        `$${o.total?.toFixed(2)}`,
        o.status,
        moment(o.created_date).format('DD/MM/YYYY HH:mm'),
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordenes-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'Todos' || o.status === filterStatus;
    const matchSearch = !search ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-heading text-2xl text-gold">Órdenes</h1>
        <Button onClick={exportCSV} variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 font-heading text-xs uppercase tracking-wider">
          <Download className="w-4 h-4 mr-1.5" /> Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground w-52"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full font-heading text-xs uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-gold text-mystic-900' : 'border border-gold/20 text-foreground/60 hover:text-gold'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay órdenes.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order.id}
              className="gradient-card border border-gold/10 rounded-xl p-4 cursor-pointer hover:border-gold/25 transition-all"
              onClick={() => setSelected(order)}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-foreground/30 text-xs">#{order.id?.slice(-6).toUpperCase()}</span>
                    <p className="font-heading text-foreground text-sm">{order.customer_name}</p>
                  </div>
                  <p className="font-body text-foreground/40 text-xs">{order.customer_email} · {moment(order.created_date).format('DD MMM YYYY')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-gold">${order.total?.toFixed(2)}</span>
                  <span className={`text-xs font-heading px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-gold/20 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold">
              Orden #{selected?.id?.slice(-6).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="font-body text-foreground/50 text-xs uppercase tracking-wider">Cliente</p>
                <p className="font-heading text-foreground">{selected.customer_name}</p>
                <p className="font-body text-foreground/60 text-sm">{selected.customer_email}</p>
                {selected.customer_phone && <p className="font-body text-foreground/60 text-sm">{selected.customer_phone}</p>}
              </div>
              {selected.shipping_address && (
                <div>
                  <p className="font-body text-foreground/50 text-xs uppercase tracking-wider">Envío</p>
                  <p className="font-body text-foreground/70 text-sm">{selected.shipping_address}</p>
                  <p className="font-body text-foreground/70 text-sm">{selected.shipping_city} {selected.shipping_zip}</p>
                </div>
              )}
              <div>
                <p className="font-body text-foreground/50 text-xs uppercase tracking-wider mb-2">Productos</p>
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-gold/5">
                    <span className="font-body text-foreground/70">{item.product_name} x{item.quantity}</span>
                    <span className="font-heading text-foreground/70">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="font-heading text-foreground">Total</span>
                  <span className="font-heading text-gold text-lg">${selected.total?.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <p className="font-body text-foreground/50 text-xs uppercase tracking-wider mb-2">Estado</p>
                <Select value={selected.status} onValueChange={v => { updateStatus(selected.id, v); setSelected({ ...selected, status: v }); }}>
                  <SelectTrigger className="bg-muted/50 border-gold/20 font-body text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-gold/20">
                    {['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'].map(s => (
                      <SelectItem key={s} value={s} className="font-body">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selected.notes && (
                <div>
                  <p className="font-body text-foreground/50 text-xs uppercase tracking-wider">Notas</p>
                  <p className="font-body text-foreground/60 text-sm">{selected.notes}</p>
                </div>
              )}
              <p className="font-body text-foreground/30 text-xs">Creada: {moment(selected.created_date).format('DD MMM YYYY HH:mm')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}