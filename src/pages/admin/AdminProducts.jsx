import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = [
  "Velas de soja artesanales", "Velas ritualizadas", "Wax Melts", "Difusores",
  "Jabones terapéuticos", "Jabones ritualizados", "Productos faciales",
  "Productos labiales", "Productos para el cabello", "Productos terapéuticos",
  "Concreterapia", "Reiki a distancia", "Productos para mascotas"
];

const GROUPS = ["Velas & Aromas", "Cuidado Personal", "Bienestar & Terapia", "Mascotas"];

const emptyProduct = { name: '', description: '', price: 0, category: '', category_group: '', image_url: '', in_stock: true, featured: false, stock_quantity: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    const data = await base44.entities.Product.list('-created_date', 200);
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      category_group: product.category_group || '',
      image_url: product.image_url || '',
      in_stock: product.in_stock !== false,
      featured: product.featured || false,
      stock_quantity: product.stock_quantity || 0,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (editing) {
      await base44.entities.Product.update(editing.id, form);
      toast({ title: 'Producto actualizado' });
    } else {
      await base44.entities.Product.create(form);
      toast({ title: 'Producto creado' });
    }
    setDialogOpen(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    await base44.entities.Product.delete(id);
    toast({ title: 'Producto eliminado' });
    load();
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, image_url: file_url });
    setUploading(false);
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-gold">Productos</h1>
        <Button onClick={openNew} className="bg-gold text-mystic-900 hover:bg-gold/90 font-heading text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1" /> Nuevo
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="gradient-card border border-gold/10 rounded-xl overflow-hidden">
              <div className="aspect-video bg-mystic-800/50 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold/10"><Image className="w-8 h-8" /></div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-foreground text-sm line-clamp-1">{p.name}</h3>
                    <p className="font-body text-foreground/40 text-xs">{p.category}</p>
                  </div>
                  <span className="font-heading text-gold">${p.price?.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs font-heading px-2 py-0.5 rounded-full ${p.in_stock !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.in_stock !== false ? 'En Stock' : 'Agotado'}
                  </span>
                  {p.featured && <span className="text-xs font-heading px-2 py-0.5 rounded-full bg-gold/20 text-gold">Destacado</span>}
                  <div className="flex-1" />
                  <button onClick={() => openEdit(p)} className="text-foreground/40 hover:text-gold transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-foreground/40 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-gold/20 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold">{editing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nombre" value={form.name} onChange={update('name')} className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <Textarea placeholder="Descripción" value={form.description} onChange={update('description')} rows={3} className="bg-muted/50 border-gold/20 font-body text-foreground resize-none" />
            <Input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} step="0.01" className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
              <SelectTrigger className="bg-muted/50 border-gold/20 font-body text-foreground"><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent className="bg-card border-gold/20">{CATEGORIES.map(c => <SelectItem key={c} value={c} className="font-body">{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.category_group} onValueChange={v => setForm({ ...form, category_group: v })}>
              <SelectTrigger className="bg-muted/50 border-gold/20 font-body text-foreground"><SelectValue placeholder="Grupo" /></SelectTrigger>
              <SelectContent className="bg-card border-gold/20">{GROUPS.map(g => <SelectItem key={g} value={g} className="font-body">{g}</SelectItem>)}</SelectContent>
            </Select>
            <div>
              <label className="font-body text-foreground/60 text-sm block mb-2">Imagen</label>
              {form.image_url && <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-foreground/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gold/20 file:text-gold file:font-heading file:uppercase file:tracking-wider cursor-pointer" />
              {uploading && <p className="text-gold/60 text-xs mt-1 font-body">Subiendo...</p>}
            </div>
            <Input type="number" placeholder="Cantidad en inventario" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })} className="bg-muted/50 border-gold/20 font-body text-foreground" />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.in_stock} onCheckedChange={v => setForm({ ...form, in_stock: v })} />
                <span className="font-body text-foreground/70 text-sm">En Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
                <span className="font-body text-foreground/70 text-sm">Destacado</span>
              </label>
            </div>
            <Button onClick={handleSave} className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest">
              {editing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}