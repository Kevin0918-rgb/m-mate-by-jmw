import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import moment from 'moment';

export default function AdminClientes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedClient, setExpandedClient] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await base44.entities.Order.list('-created_date', 500);
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  // Aggregate clients from orders
  const clientsMap = {};
  orders.forEach(order => {
    const key = order.customer_email;
    if (!key) return;
    if (!clientsMap[key]) {
      clientsMap[key] = {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        orders: [],
        total_spent: 0,
      };
    }
    clientsMap[key].orders.push(order);
    clientsMap[key].total_spent += order.total || 0;
  });

  const clients = Object.values(clientsMap).filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-gold" />
        <h1 className="font-heading text-2xl text-gold">Clientes</h1>
        <span className="font-body text-foreground/40 text-sm">({clients.length})</span>
      </div>

      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground"
        />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : clients.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay clientes aún.</p>
      ) : (
        <div className="space-y-3">
          {clients.map(client => (
            <div key={client.email} className="gradient-card border border-gold/10 rounded-xl overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gold/5 transition-all"
                onClick={() => setExpandedClient(expandedClient === client.email ? null : client.email)}
              >
                <div>
                  <p className="font-heading text-foreground">{client.name}</p>
                  <p className="font-body text-foreground/40 text-xs">{client.email} {client.phone && `· ${client.phone}`}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-heading text-gold text-sm">${client.total_spent.toFixed(2)}</p>
                    <p className="font-body text-foreground/40 text-xs">{client.orders.length} orden{client.orders.length !== 1 ? 'es' : ''}</p>
                  </div>
                  {expandedClient === client.email
                    ? <ChevronUp className="w-4 h-4 text-foreground/40" />
                    : <ChevronDown className="w-4 h-4 text-foreground/40" />
                  }
                </div>
              </div>

              {expandedClient === client.email && (
                <div className="border-t border-gold/10 p-4 space-y-2 bg-black/20">
                  <p className="font-body text-foreground/50 text-xs uppercase tracking-wider mb-3">Historial de compras</p>
                  {client.orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-gold/5 last:border-0">
                      <div>
                        <p className="font-body text-foreground/70 text-sm">
                          {order.items?.map(i => `${i.product_name} x${i.quantity}`).join(', ')}
                        </p>
                        <p className="font-body text-foreground/30 text-xs">{moment(order.created_date).format('DD MMM YYYY')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-gold text-sm">${order.total?.toFixed(2)}</p>
                        <span className="font-body text-foreground/40 text-xs">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}