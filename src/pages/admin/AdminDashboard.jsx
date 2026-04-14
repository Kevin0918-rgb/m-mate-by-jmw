import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, MessageCircle, AlertTriangle, Clock, CheckCircle, Truck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, messages: 0, pending: 0, processing: 0, delivered: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [period, setPeriod] = useState('week');
  const [periodRevenue, setPeriodRevenue] = useState(0);
  const [periodOrders, setPeriodOrders] = useState(0);

  useEffect(() => {
    async function load() {
      const [products, orders, messages] = await Promise.all([
        base44.entities.Product.list('-created_date', 200),
        base44.entities.Order.list('-created_date', 500),
        base44.entities.ContactMessage.filter({ read: false }, '-created_date', 200),
      ]);

      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pending = orders.filter(o => o.status === 'Pendiente').length;
      const processing = orders.filter(o => o.status === 'Procesando').length;
      const delivered = orders.filter(o => o.status === 'Entregado').length;

      setStats({ products: products.length, orders: orders.length, revenue, messages: messages.length, pending, processing, delivered });
      setRecentOrders(orders.slice(0, 5));

      const low = products.filter(p => p.in_stock !== false && (p.stock_quantity || 0) > 0 && (p.stock_quantity || 0) <= 5);
      setLowStock(low);

      filterByPeriod(orders, period);
    }
    load();
  }, []);

  function filterByPeriod(orders, p) {
    const now = moment();
    let start;
    if (p === 'day') start = moment().startOf('day');
    else if (p === 'week') start = moment().subtract(7, 'days');
    else start = moment().subtract(30, 'days');

    const filtered = orders.filter(o => moment(o.created_date).isAfter(start));
    setPeriodRevenue(filtered.reduce((sum, o) => sum + (o.total || 0), 0));
    setPeriodOrders(filtered.length);
  }

  const handlePeriod = async (p) => {
    setPeriod(p);
    const orders = await base44.entities.Order.list('-created_date', 500);
    filterByPeriod(orders, p);
  };

  const statusColor = (s) => {
    if (s === 'Entregado') return 'bg-green-500/20 text-green-400';
    if (s === 'Enviado') return 'bg-blue-500/20 text-blue-400';
    if (s === 'Cancelado') return 'bg-red-500/20 text-red-400';
    if (s === 'Procesando') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gold/20 text-gold';
  };

  return (
    <div>
      <h1 className="font-heading text-2xl text-gold mb-6">Panel de Administración</h1>

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {[{ key: 'day', label: 'Hoy' }, { key: 'week', label: 'Esta semana' }, { key: 'month', label: 'Este mes' }].map(p => (
          <button
            key={p.key}
            onClick={() => handlePeriod(p.key)}
            className={`px-4 py-1.5 rounded-full font-heading text-xs uppercase tracking-wider transition-all ${period === p.key ? 'bg-gold text-mystic-900' : 'border border-gold/20 text-foreground/60 hover:text-gold'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <DollarSign className="w-5 h-5 text-green-400 mb-3" />
          <p className="font-heading text-2xl text-foreground">${periodRevenue.toFixed(2)}</p>
          <p className="font-body text-foreground/50 text-sm">Ingresos</p>
        </div>
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <ShoppingCart className="w-5 h-5 text-gold mb-3" />
          <p className="font-heading text-2xl text-foreground">{periodOrders}</p>
          <p className="font-body text-foreground/50 text-sm">Órdenes</p>
        </div>
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <Package className="w-5 h-5 text-blue-400 mb-3" />
          <p className="font-heading text-2xl text-foreground">{stats.products}</p>
          <p className="font-body text-foreground/50 text-sm">Productos</p>
        </div>
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <MessageCircle className="w-5 h-5 text-purple-400 mb-3" />
          <p className="font-heading text-2xl text-foreground">{stats.messages}</p>
          <p className="font-body text-foreground/50 text-sm">Mensajes sin leer</p>
        </div>
      </div>

      {/* Order status summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="gradient-card border border-gold/10 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-gold" />
          <div>
            <p className="font-heading text-foreground text-lg">{stats.pending}</p>
            <p className="font-body text-foreground/40 text-xs">Pendientes</p>
          </div>
        </div>
        <div className="gradient-card border border-gold/10 rounded-xl p-4 flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-heading text-foreground text-lg">{stats.processing}</p>
            <p className="font-body text-foreground/40 text-xs">Procesando</p>
          </div>
        </div>
        <div className="gradient-card border border-gold/10 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="font-heading text-foreground text-lg">{stats.delivered}</p>
            <p className="font-body text-foreground/40 text-xs">Entregados</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-gold text-sm uppercase tracking-widest">Órdenes Recientes</h2>
            <Link to="/admin/ordenes" className="font-body text-foreground/40 text-xs hover:text-gold transition-colors">Ver todas →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-body text-foreground/40 text-sm">No hay órdenes aún.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                  <div>
                    <p className="font-heading text-foreground text-sm">{order.customer_name}</p>
                    <p className="font-body text-foreground/40 text-xs">{moment(order.created_date).format('DD MMM')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-gold text-sm">${order.total?.toFixed(2)}</p>
                    <span className={`text-xs font-heading px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alert */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h2 className="font-heading text-yellow-400 text-sm uppercase tracking-widest">Inventario Bajo</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="font-body text-foreground/40 text-sm">Todos los productos tienen inventario suficiente.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-gold/5 last:border-0">
                  <p className="font-body text-foreground/70 text-sm">{p.name}</p>
                  <span className="font-heading text-yellow-400 text-sm">{p.stock_quantity} restantes</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/productos" className="block mt-4 font-body text-foreground/40 text-xs hover:text-gold transition-colors">
            Gestionar inventario →
          </Link>
        </div>
      </div>

      {/* Quick access */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { to: '/admin/productos', label: 'Productos', icon: Package },
          { to: '/admin/ordenes', label: 'Órdenes', icon: ShoppingCart },
          { to: '/admin/clientes', label: 'Clientes', icon: MessageCircle },
          { to: '/admin/envios', label: 'Envíos', icon: Truck },
          { to: '/admin/configuracion', label: 'Configuración', icon: DollarSign },
        ].map(item => (
          <Link key={item.to} to={item.to} className="gradient-card border border-gold/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold/30 transition-all">
            <item.icon className="w-5 h-5 text-gold" />
            <span className="font-heading text-foreground/70 text-xs uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}