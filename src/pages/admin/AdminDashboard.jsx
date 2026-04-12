import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, messages: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const [products, orders, messages] = await Promise.all([
        base44.entities.Product.list('-created_date', 200),
        base44.entities.Order.list('-created_date', 200),
        base44.entities.ContactMessage.filter({ read: false }, '-created_date', 200),
      ]);
      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      setStats({ products: products.length, orders: orders.length, revenue, messages: messages.length });
      setRecentOrders(orders.slice(0, 5));
    }
    load();
  }, []);

  const cards = [
    { label: 'Productos', value: stats.products, icon: Package, color: 'text-gold' },
    { label: 'Órdenes', value: stats.orders, icon: ShoppingCart, color: 'text-mystic-500' },
    { label: 'Ingresos', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Mensajes', value: stats.messages, icon: MessageCircle, color: 'text-blue-400' },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-gold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="gradient-card border border-gold/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="font-heading text-2xl text-foreground">{card.value}</p>
            <p className="font-body text-foreground/50 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="gradient-card border border-gold/10 rounded-xl p-5">
        <h2 className="font-heading text-gold text-sm uppercase tracking-widest mb-4">Órdenes Recientes</h2>
        {recentOrders.length === 0 ? (
          <p className="font-body text-foreground/40 text-sm">No hay órdenes aún.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                <div>
                  <p className="font-heading text-foreground text-sm">{order.customer_name}</p>
                  <p className="font-body text-foreground/40 text-xs">{order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-gold text-sm">${order.total?.toFixed(2)}</p>
                  <span className={`text-xs font-heading px-2 py-0.5 rounded-full ${
                    order.status === 'Entregado' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'Enviado' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                    'bg-gold/20 text-gold'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}