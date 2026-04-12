import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const STATUSES = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.Order.list('-created_date', 200);
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(orderId, status) {
    await base44.entities.Order.update(orderId, { status });
    toast({ title: `Orden actualizada a "${status}"` });
    load();
  }

  const statusColor = (s) => {
    if (s === 'Entregado') return 'bg-green-500/20 text-green-400';
    if (s === 'Enviado') return 'bg-blue-500/20 text-blue-400';
    if (s === 'Cancelado') return 'bg-red-500/20 text-red-400';
    if (s === 'Procesando') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gold/20 text-gold';
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-gold mb-6">Órdenes</h1>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : orders.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay órdenes.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="gradient-card border border-gold/10 rounded-xl p-4 cursor-pointer hover:border-gold/25 transition-all"
              onClick={() => setSelected(order)}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-heading text-foreground text-sm">{order.customer_name}</p>
                  <p className="font-body text-foreground/40 text-xs">{order.customer_email}</p>
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
            <DialogTitle className="font-heading text-gold">Detalle de Orden</DialogTitle>
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
                  <SelectContent className="bg-card border-gold/20">{STATUSES.map(s => <SelectItem key={s} value={s} className="font-body">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {selected.notes && (
                <div>
                  <p className="font-body text-foreground/50 text-xs uppercase tracking-wider">Notas</p>
                  <p className="font-body text-foreground/60 text-sm">{selected.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}