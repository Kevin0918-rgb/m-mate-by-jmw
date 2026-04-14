import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Settings, Instagram, Phone, Mail, Facebook, Globe, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const defaultSettings = {
  business_name: 'Mímate by JMW',
  description: '',
  logo_url: '',
  email: '',
  phone: '',
  instagram: '',
  whatsapp: '',
  facebook: '',
  maintenance_mode: false,
  paypal_email: '',
  stripe_public_key: '',
};

export default function AdminConfiguracion() {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsId, setSettingsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const data = await base44.entities.StoreSettings.list('-created_date', 1);
      if (data.length > 0) {
        setSettings({ ...defaultSettings, ...data[0] });
        setSettingsId(data[0].id);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    if (settingsId) {
      await base44.entities.StoreSettings.update(settingsId, settings);
    } else {
      const created = await base44.entities.StoreSettings.create(settings);
      setSettingsId(created.id);
    }
    toast({ title: 'Configuración guardada' });
    setSaving(false);
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setSettings({ ...settings, logo_url: file_url });
    setUploading(false);
  }

  const f = (field) => (e) => setSettings({ ...settings, [field]: e.target.value });

  if (loading) return <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-gold" />
        <h1 className="font-heading text-2xl text-gold">Configuración General</h1>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Negocio */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-gold text-sm uppercase tracking-widest">Información del Negocio</h2>
          <Input placeholder="Nombre del negocio" value={settings.business_name} onChange={f('business_name')} className="bg-muted/50 border-gold/20 font-body text-foreground" />
          <Textarea placeholder="Descripción" value={settings.description} onChange={f('description')} rows={3} className="bg-muted/50 border-gold/20 font-body text-foreground resize-none" />
          <div>
            <label className="font-body text-foreground/60 text-sm block mb-2">Logo</label>
            {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="h-16 object-contain mb-2" />}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-foreground/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gold/20 file:text-gold file:font-heading file:uppercase file:tracking-wider cursor-pointer" />
            {uploading && <p className="text-gold/60 text-xs mt-1 font-body">Subiendo...</p>}
          </div>
        </div>

        {/* Contacto */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-gold text-sm uppercase tracking-widest">Contacto</h2>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input placeholder="Email de contacto" value={settings.email} onChange={f('email')} className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input placeholder="Teléfono" value={settings.phone} onChange={f('phone')} className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground" />
          </div>
        </div>

        {/* Redes sociales */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-gold text-sm uppercase tracking-widest">Redes Sociales</h2>
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input placeholder="Instagram (ej: @mimatebyJMW)" value={settings.instagram} onChange={f('instagram')} className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input placeholder="WhatsApp (número con código de país)" value={settings.whatsapp} onChange={f('whatsapp')} className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground" />
          </div>
          <div className="relative">
            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input placeholder="Facebook (URL o nombre)" value={settings.facebook} onChange={f('facebook')} className="pl-9 bg-muted/50 border-gold/20 font-body text-foreground" />
          </div>
        </div>

        {/* Pagos */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-gold text-sm uppercase tracking-widest">Configuración de Pagos</h2>
          <Input placeholder="PayPal Email" value={settings.paypal_email} onChange={f('paypal_email')} className="bg-muted/50 border-gold/20 font-body text-foreground" />
          <Input placeholder="Stripe Public Key" value={settings.stripe_public_key} onChange={f('stripe_public_key')} className="bg-muted/50 border-gold/20 font-body text-foreground" />
        </div>

        {/* Mantenimiento */}
        <div className="gradient-card border border-gold/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-foreground">Modo Mantenimiento</p>
              <p className="font-body text-foreground/40 text-xs mt-0.5">Desactiva la tienda para los visitantes</p>
            </div>
            <Switch checked={settings.maintenance_mode} onCheckedChange={v => setSettings({ ...settings, maintenance_mode: v })} />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-gold text-mystic-900 hover:bg-gold/90 font-heading uppercase tracking-widest">
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}