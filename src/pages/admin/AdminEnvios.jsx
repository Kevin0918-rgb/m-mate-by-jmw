import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Truck, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const emptyOption = { name: '', description: '', price: 0, active: true, sort_order: 0 };

export default function AdminEnvios() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyOption);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.ShippingOption.list('sort_order', 50);
    setOptions(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyOption);
    setDialogOpen(true);
  }

  function openEdit(opt) {
    setEditing(opt);
    setForm({ name: opt.name, description: opt.description || '', price: opt.price, active: opt.active !== false, sort_order: opt.sort_order || 0 });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (editing) {
      await base44.entities.ShippingOption.update(editing.id, form);
      toast({ title: 'Opción actualizada' });
    } else {
      await base44.entities.ShippingOption.create(form);
      toast({ title: 'Opción creada' });
    }
    setDialogOpen(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta opción de envío?')) return;
    await base44.entities.ShippingOption.delete(id);
    toast({ title: 'Opción eliminada' });
    load();
  }

  async function toggleActive(opt) {
    await base44.entities.ShippingOption.update(opt.id, { active: !opt.active });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-gold" />
          <h1 className="font-heading text-2xl text-gold">Envíos</h1>
        </div>
        <Button onClick={openNew} className="bg-gold text-mystic-900 hover:bg-gold/90 font-heading text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1" /> Nueva opción
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : options.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-foreground/40 mb-4">No hay opciones de envío configuradas.</p>
          <Button onClick={openNew} variant="outline" className="border-gold/30 text-gold">Agregar primera opción</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {options.map(opt => (
            <div key={opt.id} className={`gradient-card border rounded-xl p-4 flex items-center justify-between gap-3 ${opt.active !== false ? 'border-gold/15' : 'border-gold/5 opacity-50'}`}>
              <div className="flex-1">
                <p className="font-heading text-foreground">{opt.name}</p>
                {opt.description && <p className="font-body text-foreground/40 text-xs">{opt.description}</p>}
              </div>
              <p className="font-heading text-gold">{opt.price === 0 ? 'Gratis' : `$${opt.price?.toFixed(2)}`}</p>
              <Switch checked={opt.active !== false} onCheckedChange={() => toggleActive(opt)} />
              <button onClick={() => openEdit(opt)} className="text-foreground/40 hover:text-gold transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(opt.id)} className="text-foreground/40 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-gold/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold">{editing ? 'Editar opción' : 'Nueva opción de envío'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nombre (ej: Puerto Rico Estándar)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <Input placeholder="Descripción (opcional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <Input type="number" placeholder="Precio ($0 = Gratis)" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} step="0.01" className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <Input type="number" placeholder="Orden de aparición" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              <span className="font-body text-foreground/70 text-sm">Activo</span>
            </label>
            <Button onClick={handleSave} className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest">
              {editing ? 'Guardar Cambios' : 'Crear Opción'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}